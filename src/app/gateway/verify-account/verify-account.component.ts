import { Component, OnInit } from '@angular/core';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../shared/services/authentication.service';
import * as jwtDecode from 'jwt-decode';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { takeWhile, filter } from 'rxjs/operators';
import { DialogService } from '../../shared/services/dialog.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public commonService: CommonService,
    private blockUIService: BlockUIService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private swUpdate: SwUpdate,
    private router: Router,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.checkVerificationToken();
    this.checkResetPasswordToken();
  }

  private checkResetPasswordToken() {
    this.route.paramMap.subscribe(params => {
      if (params.has('resetPasswordToken')) {
        if (!this.authenticationService.isAuthenticated()) {
          const token = params.get('resetPasswordToken');
          this.commonService.checkResetPasswordToken(token).subscribe(
            (res: any) => {
              this.router.navigateByUrl(`/extra/resetpassword/${token}/${res.data}`);
            },
            (err: HttpErrorResponse) => {
              this.snackBar.open(err.error.msg, 'Dismiss');
              this.router.navigateByUrl('/');
            }
          );
        } else {
          this.snackBar.open('You are already logged in.', 'Dismiss');
          this.router.navigateByUrl('/');
        }
      }
    });
  }

  private checkVerificationToken() {
    this.route.paramMap.subscribe(params => {
      if (params.has('verificationToken')) {
        const token = params.get('verificationToken');
        this.verifyAccount(token);
      }
    });
  }

  private verifyAccount(token) {
    this.commonService.verifyAccount(token).subscribe((res: any) => {
      this.snackBar.open(res.msg, 'Dismiss', { duration: 3000 }).afterOpened()
      .subscribe(() => {
        this.blockUIService.setBlockStatus(false);
        if(res.data) {
          this.authenticationService.setToken(res.data);
        } 
        this.commonService.goHome();
      });
    });
  }
}


