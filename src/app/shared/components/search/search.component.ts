import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { CommonService } from '../../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../../shared/services/dialog.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { BlockUIService } from '../../../shared/services/block-ui.service';
import { QuestionDialogComponent } from '../../../shared/components/question-dialog/question-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AnswerDialogComponent } from '../../../shared/components/answer-dialog/answer-dialog.component';
import { SocketsService } from '../../../shared/services/sockets.service';
import { AlertDialogComponent } from '../../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() sendData : EventEmitter <any> = new EventEmitter<any>();
  form: FormGroup;
  questions: any[];
  totalQuestionsCount: number;
  autocomplete: any[];
  private autocompleteSubscription: Subscription;
  private socketEventsSubscription: Subscription;
  private pageSize: number;
  newQuestionFlag: boolean;
  defaultCredits: any;

 
  constructor(
    private fb: FormBuilder,
    private socketsService: SocketsService,
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.newQuestionFlag = false;
    this.pageSize = 10;
    this.autocomplete = [];
    this.form = this.fb.group({
      search: ''
    });

		this.commonService.getDefaultCredits().subscribe((res: any) => {
      if(res.data) {
        this.defaultCredits = res.data;
      }
    });
      
    this.autocompleteSubscription = this.form
      .get('search')
      .valueChanges.pipe(debounceTime(100))
      .subscribe(text => {
        if (text.trim()) {
          this.commonService
            .getQuestions(null, null, text)
            .subscribe((res: any) => {
              this.autocomplete = res.data.questions;
              if(!this.autocomplete.length){
                this.newQuestionFlag = true;
              }
              else{
                this.newQuestionFlag = false;
              }
            });
        } else {
          this.autocomplete.splice(0);
          this.newQuestionFlag = false;
        }
      });
  }

  ngOnDestroy() {
    // this.autocompleteSubscription.unsubscribe();
  }

  openQuestionDialog(newTitle?: String, question?: any) {
    if (this.authenticationService.isAuthenticated()) {
      this.dialogService
        .open(QuestionDialogComponent, {
          data: {
            question,
            newTitle,
          },
          width: '800px'
        })
        .afterClosed()
        .subscribe(newQuestion => {
          if (newQuestion) {
            if (question) {
              const index = this.questions.findIndex(
                currentQuestion => currentQuestion._id === question._id
              );
              if (index !== -1) {
                this.questions[index] = newQuestion;
              }
            } else {
              this.questions.push(newQuestion);
            }
            this.dialogService.open(AlertDialogComponent, {
              data: {
                title: "Question submitted",
                comment: " ",
                dialog_type: "ask" 
              },
              width: '320px',
            }).afterClosed().subscribe(result => {
              if(result == 'more'){
                this.openQuestionDialog();
              }
            });
          }
        });
    } else {
      this.router.navigateByUrl('/extra/login');
    }
  }

  searchBoxAction(){
    if(this.newQuestionFlag){
      this.openQuestionDialog(this.form.value.search);
      this.newQuestionFlag = false;
    } else {
      this.sendData.emit({searchValue: this.form.value.search});
    }
  }
   
}
