import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '$/services/dialog.service';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '$/services/authentication.service';
import { SeoService } from '$/services/seo.service';
import { BlockUIService } from '$/services/block-ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketsService } from '$/services/sockets.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { AlertDialogComponent } from '$/components/alert-dialog/alert-dialog.component';
import { ReportDialogComponent } from '$/components/report-dialog/report-dialog.component';
import { environment } from '@environments/environment';
import { AnswerDialogComponent } from '$/components/answer-dialog/answer-dialog.component';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-question-detail',
	templateUrl: './question-detail.component.html',
	styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
	public question: any;
	public autocomplete: any[];
	public totalQuestionsCount: number;
	public form: FormGroup;
	public questions: any[];
	public reports: any;
	public submitted: boolean;
	public thumbstate: number;
	public followed: boolean;
	public serverUrl = environment.apiUrl;
	public defaultCredits: any;
	public user: any = null;
	private socketEventsSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private socketsService: SocketsService,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private seoService: SeoService,
		private dialogService: DialogService,
		private title: Title,
		private meta: Meta,
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			if (params.has('title')) {
				this.title.setTitle(params.get('title'));
			}
		});
		if (isPlatformBrowser(this.platformId)) {
			this.user = this.authenticationService.getUser();
		}
		this.getQuestion();
		this.listenToSocket();
		this.autocomplete = [];
		this.submitted = false;
		this.thumbstate = 0;
		this.followed = false;
		this.commonService.getDefaultCredits().subscribe((res: any) => {
			if (res.data) {
				this.defaultCredits = res.data;
			}
		});
	}

	ngOnDestroy() {
		if(this.socketEventsSubscription) {
			this.socketEventsSubscription.unsubscribe();
		}
	}

	openReportDialog(questionId, answerId?) {
		if (this.authenticationService.isAuthenticated()) {
			this.dialogService.open(ReportDialogComponent, {
				data: {
					questionId: this.question._id,
					answerId: answerId? answerId: '',
				}
			}).afterClosed()
			.subscribe(newRport => {
				if (newRport) {
					this.reports.push(newRport);
				}
			});
		} else {
			this.router.navigateByUrl('/extra/login');
		}
	}

	private getQuestion() {
		this.route.paramMap.subscribe(params => {
			if (params.has('questionId')) {
				const questionId = params.get('questionId');
				this.getQuestionByQuestionId(questionId, this.user ? this.user._id : null);
			}
		});
	}

	setSeoData(question) {
		this.seoService.setPageTitle(question.title);
		let description = '';
		if(question.answers.length) {
			question.answers.forEach(function(item, index) {
				if (index === 3) {
				  return true;
				}
				description += (index + 1) + '. ';
				description += item.content + ' ';
			});
		} else {
			description = question.title;
		}
		this.seoService.updateMetaDescription(description);
	}

	getQuestionByQuestionId(questionId, userId) {
		this.blockUIService.setBlockStatus(true);
		this.commonService.getQuestionByQuestionId(questionId, userId).subscribe((res: any) => {
			this.question = res.data.question;
			this.setSeoData(this.question);
			this.seoService.createLinkForCanonicalURL();
			this.sortAnswers(this.question.answers);
			this.reports = res.data.reports;
			this.blockUIService.setBlockStatus(false);
		}, (err: HttpErrorResponse) => {
			this.snackBar.open(err.error.msg, 'Dismiss');
			this.blockUIService.setBlockStatus(false);
		});
	}

	noAnswerReport(questionId, answerId) {
		if (!this.authenticationService.isAuthenticated()) {
			return true;
		}
		return (
			!this.reports.some(
				report =>
				report.questionId === questionId && report.answerId === answerId &&
					report.reporter === this.authenticationService.getUser()._id
			)
		);
	}

	noQuestionReport(questionId) {
		if (!this.authenticationService.isAuthenticated()) {
			return true;
		}
		return (
			!this.reports.some(
				report =>
					!report.answerId && report.questionId === questionId &&
					report.reporter === this.authenticationService.getUser()._id
			)
		);
	}

	isMyQuestion(askerId) {
		if (!this.authenticationService.isAuthenticated()) {
			return false;
		}
		return (this.authenticationService.getUser()._id === askerId);
	}

	isMyAnswer(answererId) {
		if (!this.authenticationService.isAuthenticated()) {
			return false;
		}
		return (this.authenticationService.getUser()._id === answererId);
	}

	canFollow() {
		if (!this.authenticationService.isAuthenticated()) {
			return true;
		}
		return (
			!this.question.asker ||
			!(this.authenticationService.getUser()._id === this.question.asker._id) &&
			!this.question.follows.some(
				follow =>
					follow.follower &&
					follow.follower === this.authenticationService.getUser()._id
			)
		);
	}

	canAnswer(question) {
		return !!this.authenticationService.getUser() &&
			!(question.answers && question.answers.some(answer => answer.answerer && answer.answerer._id === this.authenticationService.getUser()._id)) &&
			!(question.skips && question.skips.some(skip => skip.skipper && skip.skipper._id === this.authenticationService.getUser()._id));
	}

	isAsker() {
		return (
			this.authenticationService.getUser() &&
			this.question.asker &&
			this.question.asker._id === this.authenticationService.getUser()._id
		);
	}

	openAnswerDialog(question, answer?: any) {
		if (this.authenticationService.isAuthenticated()) {
			this.dialogService
				.open(AnswerDialogComponent, {
					data: {
						question,
						answer
					}
				})
		} else {
			this.router.navigateByUrl('/extra/login');
		}
	}

	private listenToSocket() {
		this.socketEventsSubscription = this.socketsService
			.getSocketEvents()
			.pipe(filter((event: any) => event.payload))
			.subscribe((event: any) => {
				if (event.payload.type === 'answer') {
					if (event.payload.data.questionId === this.question._id) {
						if (event.name === 'createdData') {
							this.question.answers.push(event.payload.data.answer);
						}
						else {
							const index = this.question.answers.findIndex(
								currentAnswer => currentAnswer._id === event.payload.data.answer._id
							);
							if (index !== -1) {
								if (event.name === 'updatedData') {
									this.question.answers[index] = event.payload.data.answer;
								} else {
									this.question.answers.splice(index, 1);
								}
							}
						}
					}
				}
				else if (event.payload.type === 'question') {
					if (event.name === 'updatedData') {
						this.question = event.payload.data;
					}
					else if (event.name === 'deletedData') {
						this.router.navigateByUrl('/');
					}
				}
			});
	}

	addFollow(followType) {
		if (this.authenticationService.isAuthenticated()) {
			this.blockUIService.setBlockStatus(true);
			if (this.question._id && this.authenticationService.getUser()._id) {
				this.commonService.addFollow(followType, this.question._id).subscribe((res: any) => {
					this.blockUIService.setBlockStatus(false);
					this.submitted = false;
					this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
					if(res.data) {
						this.followed = true;
					}
				});
			}
		}
		else {
			this.router.navigateByUrl('/extra/login');
		}
	}

	sortAnswers(answers) {
		answers.sort((a: any, b: any) => {
			a.thumbupcnt = a.thumbupcnt ? a.thumbupcnt : 0;
			b.thumbupcnt = b.thumbupcnt ? b.thumbupcnt : 0;
			a.thumbdowncnt = a.thumbdowncnt ? a.thumbdowncnt : 0;
			b.thumbdowncnt = b.thumbdowncnt ? b.thumbdowncnt : 0;
			const temp1 = a.thumbupcnt - a.thumbdowncnt;
			const temp2 = b.thumbupcnt - b.thumbdowncnt;
			if (temp1 < temp2) {
				return 1;
			} else if (temp1 > temp2) {
				return -1;
			} else {
				return 0;
			}
		});
	}

	thumbup(answerId) {
		if (this.thumbstate == 0 || this.thumbstate == 2) {
			this.addThumb(answerId, 1);
		}
	}
	thumbdown(answerId) {
		if (this.thumbstate == 0 || this.thumbstate == 1) {
			this.addThumb(answerId, 2);
		}
	}

	addThumb(answerId, thumbType) {
		if (this.authenticationService.isAuthenticated()) {
			this.blockUIService.setBlockStatus(true);
			if (this.question._id && this.authenticationService.getUser()._id) {
				this.commonService.addThumb(
					this.question._id,
					answerId,
					thumbType
				).subscribe((res: any) => {
					if (res.data) {
						this.question = res.data;
						this.sortAnswers(this.question.answers);
					}
					this.submitted = true;
					this.blockUIService.setBlockStatus(false);
					this.snackBar.open(res.msg, 'Dismiss', { duration: 4000 });
				});
			}
		}
		else {
			this.router.navigateByUrl('/extra/login');
		}
	}

	alert() {
		this.snackBar.open("You can't see private answerer", 'Dismiss', { duration: 4000 });
	}

}
