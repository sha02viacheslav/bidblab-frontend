import { Component, OnDestroy, OnInit, Inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '$/services/dialog.service';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';

@Component({
	selector: 'app-blab',
	templateUrl: './blab.component.html',
	styleUrls: ['./blab.component.scss']
})
export class BlabComponent implements OnInit, OnDestroy, AfterViewInit {
	private socketEventsSubscription: Subscription;

	constructor(
		private fb: FormBuilder,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
		private router: Router,
		private pageScrollService: PageScrollService, 
		@Inject(DOCUMENT) private document: any
	) {
		commonService.scrollEventReciver$.subscribe(params => {
			this.onScroll();
		});
	}

	ngOnInit() {
		if(!this.commonService.blabState.questions.length) {
			this.getQuestions();
		}
	}

	ngOnDestroy() {
	}

	ngAfterViewInit() {
		if(this.commonService.blabState.questions.length && this.commonService.blabState.currentScrollTarget) {
			console.log('Go to target ', this.commonService.blabState.currentScrollTarget)
			this.pageScrollService.scroll({
				document: this.document,
				scrollTarget: '#blab-question-' + this.commonService.blabState.currentScrollTarget,
			});
		}
	}

	getDataFromSearch(data) {
		if (data) {
			this.commonService.blabState.searchValue = data.searchValue;
			this.commonService.blabState.questions = [];
			this.commonService.blabState.pageIndex = 0;
			this.getQuestions();
		}
	}

	getQuestions() {
		if (this.authenticationService.isAuthenticated()) {
			this.commonService.getQuestionsCanAnswer(this.commonService.blabState.pageSize,  this.commonService.blabState.pageIndex, this.commonService.blabState.searchValue).subscribe((res: any) => {
				this.commonService.blabState.totalQuestionsCount = res.data.count;
				res.data.questions.forEach(element => {
					this.commonService.blabState.questions.push(element);
				});
			});
		} else {
			this.commonService.getQuestions(this.commonService.blabState.pageSize,  this.commonService.blabState.pageIndex, this.commonService.blabState.searchValue).subscribe((res: any) => {
				this.commonService.blabState.totalQuestionsCount = res.data.count;
				res.data.questions.forEach(element => {
					this.commonService.blabState.questions.push(element);
				});
			});
		}
	}

	isAsker(questionId) {
		const question = this.commonService.blabState.questions.find(
			currentQuestion => currentQuestion._id === questionId
		);
		return (
			this.authenticationService.getUser() &&
			question.asker &&
			question.asker._id === this.authenticationService.getUser()._id
		);
	}

	onScroll() {
		if ((this.commonService.blabState.pageIndex + 1) * this.commonService.blabState.pageSize < this.commonService.blabState.totalQuestionsCount) {
			this.commonService.blabState.pageIndex = this.commonService.blabState.pageIndex + 1;
			this.getQuestions();
		}
	}

}

