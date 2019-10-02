import { Component, OnDestroy, Inject, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BlockUIService } from '$/services/block-ui.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '$/services/form-validation.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { CommonService } from '$/services/common.service';
import { SocketsService } from '$/services/sockets.service';
import { AuthenticationService } from '$/services/authentication.service';
import { BidService } from '$/services/bid.service';
import { environment } from '@environments/environment';

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
	auction: any;
	formArray: FormArray;
	serverUrl = environment.apiUrl;

	constructor(
		private fb: FormBuilder,
		private formValidationService: FormValidationService,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private socketsService: SocketsService,
		private authenticationService: AuthenticationService,
		private snackBar: MatSnackBar,
		private bidService: BidService,
		private dialogRef: MatDialogRef<AuctionDialogComponent>,
		@Optional()
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	ngOnInit() {
		this.user = this.authenticationService.getUser();
		this.auction = this.data.auction;
		this.submitted = false;
		this.infoForm = this.fb.group({
			bidPrice: [
				'', Validators.compose([Validators.required, Validators.min(0.01), Validators.max(this.auction.bidblabPrice),])
			]
		});

	}

	ngOnDestroy() {
	}

	checkError(form, field, error) {
		return this.formValidationService.checkError(form, field, error);
	}

	submitForm() {
		if (this.infoForm.valid) {
			if (this.auction.bids.some(element => element.bidPrice == this.infoForm.value.bidPrice)) {
				this.snackBar.open("You have already bid this price", 'Dismiss', {
					duration: 1500
				})
			} else {
				this.blockUIService.setBlockStatus(true);
				this.commonService.addBid(this.auction._id, this.infoForm.value).subscribe((res: any) => {
					this.socketsService.notify('updatedData', {
						type: 'auction',
						data: Object.assign(
							{ auctionId: this.auction._id },
						)
					});
					this.blockUIService.setBlockStatus(false);
					this.bidService.getMyCredits();
					this.submitted = true;
					this.dialogRef.close(res.data);
					this.commonService.showOutstreamAds();
				}, (err: HttpErrorResponse) => {
					this.submitted = false;
					this.blockUIService.setBlockStatus(false);
					this.snackBar.open(err.error.msg, 'Dismiss', {
						duration: 4000
					}).afterDismissed().subscribe(() => {
						this.dialogRef.close();
					});
				});
			}
		}
	}

}

