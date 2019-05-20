import { Component, OnDestroy, Inject, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators,  FormControl  } from '@angular/forms';
import { BlockUIService } from '../../../../shared/services/block-ui.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '../../../../shared/services/form-validation.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { CommonService } from '../../../../shared/services/common.service';
import { SocketsService } from '../../../../shared/services/sockets.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { UserService } from '../../../../shared/services/user.service';
import { BidService } from '../bid.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-auction-dialog',
  templateUrl: './auction-dialog.component.html',
  styleUrls: ['./auction-dialog.component.scss']
})
export class AuctionDialogComponent implements OnInit, OnDestroy {
  user: any;
  submitted: boolean;
  infoForm: FormGroup;
  catagories: string[];
  private userUpdatesSubscription: Subscription;
  auction: any;
  formArray: FormArray;
  serverUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private blockUIService: BlockUIService,
    private commonService: CommonService,
    private socketsService: SocketsService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private bidService: BidService,
    private dialogRef: MatDialogRef<AuctionDialogComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.getUserUpdates();
    this.auction = this.data.auction;
    this.submitted = false;
    this.infoForm = this.fb.group({
      bidPrice: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(this.auction.bidblabPrice),
          this.formValidationService.isBlank,
        ]
      ]
    });
    
  }

  ngOnDestroy() {
    this.userUpdatesSubscription.unsubscribe();
  }

  checkError(form, field, error) {
    return this.formValidationService.checkError(form, field, error);
  }

  private getUserUpdates() {
    this.userUpdatesSubscription = this.authenticationService
      .getUserUpdates()
      .subscribe(user => (
        this.user = user
      ));
  }

  submitForm() {
    if (this.infoForm.valid) {
      if(this.auction.bids.some(element => element.bidPrice == this.infoForm.value.bidPrice)){
        this.snackBar.open("You have already bid this price", 'Dismiss', {
          duration: 1500
        })
      }
      else{
        this.blockUIService.setBlockStatus(true);
        this.commonService.addBid(this.auction._id, this.infoForm.value).subscribe(
          (res: any) => {
            // this.socketsService.notify('createdData', {
            //   type: 'question',
            //   data: res.data
            // });
            this.blockUIService.setBlockStatus(false);
            this.bidService.getMyCredits();
            this.snackBar.open(res.msg, 'Dismiss', {
              duration: 1500
            })
            .afterOpened()
            .subscribe(() => {
              this.submitted = true;
              this.dialogRef.close(res.data);
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
              .subscribe(() => {
                this.dialogRef.close(); 
              });
          }
        );
      }
    }
  }
}

