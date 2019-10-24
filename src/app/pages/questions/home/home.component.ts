import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '$/services/dialog.service';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { QuestionDialogComponent } from '$/components/question-dialog/question-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-home-questions',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	public questions: any[] = [];
	public defaultCredits: any;
	public totalQuestionsCount: number;
	private socketEventsSubscription: Subscription;
	private pageSize: number = 10;
	public pageIndex: number = 0;
	public returnUrl: string = '';
	private searchValue: string = '';


	constructor(
		private fb: FormBuilder,
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
				this.router.navigate(['/'], { queryParams: {} });
			}
		});

		this.commonService.getDefaultCredits().subscribe((res: any) => {
			if (res.data) {
				this.defaultCredits = res.data;
			}
		});
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
		this.commonService.getQuestions(pageSize, pageIndex, search).subscribe((res: any) => {
			this.totalQuestionsCount = res.data.count;
			res.data.questions.forEach(element => {
				this.questions.push(element);
			});
		});
	}

	onScroll() {
		if ((this.pageIndex + 1) * this.pageSize < this.totalQuestionsCount) {
			this.pageIndex = this.pageIndex + 1;
			this.getQuestions(this.pageSize, this.pageIndex, this.searchValue);
		}
	}

}

