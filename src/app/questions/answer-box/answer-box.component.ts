import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';
import { SocketsService } from '../../shared/services/sockets.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DialogService } from '../../shared/services/dialog.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { Subscriber } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnswerDialogComponent } from '../../shared/components/answer-dialog/answer-dialog.component';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-answer-box',
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ],
  templateUrl: './answer-box.component.html',
  styleUrls: ['./answer-box.component.scss']
})
export class AnswerBoxComponent implements OnInit {

  @Input() question: any;

  form: FormGroup;
  pre_answer: any;
  visibleState = true;
  serverUrl = environment.apiUrl;
  defaultCredits: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public commonService: CommonService,
    private socketsService: SocketsService,
    private blockUIService: BlockUIService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit() {   
    this.form = this.fb.group({
      content: '', 
    });
    
		this.commonService.getDefaultCredits().subscribe(
			(res: any) => {
					this.defaultCredits = res.data;
				},
			(err: HttpErrorResponse) => {
				}
			);
  }

  submitForm(answertype) {
    this.pre_answer = this.question.answers.find(
      answer =>
        answer.answerer &&
        answer.answerer._id === this.authenticationService.getUser()._id
    );

    if(answertype == 'skip'){
      this.visibleState = false;
    }

    if (this.form.valid) {
      this.blockUIService.setBlockStatus(true);
      //update answer
      if (this.pre_answer) {
        this.commonService
          .updateAnswer(
            this.question._id,
            this.pre_answer._id,
            this.form.value
          )
          .subscribe(
            (res: any) => {
              this.socketsService.notify('updatedData', {
                type: 'answer',
                data: Object.assign({
                    questionId: this.question._id
                  },
                  res.data
                )
              });
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(res.msg, 'Dismiss', {
                  duration: 1500
                })
                .afterOpened()
                .subscribe(() => {
                  res.data.answerer = this.authenticationService.getUser()._id;
                  this.respons_submitAnswer(res.data);
                });
            },
            (err: HttpErrorResponse) => {
              //this.submitted = false;
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(err.error.msg, 'Dismiss', {
                  duration: 4000
                })
                .afterDismissed()
                .subscribe(() => {});
            }
          );
    } else {
      //add answer
      this.commonService
        .addAnswer(this.question._id, answertype, this.form.value)
        .subscribe(
          (res: any) => {
            this.blockUIService.setBlockStatus(false);
            this.visibleState = false;
            this.socketsService.notify('createdData', {
              type: 'answer',
              data: Object.assign(
                { questionId: this.question._id },
                res.data
              )
            });
           
            this.snackBar
              .open(res.msg, 'Dismiss', {
                duration: 1500
              })
              .afterOpened()
              .subscribe(() => {
               // this.dialogRef.close(res.data);
               //this.respons_submitAnswer(res.data);
              });
            
            
            this.dialogService.
              open(AlertDialogComponent, {
                data: {
                  title: "Answer submitted",
                  comment: "You earned 8 BidBlab Credits",
                  dialog_type: "answer" 
                },
                width: '320px',
              }).afterClosed().subscribe(result => {
                if(result == 'dismiss'){
                  this.commonService.goHome();
                }
              });
          },
          (err: HttpErrorResponse) => {
            //this.submitted = false;
            this.blockUIService.setBlockStatus(false);
            this.snackBar
              .open(err.error.msg, 'Dismiss', {
                duration: 4000
              })
              .afterDismissed()
              .subscribe(() => {});
          }
        );
      }

    }
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
    }
    else {
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

}