import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '$/services/dialog.service';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-myanswers',
  templateUrl: './myanswers.component.html',
  styleUrls: ['./myanswers.component.scss']
})
export class MyanswersComponent implements OnInit {

  private totalQuestionsCount: number;
  private questionsWithYourAnswers: any[];
  isInit: boolean;
  serverUrl = environment.apiUrl;

  constructor(
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.isInit = false;
    this.isInit = true;
    this.blockUIService.setBlockStatus(false);
    const observable = this.commonService.getQuestionsWithYourAnswers();
    observable.subscribe(
      (res: any) => {
        this.totalQuestionsCount = res.data.count;
        this.questionsWithYourAnswers = res.data.questionsWithYourAnswers;
        this.sortQuestionsByMyAnswerCredit(this.questionsWithYourAnswers);
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
  
  sortQuestionsByMyAnswerCredit(questions){
    questions.sort((a: any, b: any) => {
      const temp1 = a.answers[0].credit ;
      const temp2 = b.answers[0].credit ;
      if ( temp1 < temp2 ) {
        return 1;
      } else if ( temp1 > temp2 ) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  
}
