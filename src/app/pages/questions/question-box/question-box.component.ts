import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from '$/services/authentication.service';
import { CommonService } from '$/services/common.service';
import { environment } from '@environments/environment';
@Component({
	selector: 'app-question-box',
	templateUrl: './question-box.component.html',
	styleUrls: ['./question-box.component.scss']
})
export class QuestionBoxComponent implements OnInit {

	@Input() questionIndex: any;
	@Input() defaultCredits: any;

	public question: any;
	form: FormGroup;
	currentState = true;
	serverUrl = environment.apiUrl;

	constructor(
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		public commonService: CommonService,
	) {
	}

	ngOnInit() {
		this.question = this.commonService.homeState.questions[this.questionIndex];
		if(this.question.answers && this.question.answers.length) {
			this.question.latestAnswer = this.question.answers
				.reduce((max, item) => max.createdAt > item.createdAt ? max : item);
		} else {
			this.question.latestAnswer = null;
		}
	}

	public saveScrollTarget() {
		this.commonService.homeState.currentScrollTarget = this.questionIndex;
	}

	alert() {
		this.snackBar.open("You can't see private answerer", 'Dismiss', { duration: 4000 });
	}

}
