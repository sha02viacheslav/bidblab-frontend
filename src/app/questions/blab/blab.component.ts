import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../shared/services/dialog.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { QuestionDialogComponent } from '../../shared/components/question-dialog/question-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AnswerDialogComponent } from '../../shared/components/answer-dialog/answer-dialog.component';
import { SocketsService } from '../../shared/services/sockets.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-blab',
  templateUrl: './blab.component.html',
  styleUrls: ['./blab.component.scss']
})
export class BlabComponent implements OnInit, OnDestroy {
  form: FormGroup;
  questions: any[] = [];
  totalQuestionsCount: number;
  autocomplete: any[];
  private autocompleteSubscription: Subscription;
  private socketEventsSubscription: Subscription;
  private pageSize: number = 10;
  pageIndex: number = 0;
  isInit: boolean;
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
  ) {
    commonService.scrollEventReciver$.subscribe(params => {
      this.onScroll();
    });
  }

  ngOnInit() {
    this.newQuestionFlag = false;
    this.form = this.fb.group({
      search: ''
    });
    this.autocomplete = [];
    this.form = this.fb.group({
      search: ''
    });

		this.commonService.getDefaultCredits().subscribe(
			(res: any) => {
					this.defaultCredits = res.data;
				},
			(err: HttpErrorResponse) => {
				}
      );
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
    this.getQuestions(this.pageSize, this.pageIndex, this.form.value.search);
    this.listenToSocket();   
  }

  ngOnDestroy() {
    // this.autocompleteSubscription.unsubscribe();
    // this.socketEventsSubscription.unsubscribe();
  }

  searchBoxAction(){
    if(this.newQuestionFlag){
      this.newQuestionFlag = false;
      this.openQuestionDialog(this.form.value.search);
    }
    else{
      this.questions = [];
      this.pageIndex = 0;
      this.getQuestions(this.pageSize, this.pageIndex, this.form.value.search);
      this.autocomplete = [];
    }
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
            this.dialogService.
                open(AlertDialogComponent, {
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

  openAnswerDialog(questionId, answer?: any) {
    if (this.authenticationService.isAuthenticated()) {
      this.dialogService
        .open(AnswerDialogComponent, {
          data: {
            questionId,
            answer
          }
        })
        .afterClosed()
        .subscribe(newAnswer => {
          if (newAnswer) {
            let index = this.questions.findIndex(
              question => question._id === questionId
            );
            if (index !== -1) {
              const question = this.questions[index];
              if (answer) {
                index = question.answers.findIndex(
                  currentAnswer => currentAnswer._id === answer._id
                );
                if (index !== -1) {
                  question.answers[index] = newAnswer;
                }
              } else {
                question.answers.push(newAnswer);
              }
            }
          }
        });
    } 
    else {
      this.router.navigateByUrl('/extra/login');
    }
  }

  getQuestions(pageSize, pageIndex, search) {
    if (this.authenticationService.isAuthenticated()) {
      this.commonService.getQuestionsCanAnswer(pageSize, pageIndex, search).subscribe(
        (res: any) => {
          this.totalQuestionsCount = res.data.count;
          res.data.questions.forEach(element => {
            this.questions.push(element);
          });
        },
        (err: HttpErrorResponse) => {
        }
      );
    }
    else {
      this.commonService.getQuestions(pageSize, pageIndex, search).subscribe(
        (res: any) => {
          this.totalQuestionsCount = res.data.count;
          res.data.questions.forEach(element => {
            this.questions.push(element);
          });
        },
        (err: HttpErrorResponse) => {
        }
      );
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

  private listenToSocket() {
    this.socketEventsSubscription = this.socketsService
      .getSocketEvents()
      .pipe(filter((event: any) => event.payload))
      .subscribe((event: any) => {
        this.snackBar.open('Questions were updated.', 'Dismiss', {
          duration: 2000
        });
        if (event.payload.type === 'question') {
          if (event.name === 'createdData') {
            this.totalQuestionsCount++;
            if (this.questions.length < this.pageSize) {
              this.questions.push(event.payload.data);
            }
          } else {
            const index = this.questions.findIndex(
              currentQuestion => currentQuestion._id === event.payload.data._id
            );
            if (index !== -1) {
              if (event.name === 'updatedData') {
                this.questions[index] = event.payload.data;
              } else {
                this.questions.splice(index, 1);
                this.totalQuestionsCount--;
              }
            }
          }
        } else {
          let index = this.questions.findIndex(
            currentQuestion =>
              currentQuestion._id === event.payload.data.questionId
          );
          if (index !== -1) {
            const question = this.questions[index];
            if (event.name === 'createdData') {
              question.answers.push(event.payload.data);
            } else {
              index = question.answers.findIndex(
                currentAnswer => currentAnswer._id === event.payload.data._id
              );
              if (index !== -1) {
                if (event.name === 'updatedData') {
                  question.answers[index] = event.payload.data;
                } else {
                  question.answers.splice(index, 1);
                }
              }
            }
          }
        }
      });
  }

  onScroll() {  
    if((this.pageIndex + 1) * this.pageSize < this.totalQuestionsCount){
      this.pageIndex = this.pageIndex + 1;
      this.getQuestions(this.pageSize, this.pageIndex, this.form.value.search);
    } 
  } 

}

