import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../shared/services/dialog.service';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketsService } from '../../shared/services/sockets.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { ReportDialogComponent } from '../../shared/components/report-dialog/report-dialog.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit, OnDestroy {
  question: any;
  private socketEventsSubscription: Subscription;
  private pageSize: number;
  autocomplete: any[];
  totalQuestionsCount: number;
  form: FormGroup;
  questions: any[];
  reports: any;
  submitted: boolean;
  thumbstate: number;
  followed: boolean;
  isInit: boolean;
  serverUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketsService: SocketsService,
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.isInit = false;
    this.isInit = true;
    this.getQuestion();
    this.listenToSocket();
    this.pageSize = 25;
    this.autocomplete = [];
    this.submitted = false;
    this.thumbstate = 0;
    this.followed = true;
  }

  ngOnDestroy() {
    if(this.isInit){
      this.socketEventsSubscription.unsubscribe();
    }
  }

  openReportDialog(answerId){
    if (this.authenticationService.isAuthenticated()) {
      this.dialogService
        .open(ReportDialogComponent, {
          data: {
            questionId: this.question._id,
            answerId: answerId,
          }
        })
        .afterClosed()
        .subscribe(newRport => {
          if (newRport) {
            this.reports.push(newRport);  
          }
        });
    }
    else{
      this.router.navigateByUrl('/extra/login');
    }
  }

  getQuestionByQuestionId(questionId) {
    this.blockUIService.setBlockStatus(true);
    this.commonService.getQuestionByQuestionId(questionId).subscribe(
      (res: any) => {
        this.question = res.data.question;
        this.sortAnswers(this.question.answers);
        this.reports = res.data.reports;
        this.followed = !this.canFollow();
        this.blockUIService.setBlockStatus(false);
      },
      (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.msg, 'Dismiss');
        this.blockUIService.setBlockStatus(false);
      }
    );
  }

  noReport(answerId){
    if(!this.authenticationService.isAuthenticated()){
      return true;
    }
    return (
      !this.reports.some(
          report =>
            report.answerId === answerId &&
            report.reporter === this.authenticationService.getUser()._id
        )
    );
  }

  isMyAnswer(answererId){
    if(!this.authenticationService.isAuthenticated()){
      return false;
    }
    return (this.authenticationService.getUser()._id === answererId);
  }

  canFollow() {
    if(!this.authenticationService.isAuthenticated()){
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

  isAsker() {
    return (
      this.authenticationService.getUser() &&
      this.question.asker &&
      this.question.asker._id === this.authenticationService.getUser()._id
    );
  }

  private listenToSocket() {
    this.socketEventsSubscription = this.socketsService
      .getSocketEvents()
      .pipe(filter((event: any) => event.payload))
      .subscribe((event: any) => {
        if (event.payload.type === 'answer') {
          this.snackBar.open('Answers were updated.', 'Dismiss', {
            duration: 2000
          });
          if (event.name === 'createdData') {
            this.question.answers.push(event.payload.data);
          } else {
            const index = this.question.answers.findIndex(
              currentAnswer => currentAnswer._id === event.payload.data._id
            );
            if (index !== -1) {
              if (event.name === 'updatedData') {
                this.question.answers[index] = event.payload.data;
              } else {
                this.question.answers.splice(index, 1);
              }
            }
          }
        } else {
          if (event.name === 'updatedData') {
            this.question = event.payload.data;
            this.snackBar.open('Question was updated.', 'Dismiss', {
              duration: 2000
            });
          } else if (event.name === 'deletedData') {
            this.snackBar.open('Question was deleted.', 'Dismiss');
            this.router.navigateByUrl('/');
          }
        }
      });
  }

  private getQuestion() {
    this.route.paramMap.subscribe(params => {
      if (params.has('questionId')) {
        const questionId = params.get('questionId');
        this.getQuestionByQuestionId(questionId);
      }
    });
  }

  addFollow(followType) {
    if (this.authenticationService.isAuthenticated()) {
      this.blockUIService.setBlockStatus(true);
      if (this.question._id && this.authenticationService.getUser()._id) {
        this.commonService
          .addFollow(
            followType,
            this.question._id
          )
          .subscribe(
            (res: any) => {
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(res.msg, 'Dismiss', {
                  duration: 1500
                })
                .afterOpened()
                .subscribe(() => {
                  this.followed = true;
                });
            },
            (err: HttpErrorResponse) => {
              this.submitted = false;
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
    else{
      this.router.navigateByUrl('/extra/login');
    }
  }

  sortAnswers(answers){
    answers.sort((a: any, b: any) => {
      a.thumbupcnt = a.thumbupcnt? a.thumbupcnt : 0;
      b.thumbupcnt = b.thumbupcnt? b.thumbupcnt : 0;
      a.thumbdowncnt = a.thumbdowncnt? a.thumbdowncnt : 0;
      b.thumbdowncnt = b.thumbdowncnt? b.thumbdowncnt : 0;
      const temp1 = a.thumbupcnt - a.thumbdowncnt;
      const temp2 = b.thumbupcnt - b.thumbdowncnt;
      if ( temp1 < temp2 ) {
        return 1;
      } else if ( temp1 > temp2 ) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  thumbup(answerId){
    if(this.thumbstate == 0 || this.thumbstate == 2){
      this.addThumb(answerId, 1);
    }
  }
  thumbdown(answerId){
    if(this.thumbstate == 0 || this.thumbstate == 1){
      this.addThumb(answerId, 2);
    }
  }

  addThumb(answerId, thumbType) {
    if (this.authenticationService.isAuthenticated()) {
      this.blockUIService.setBlockStatus(true);
      if (this.question._id && this.authenticationService.getUser()._id) {
        this.commonService
          .addThumb(
            this.question._id,
            answerId,
            thumbType
          )
          .subscribe(
            (res: any) => {
              this.question = res.data;
              this.sortAnswers(this.question.answers);
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(res.msg, 'Dismiss', {
                  duration: 1500
                })
                .afterOpened()
                .subscribe(() => {
                  this.submitted = true;
                });
            },
            (err: HttpErrorResponse) => {
              this.submitted = false;
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
    else{
      this.router.navigateByUrl('/extra/login');
    }
  }

  alert(){
    this.snackBar
      .open("You can't see private answerer", 'Dismiss', {
        duration: 4000
      })
  }

}
