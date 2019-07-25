import { Component, Inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '../../services/form-validation.service';
import { BlockUIService } from '../../services/block-ui.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../services/common.service';
declare var SqPaymentForm: any; //magic to allow us to access the SquarePaymentForm lib

@Component({
	selector: 'app-square-dialog',
	templateUrl: './square-dialog.component.html',
	styleUrls: ['./square-dialog.component.scss']
})
export class SquareDialogComponent implements OnInit, AfterViewInit, OnDestroy {
	public submitted: boolean = true;
	public validationError: any = {};
	private paymentForm;

	constructor(
		private fb: FormBuilder,
		private formValidationService: FormValidationService,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<SquareDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }	

	ngOnInit() {
		var self = this;
		if (SqPaymentForm.isSupportedBrowser()) {
			this.paymentForm = new SqPaymentForm({

				// Initialize the payment form elements
				applicationId: 'sq0idp-pgtYItOt5ukOhAf3XVPULw',
				inputClass: 'sq-input',
				autoBuild: false,

				// Customize the CSS for SqPaymentForm iframe elements
				inputStyles: [{
					backgroundColor: 'transparent',
					color: '#333333',
					fontFamily: '"Helvetica Neue", "Helvetica", sans-serif',
					fontSize: '16px',
					fontWeight: '400',
					placeholderColor: '#8594A7',
					placeholderFontWeight: '400',
					padding: '16px',
					_webkitFontSmoothing: 'antialiased',
					_mozOsxFontSmoothing: 'grayscale'
				}],

				// Initialize the credit card placeholders
				cardNumber: {
					elementId: 'sq-card-number',
					placeholder: '•••• •••• •••• ••••'
				},
				cvv: {
					elementId: 'sq-cvv',
					placeholder: 'CVV'
				},
				expirationDate: {
					elementId: 'sq-expiration-date',
					placeholder: 'MM/YY'
				},
				postalCode: {
					elementId: 'sq-postal-code'
				},

				// SqPaymentForm callback functions
				callbacks: {
					/*
					* callback function: cardNonceResponseReceived
					* Triggered when: SqPaymentForm completes a card nonce request
					*/
					cardNonceResponseReceived: function (errors, nonce, cardData) {
						self.validationError = {};
						if (errors) {
							for (var i = 0; i < errors.length; i++) {
								self.validationError[errors[i].field] = errors[i].message;
							}
							self.submitted = false;
							self.blockUIService.setBlockStatus(false);

							return;
						}

						self.submitForm(nonce);
					},

					/*
					* callback function: inputEventReceived
					* Triggered when: visitors interact with SqPaymentForm iframe elements.
					*/
					inputEventReceived: function (inputEvent) {
						switch (inputEvent.eventType) {
							case 'focusClassAdded':
								/* HANDLE AS DESIRED */
								break;
							case 'focusClassRemoved':
								/* HANDLE AS DESIRED */
								break;
							case 'errorClassAdded': {
								break;
							}
							case 'errorClassRemoved': {
								break;
							}
							case 'cardBrandChanged':
								/* HANDLE AS DESIRED */
								break;
							case 'postalCodeChanged':
								/* HANDLE AS DESIRED */
								break;
						}
					},

					/*
					* callback function: paymentFormLoaded
					* Triggered when: SqPaymentForm is fully loaded
					*/
					paymentFormLoaded: function () {
						self.submitted = false;
					}
				}
			});
		}

	}

	ngAfterViewInit() {
		this.paymentForm.build();
	}

	ngOnDestroy() {
		this.paymentForm.destroy();
	}

	requestCardNonce(event) {

		// Don't submit the form until SqPaymentForm returns with a nonce
		event.preventDefault();

		this.submitted = true;
		this.blockUIService.setBlockStatus(true);
		// Request a nonce from the SqPaymentForm object
		this.paymentForm.requestCardNonce();
	}

	checkError(form, field, error) {
		return this.formValidationService.checkError(form, field, error);
	}

	submitForm(nonce) {
		this.commonService.squarePay({ nonce: nonce, auctionId: this.data.auction._id }).subscribe((res: any) => {
			this.submitted = false;
			this.blockUIService.setBlockStatus(false);
			if (res.data) {
				this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 }).afterOpened().subscribe(() => {
					this.dialogRef.close(res.data);
				});
			}
			else {
				this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
			}
		});
	}
}
