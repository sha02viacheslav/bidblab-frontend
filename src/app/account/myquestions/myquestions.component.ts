import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnswerDialogComponent } from '$/components/answer-dialog/answer-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '$/services/dialog.service';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionDialogComponent } from '$/components/question-dialog/question-dialog.component';
import { SocketsService } from '$/services/sockets.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { AlertDialogComponent } from '$/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-myquestions',
  templateUrl: './myquestions.component.html',
  styleUrls: ['./myquestions.component.scss']
})
export class MyquestionsComponent implements OnInit {

  public mytotalQuestionsCount: number;
  public myquestions: any[] = [];

  constructor(
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.mytotalQuestionsCount = 0;
    this.blockUIService.setBlockStatus(true);
    this.commonService.getQuestionsByAskerId().subscribe(
      (res: any) => {
        this.mytotalQuestionsCount = res.data.count;
        this.myquestions = res.data.questions;
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

}