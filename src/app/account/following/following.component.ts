import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnswerDialogComponent } from '../../shared/components/answer-dialog/answer-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../shared/services/dialog.service';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionDialogComponent } from '../../shared/components/question-dialog/question-dialog.component';
import { SocketsService } from '../../shared/services/sockets.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  
  private followingQuestionsCount: number;
  private followingQuestions: any[] = [];
  private followingUsersCount: number;
  private followingUsers: any[] = [];
  isInit: boolean;
  serverUrl = environment.apiUrl;
  
  constructor(
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService
  ) {}
  
  ngOnInit() {
    this.isInit = false;
    this.isInit = true;
    this.followingQuestionsCount = 0;
    this.followingUsersCount = 0;
    this.blockUIService.setBlockStatus(true);
    const observableQuestion = this.commonService.getQuestionsFollowing();
    observableQuestion.subscribe(
      (res: any) => {
        this.followingQuestionsCount = res.data.count;
        this.followingQuestions = res.data.questions;
        this.blockUIService.setBlockStatus(false);
        this.snackBar.open(res.msg, 'Dismiss', {
          duration: 1500
        });
      },
      (err: HttpErrorResponse) => {
        this.blockUIService.setBlockStatus(false);
        this.snackBar.open(err.error.msg, 'Dismiss', {
          duration: 1500
        });
      }
    );
    const observableUser = this.commonService.getUsersFollowing();
    observableUser.subscribe(
      (res: any) => {
        this.followingUsersCount = res.data.count;
        this.followingUsers = res.data.users;
        this.blockUIService.setBlockStatus(false);
        this.snackBar.open(res.msg, 'Dismiss', {
          duration: 1500
        });
      },
      (err: HttpErrorResponse) => {
        this.blockUIService.setBlockStatus(false);
        this.snackBar.open(err.error.msg, 'Dismiss', {
          duration: 1500
        });
      }
    );
  }

  deleteFollow(followType, objectId) {
    this.blockUIService.setBlockStatus(true);
    if (objectId && this.authenticationService.getUser()._id) {
      this.commonService
        .deleteFollow(
          followType,
          objectId
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
                if(followType == 'question'){
                  const index = this.followingQuestions.findIndex(
                    currentQuestion => currentQuestion._id === objectId
                  );
                  if (index !== -1) {
                    this.followingQuestions.splice(index, 1);
                  }
                }
                else{
                  const index = this.followingUsers.findIndex(
                    currentUser => currentUser._id === objectId
                  );
                  if (index !== -1) {
                    this.followingUsers.splice(index, 1);
                  }
                }
              });
          },
          (err: HttpErrorResponse) => {
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