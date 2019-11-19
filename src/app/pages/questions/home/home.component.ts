import { Component, OnDestroy, OnInit, Inject, AfterViewInit, AfterContentInit } from '@angular/core';
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
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';

@Component({
	selector: 'app-home-questions',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
	public defaultCredits: any;
	public returnUrl: string = '';


	constructor(
		private fb: FormBuilder,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
		private router: Router,
		private route: ActivatedRoute,
		private pageScrollService: PageScrollService, 
		@Inject(DOCUMENT) private document: any
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
		if(!this.commonService.homeState.questions.length) {
			this.getQuestions();
		}
	}

	ngOnDestroy() {
	}

	ngAfterViewInit() {
		if(this.commonService.homeState.questions.length && this.commonService.homeState.currentScrollTarget) {
			console.log('Go to target ', this.commonService.homeState.currentScrollTarget)
			this.pageScrollService.scroll({
				document: this.document,
				scrollTarget: '#home-question-' + this.commonService.homeState.currentScrollTarget,
			});
		}
	}

	ngAfterContentInit() {
		
	}

	getDataFromSearch(data) {
		if (data) {
			this.commonService.homeState.searchValue = data.searchValue;
			this.commonService.homeState.questions = [];
			this.commonService.homeState.pageIndex = 0;
			this.getQuestions();
		}
	}

	getQuestions() {
		this.commonService.getQuestions(this.commonService.homeState.pageSize,  this.commonService.homeState.pageIndex, this.commonService.homeState.searchValue).subscribe((res: any) => {
			this.commonService.homeState.totalQuestionsCount = res.data.count;
			res.data.questions.forEach(element => {
				this.commonService.homeState.questions.push(element);
			});
		});
	}

	onScroll() {
		console.log('on scroll', (this.commonService.homeState.pageIndex + 1) * this.commonService.homeState.pageSize, this.commonService.homeState.totalQuestionsCount)
		if ((this.commonService.homeState.pageIndex + 1) * this.commonService.homeState.pageSize < this.commonService.homeState.totalQuestionsCount) {
			this.commonService.homeState.pageIndex = this.commonService.homeState.pageIndex + 1;
			this.getQuestions();
		}
	}

}

