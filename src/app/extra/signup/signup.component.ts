import { Component, OnInit, Renderer2, Inject, ElementRef, AfterViewInit, ViewChild, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../shared/services/common.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { DialogService } from '../../shared/services/dialog.service';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {
	submitted: boolean;
	passwordVisibility: boolean;
	form: FormGroup;
	private friendEmail: string = '';
	public defaultCredits: any;

	@ViewChild('datepicker') datepicker: ElementRef;
	@ViewChild('dateinput') dateinput: ElementRef;

	constructor(
		private fb: FormBuilder,
		private formValidationService: FormValidationService,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private location: Location,
		private route: ActivatedRoute,
		private renderer2: Renderer2,
		private dialogService: DialogService,
		private elementRef: ElementRef,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
	}

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			if (params.has('friendEmail')) {
				this.friendEmail = params.get('friendEmail');
			}
		});

		this.blockUIService.setBlockStatus(true);
		this.commonService.getDefaultCredits().subscribe((res: any) => {
			if (res.data) {
				this.defaultCredits = res.data;
			}
			this.blockUIService.setBlockStatus(false);
		});

		this.passwordVisibility = false;
		this.submitted = false;
		this.form = this.fb.group({
			accept: false,
			firstName: ['', [Validators.required, this.formValidationService.isBlank]],
			lastName: ['', [Validators.required, this.formValidationService.isBlank]],
			birthday: ['', [Validators.required, this.formValidationService.isAdault]],
			username: ['', [Validators.required, this.formValidationService.isBlank]],
			email: [
				this.friendEmail ? this.friendEmail : '',
				[
					Validators.required,
					this.formValidationService.isBlank,
					Validators.email
				]
			],
			password: [
				'',
				[
					Validators.required,
					this.formValidationService.isBlank,
					Validators.minLength(8)
				]
			],
			confirmPassword: [
				'',
				[
					Validators.required,
					this.formValidationService.isBlank,
					this.formValidationService.arePasswordsMismatching
				]
			]
		});
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			var self = this;
			$(this.datepicker.nativeElement).DateTimePicker({
				dateFormat: "MM-dd-yyyy",
				isPopup: false,
				parentElement: ".cont-datetime",
				formatHumanDate: function (oDate, sMode, sFormat) {
					var timeTemp = oDate.MM + "-" + oDate.dd + "-" + oDate.yyyy;
					if (timeTemp === "") {
						self.form.controls.birthday.setValue('');
					} else {
						self.form.controls.birthday.setValue(new Date(timeTemp));
						self.dateinput.nativeElement.value = timeTemp;
					}
					//This is to trigger form validation.
					self.dateinput.nativeElement.click();
					if (sMode === "date") {
						return oDate.dayShort + ", " + oDate.dd + " " + oDate.month + ", " + oDate.yyyy;
					} else if (sMode === "time") {
						return oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
					} else if (sMode === "datetime") {
						return oDate.dayShort + ", " + oDate.dd + " " + oDate.month + ", " + oDate.yyyy + " " + oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
					}
				},
				settingValueOfElement: function (sValue, dDateTime, oInputElement) {
					var timeTemp = oInputElement.val();
					if (timeTemp === "") {
						self.form.controls.birthday.setValue('');
					} else {
						self.form.controls.birthday.setValue(new Date(timeTemp));
						self.dateinput.nativeElement.value = timeTemp;

					}
					//This is to trigger form validation.
					self.dateinput.nativeElement.click();
				}
			})
		}
	}

	checkError(form, field, error) {
		return this.formValidationService.checkError(form, field, error);
	}

	togglePasswordVisibility(event) {
		if (event.type === 'mouseleave' && !this.passwordVisibility) {
			return event.preventDefault();
		}
		this.passwordVisibility = !this.passwordVisibility;
		return event.preventDefault();
	}

	submitForm() {
		if (this.form.valid) {
			this.submitted = true;
			this.blockUIService.setBlockStatus(true);
			this.commonService.signup(this.form.value).subscribe((res: any) => {
				this.blockUIService.setBlockStatus(false);
				this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
				this.dialogService.open(AlertDialogComponent, {
					data: {
						title: "Welcome, " + res.data.user.username + ", your registration was successful.",
						comment: "An email with further instructions on how to verify your account was sent to you, check your inbox!",
						dialog_type: "alert"
					},
					width: '320px',
				}).afterClosed().subscribe(result => {
					this.commonService.goHome();
				});
			}, (err: HttpErrorResponse) => {
				this.submitted = false;
				this.blockUIService.setBlockStatus(false);
				this.snackBar.open(err.error.msg, 'Dismiss', {duration: 4000});
			});
		}
	}

}

