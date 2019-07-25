import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '$/services/dialog.service';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-blab',
	templateUrl: './blab.component.html',
	styleUrls: ['./blab.component.scss']
})
export class BlabComponent implements OnInit, OnDestroy {
	public questions: any[] = [];
	public totalQuestionsCount: number;
	public pageIndex: number = 0;
	private socketEventsSubscription: Subscription;
	private pageSize: number = 10;
	private searchValue: string = '';

	constructor(
		private fb: FormBuilder,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
		private router: Router
	) {
		commonService.scrollEventReciver$.subscribe(params => {
			this.onScroll();
		});
	}

	ngOnInit() {
		this.getQuestions(this.pageSize, this.pageIndex, this.searchValue);
	}

	ngOnDestroy() {
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
		if (this.authenticationService.isAuthenticated()) {
			this.commonService.getQuestionsCanAnswer(pageSize, pageIndex, search).subscribe((res: any) => {
				this.totalQuestionsCount = res.data.count;
				res.data.questions.forEach(element => {
					this.questions.push(element);
				});
			});
		} else {
			this.commonService.getQuestions(pageSize, pageIndex, search).subscribe((res: any) => {
				this.totalQuestionsCount = res.data.count;
				res.data.questions.forEach(element => {
					this.questions.push(element);
				});
			});
		}
	}

	isAsker(questionId) {
		const question = this.questions.find(
			currentQuestion => currentQuestion._id === questionId
		);
		return (
			this.authenticationService.getUser() &&
			question.asker &&
			question.asker._id === this.authenticationService.getUser()._id
		);
	}

	onScroll() {
		if ((this.pageIndex + 1) * this.pageSize < this.totalQuestionsCount) {
			this.pageIndex = this.pageIndex + 1;
			this.getQuestions(this.pageSize, this.pageIndex, this.searchValue);
		}
	}

}

