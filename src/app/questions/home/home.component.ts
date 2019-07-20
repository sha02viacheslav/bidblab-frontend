import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../shared/services/dialog.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { QuestionDialogComponent } from '../../shared/components/question-dialog/question-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SocketsService } from '../../shared/services/sockets.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

@Component({
	selector: 'app-home-questions',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	public questions: any[] = [];
	public totalQuestionsCount: number;
	private socketEventsSubscription: Subscription;
	private pageSize: number = 10;
	public pageIndex: number = 0;
	public returnUrl: string = '';
	private searchValue: string = '';


	constructor(
		private fb: FormBuilder,
		private socketsService: SocketsService,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
		private router: Router,
		private route: ActivatedRoute
	) {
		commonService.scrollEventReciver$.subscribe(params => {
			this.onScroll();
		});
	}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params['returnUrl'] || '/';
			if (params['returnUrl']) {
				this.router.navigateByUrl('/extra/login');
			} else {
				this.router.navigate(['/questions/home'], { queryParams: {} });
			}
		});

		this.getQuestions(this.pageSize, this.pageIndex, this.searchValue);
		this.listenToSocket();
	}

	ngOnDestroy() {
		if (this.socketEventsSubscription) {
			// this.socketEventsSubscription.unsubscribe();
		}
	}

	getDataFromSearch(data) {
		if (data) {
			this.searchValue = data.searchValue;
			this.questions = [];
			this.pageIndex = 0;
			this.getQuestions(this.pageSize, this.pageIndex, this.searchValue);
		}
	}

	getQuestions(pageSize, pageIndex, search) {
		this.commonService.getQuestions(pageSize, pageIndex, search).subscribe((res: any) => {
			this.totalQuestionsCount = res.data.count;
			res.data.questions.forEach(element => {
				this.questions.push(element);
			});
		});
	}

	private listenToSocket() {
		this.socketEventsSubscription = this.socketsService
			.getSocketEvents()
			.pipe(filter((event: any) => event.payload))
			.subscribe((event: any) => {
				if (event.payload.type === 'question') {
					if (event.name === 'createdData') {
						// this.totalQuestionsCount++;
						// if (this.questions.length < this.pageSize) {
						//   this.questions.push(event.payload.data);
						// }
					} else {
						const index = this.questions.findIndex(
							currentQuestion => currentQuestion._id === event.payload.data._id
						);
						if (index !== -1) {
							if (event.name === 'updatedData') {
								this.questions[index] = event.payload.data;
							} else {
								this.questions.splice(index, 1);
								this.totalQuestionsCount--;
							}
						}
					}
				} else if (event.payload.type === 'answer') {
					let index = this.questions.findIndex(
						currentQuestion =>
							currentQuestion._id === event.payload.data.questionId
					);
					if (index !== -1) {
						const question = this.questions[index];
						if (event.name === 'createdData') {
							question.answers.push(event.payload.data.answer);
						} else {
							index = question.answers.findIndex(
								currentAnswer => currentAnswer._id === event.payload.data.answer._id
							);
							if (index !== -1) {
								if (event.name === 'updatedData') {
									question.answers[index] = event.payload.data.answer;
								} else {
									question.answers.splice(index, 1);
								}
							}
						}
					}
				}
			});
	}

	onScroll() {
		if ((this.pageIndex + 1) * this.pageSize < this.totalQuestionsCount) {
			this.pageIndex = this.pageIndex + 1;
			this.getQuestions(this.pageSize, this.pageIndex, this.searchValue);
		}
	}

}

