import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-question-box',
  templateUrl: './question-box.component.html',
  styleUrls: ['./question-box.component.scss']
})
export class QuestionBoxComponent implements OnInit {

  @Input() question: any;
  
  form: FormGroup;
  currentState = true;
  serverUrl = environment.apiUrl;

  constructor(
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit() {
  }

  isAdmin() {
    return this.authenticationService.isAdmin();
  }

  canAnswer(questionId) {
    return (
      !this.authenticationService.getUser() ||
      !this.question
        .answers.some(
          answer =>
            answer.answerer &&
            answer.answerer._id === this.authenticationService.getUser()._id
        )
    );
  }

  alert(){
    this.snackBar
      .open("You can't see private answerer", 'Dismiss', {
        duration: 4000
      })
  }

}
