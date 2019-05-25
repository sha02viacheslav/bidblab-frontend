import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../shared/services/dialog.service';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {

  private questionCredits: number = 0;
  private optionalImageCredits: number = 0;
  private answerCredits: number = 0;
  private referalCredits: number = 0;
  private totalCredits: number = 0;
  private loseCredits: number = 0;
  private availableCredits: number = 0;
  isInit: boolean;

  constructor(
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.isInit = false;
    this.isInit = true;
    this.blockUIService.setBlockStatus(false);
    this.commonService.getMyCredits().subscribe(
      (res: any) => {
        this.questionCredits = res.data.credits.questionCredits;
        this.optionalImageCredits = res.data.credits.optionalImageCredits;
        this.answerCredits = res.data.credits.answerCredits;
        this.referalCredits = res.data.credits.referalCredits;
        this.totalCredits = this.questionCredits + this.optionalImageCredits + this.answerCredits + this.referalCredits;
        this.loseCredits = res.data.credits.loseCredits;
        this.availableCredits = this.totalCredits - this.loseCredits;
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
