import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '$/services/common.service';
import { BlockUIService } from '$/services/block-ui.service';
import { AuthenticationService } from '$/services/authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DialogService } from '$/services/dialog.service';
import { environment } from '@environments/environment';
import { AnswerDialogComponent } from '$/components/answer-dialog/answer-dialog.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-answer-box',
	animations: [
		trigger('flyInOut', [
			state('in', style({ transform: 'translateX(0)' })),
			transition('* => void', [
				animate(100, style({ transform: 'translateX(100%)' }))
			])
		])
	],
	templateUrl: './answer-box.component.html',
	styleUrls: ['./answer-box.component.scss']
})
export class AnswerBoxComponent implements OnInit {

	@Input() questionIndex: any;

	public question: any;
	form: FormGroup;
	pre_answer: any;
	visibleState = true;
	serverUrl = environment.apiUrl;
	defaultCredits: any;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		public commonService: CommonService,
		private blockUIService: BlockUIService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
	) {
	}

	ngOnInit() {
		this.question = this.commonService.blabState.questions[this.questionIndex];
		this.form = this.fb.group({
			content: '',
		});

		this.commonService.getDefaultCredits().subscribe((res: any) => {
			if (res.data) {
				this.defaultCredits = res.data;
			}
		});
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
				.afterClosed()
				.subscribe(addAnswerFlag => {
					if (addAnswerFlag) {
						this.visibleState = false;
					}
				});
		} else {
			this.router.navigateByUrl('/extra/login');
		}
	}

	respons_submitAnswer(newAnswer?: any) {
		if (newAnswer) {
			let index = this.question.answers.findIndex(
				currentAnswer => currentAnswer._id === newAnswer._id
			);
			if (index !== -1) {
				this.question.answers[index] = newAnswer;
			} else {
				this.question.answers.push(newAnswer);
			}
		}
	}

	public saveScrollTarget() {
		this.commonService.blabState.currentScrollTarget = this.questionIndex;
	}

}