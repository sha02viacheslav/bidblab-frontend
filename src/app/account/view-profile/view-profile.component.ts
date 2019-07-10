import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { AnswerDialogComponent } from '../../shared/components/answer-dialog/answer-dialog.component';
import { DialogService } from '../../shared/services/dialog.service';
import { CommonService } from '../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionDialogComponent } from '../../shared/components/question-dialog/question-dialog.component';
import { SocketsService } from '../../shared/services/sockets.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { environment } from '../../../environments/environment';
import { MatOption } from '@angular/material';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  user: any;
  submitted: boolean;
  passwordVisibility: boolean;
  infoForm: FormGroup;
  passwordForm: FormGroup;
  private userUpdatesSubscription: Subscription;
  selected_tag: string[];
  questions: any[];
  total_questions: number;
  answers: any[];
  total_answers: number;
  answerTags: string[];
  questionTags: string[];
  followed: boolean;
  isInit: boolean;
  serverUrl = environment.apiUrl;
  @ViewChild('allAnswerTagsSelected') private allAnswerTagsSelected: MatOption;
  @ViewChild('allQuestionTagsSelected') private allQuestionTagsSelected: MatOption;
  tagsOfAnswerForm: FormGroup;
  tagsOfQuestionForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketsService: SocketsService,
    public commonService: CommonService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private authenticationService: AuthenticationService,
    private blockUIService: BlockUIService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.getUser();
    this.getUserData(this.user._id);
    this.followed = true;
    this.selected_tag = ["alltags"];
    this.tagsOfAnswerForm = this.fb.group({
      tagsOfAnswer: new FormControl('')
    }); 
    this.tagsOfQuestionForm = this.fb.group({
      tagsOfQuestion: new FormControl('')
    }); 
  }

  private getUserData(userId) {
    this.getUserDataByuserId(userId);
    this.getUserAnswerByuserId(userId, null);
    this.getUserQuestionByuserId(userId, null);
  }

  getUserDataByuserId(userId){
    this.blockUIService.setBlockStatus(true);
    this.commonService.getUserDataByuserId(userId).subscribe(
      (res: any) => {
        this.user = res.data.user;
        this.blockUIService.setBlockStatus(false);
      },
      (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.msg, 'Dismiss');
        this.blockUIService.setBlockStatus(false);
      }
    );
  }

  getUserAnswerByuserId(userId, interestFilter){
    this.blockUIService.setBlockStatus(true);
    this.commonService.getUserAnswerByuserId(userId, interestFilter).subscribe(
      (res: any) => {
        this.answers = res.data.answers;
        this.total_answers = res.data.total_answers;
        this.answerTags = res.data.answerTags;
        this.snackBar
          .open(res.msg, 'Dismiss', {
            duration: 1500
          })
          .afterOpened()
          .subscribe(() => {
            this.blockUIService.setBlockStatus(false);
          });
      },
      (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.msg, 'Dismiss');
        this.blockUIService.setBlockStatus(false);
      }
    );
  }

  getUserQuestionByuserId(userId, interestFilter){
    this.blockUIService.setBlockStatus(true);
    this.commonService.getUserQuestionByuserId(userId, interestFilter).subscribe(
      (res: any) => {
        this.total_questions = res.data.total_questions;
        this.questions = res.data.questions;
        this.questionTags = res.data.questionTags;
        this.snackBar
          .open(res.msg, 'Dismiss', {
            duration: 1500
          })
          .afterOpened()
          .subscribe(() => {
            this.blockUIService.setBlockStatus(false);
          });
      },
      (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.msg, 'Dismiss');
        this.blockUIService.setBlockStatus(false);
      }
    );
  }

  changeAnswerTag()
  {
    this.getUserAnswerByuserId(this.user._id, this.tagsOfAnswerForm.value.tagsOfAnswer);
  }

  changeQuestionTag()
  {
    this.getUserQuestionByuserId(this.user._id, this.tagsOfQuestionForm.value.tagsOfQuestion);
  }

  tosslePerOneOfAnswer(all){ 
    if (this.allAnswerTagsSelected.selected) {  
      this.allAnswerTagsSelected.deselect();
      return false;
    }
    if(this.tagsOfAnswerForm.controls.tagsOfAnswer.value.length==this.answerTags.length){
      this.allAnswerTagsSelected.select();
    }
  }

  toggleAllSelectionOfAnswer() {
    if (this.allAnswerTagsSelected.selected) {
      this.tagsOfAnswerForm.controls.tagsOfAnswer
        .patchValue([...this.answerTags.map(item => item), 0]);
    } 
    else {
      this.tagsOfAnswerForm.controls.tagsOfAnswer.patchValue([]);
    }
  }

  tosslePerOneOfQuestion(){ 
    if (this.allQuestionTagsSelected.selected) {  
      this.allQuestionTagsSelected.deselect();
      return false;
    }
    if(this.tagsOfQuestionForm.controls.tagsOfQuestion.value.length==this.questionTags.length){
      this.allQuestionTagsSelected.select();
    }
  }

  toggleAllSelectionOfQuestion() {
    if (this.allQuestionTagsSelected.selected) {
      this.tagsOfQuestionForm.controls.tagsOfQuestion
        .patchValue([...this.questionTags.map(item => item), 0]);
    } 
    else {
      this.tagsOfQuestionForm.controls.tagsOfQuestion.patchValue([]);
    }
  }

}
