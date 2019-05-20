import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../shared/services/dialog.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
// import { Question } from '../../shared/models/question.model';
import { QuestionDialogComponent } from '../../shared/components/question-dialog/question-dialog.component';
// import { LoginComponent } from '../../shared/components/login/login.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import { AnswerDialogComponent } from '../../shared/components/answer-dialog/answer-dialog.component';
// import { Answer } from '../../shared/models/answer.model';
// import { SocketsService } from '../../shared/services/sockets.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { resource } from 'selenium-webdriver/http';


@Component({
  selector: 'app-home-questions',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  form: FormGroup;
  questions: any[] = [];
  totalQuestionsCount: number;
  autocomplete: any[];
  private autocompleteSubscription: Subscription;
  private socketEventsSubscription: Subscription;
  private pageSize: number = 10;
  pageIndex: number = 0;
  newQuestionFlag: boolean;
  returnUrl: string = '';
  defaultCredits: any;

 
  constructor(
    private fb: FormBuilder,
    // private socketsService: SocketsService,
    private blockUIService: BlockUIService,
    private commonService: CommonService,
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
    this.route.queryParams
      .subscribe(params => {
        this.returnUrl = params['returnUrl'] || '/';
        if(params['returnUrl']){
          // setTimeout(() => this.openLogin() );
        }
        else{
          this.router.navigate(['/questions/home'], {
            queryParams: { }
          });
        }
      });  

    this.commonService.getDefaultCredits().subscribe(
      (res: any) => {
          this.defaultCredits = res.data;
        },
      (err: HttpErrorResponse) => {
        }
      );  
    this.newQuestionFlag = false;
    this.autocomplete = [];
    this.form = this.fb.group({
      search: ''
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
    this.getQuestions();
    // this.listenToSocket();
  }

  ngOnDestroy() {
    this.autocompleteSubscription.unsubscribe();
    // this.socketEventsSubscription.unsubscribe();
  }

  openQuestionDialog(newTitle?: String, question?: any) {
    if (this.authenticationService.isAuthenticated()) {
      this.dialogService
        .open(QuestionDialogComponent, {
          data: {
            question,
            newTitle,
          },
          width: '600px'
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
    }
    else{
      this.router.navigateByUrl('/');
    }
  }


  // openLogin(){
  //   this.dialogService.open(LoginComponent).afterClosed().subscribe(result => {
  //     if(result == 'OK'){
  //       this.router.navigateByUrl(this.returnUrl);
  //     }
  //     else{
  //       this.router.navigate(['/questions/home'], {
  //         queryParams: { }
  //       });
  //     }
  //   })
  // }

  // openAnswerDialog(questionId, answer?: Answer) {
  //   if (this.authenticationService.isAuthenticated()) {
  //     this.dialogService
  //       .open(AnswerDialogComponent, {
  //         data: {
  //           questionId,
  //           answer
  //         }
  //       })
  //       .afterClosed()
  //       .subscribe(newAnswer => {
  //         if (newAnswer) {
  //           let index = this.questions.findIndex(
  //             question => question._id === questionId
  //           );
  //           if (index !== -1) {
  //             const question = this.questions[index];
  //             if (answer) {
  //               index = question.answers.findIndex(
  //                 currentAnswer => currentAnswer._id === answer._id
  //               );
  //               if (index !== -1) {
  //                 question.answers[index] = newAnswer;
  //               }
  //             } else {
  //               question.answers.push(newAnswer);
  //             }
  //           }
  //         }
  //       });
  //   } else {
  //     this.dialogService.open(LoginComponent);
  //   }
  // }

  searchBoxAction(){
    if(this.newQuestionFlag){
      this.newQuestionFlag = false;
      this.openQuestionDialog(this.form.value.search);
    }
    else{
      this.pageIndex = 0;
      this.questions = [];
      this.getQuestions();
    }
  }

  getQuestions() {
    this.autocomplete.splice(0);
    this.commonService.getQuestions(
        this.pageSize,
        this.pageIndex,
        this.form.value.search).subscribe(
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

  isAdmin() {
    return this.authenticationService.isAdmin();
  }

  canAnswer(questionId) {
    return (
      !this.authenticationService.getUser() ||
      !this.questions
        .find(question => question._id === questionId)
        .answers.some(
          answer =>
            answer.answerer &&
            answer.answerer._id === this.authenticationService.getUser()._id
        )
    );
  }

  // private listenToSocket() {
  //   this.socketEventsSubscription = this.socketsService
  //     .getSocketEvents()
  //     .pipe(filter((event: any) => event.payload))
  //     .subscribe((event: any) => {
  //       this.snackBar.open('Questions were updated.', 'Dismiss', {
  //         duration: 2000
  //       });
  //       if (event.payload.type === 'question') {
  //         if (event.name === 'createdData') {
  //           this.totalQuestionsCount++;
  //           if (this.questions.length < this.pageSize) {
  //             this.questions.push(event.payload.data);
  //           }
  //         } else {
  //           const index = this.questions.findIndex(
  //             currentQuestion => currentQuestion._id === event.payload.data._id
  //           );
  //           if (index !== -1) {
  //             if (event.name === 'updatedData') {
  //               this.questions[index] = event.payload.data;
  //             } else {
  //               this.questions.splice(index, 1);
  //               this.totalQuestionsCount--;
  //             }
  //           }
  //         }
  //       } else {
  //         let index = this.questions.findIndex(
  //           currentQuestion =>
  //             currentQuestion._id === event.payload.data.questionId
  //         );
  //         if (index !== -1) {
  //           const question = this.questions[index];
  //           if (event.name === 'createdData') {
  //             question.answers.push(event.payload.data);
  //           } else {
  //             index = question.answers.findIndex(
  //               currentAnswer => currentAnswer._id === event.payload.data._id
  //             );
  //             if (index !== -1) {
  //               if (event.name === 'updatedData') {
  //                 question.answers[index] = event.payload.data;
  //               } else {
  //                 question.answers.splice(index, 1);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     });
  // }

  onScroll() {
    if((this.pageIndex + 1) * this.pageSize < this.totalQuestionsCount){
      this.pageIndex = this.pageIndex + 1;
      this.getQuestions();
    } 
  }  
  
}

