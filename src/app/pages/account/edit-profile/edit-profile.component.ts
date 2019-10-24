import { Component, OnDestroy, OnInit, Inject, ElementRef, AfterViewInit, ViewChild, PLATFORM_ID  } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormValidationService } from '$/services/form-validation.service';
import { BlockUIService } from '$/services/block-ui.service';
import { AuthenticationService } from '$/services/authentication.service';
import { DialogService } from '$/services/dialog.service';
import { CommonService } from '$/services/common.service';
import { environment } from '@environments/environment';
import { isPlatformBrowser } from '@angular/common';
declare var $: any;

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, AfterViewInit, OnDestroy {
	public user: any;
	public submitted: boolean;
	public disabledShippingAddress: boolean = false;
	public passwordVisibility: boolean;
	public infoForm: FormGroup;
	public serverUrl = environment.apiUrl;
	public standardInterests: string[] = [];
	public formArray: FormArray;
	public uploadFiles: any[] = [];
	public originalImage: string = '';
	public showImageFlag: boolean = false;
	public selectedFileIndex: number = -1;
	public uploadFile: any;
	@ViewChild('datepicker') datepicker: ElementRef;
	@ViewChild('dateinput') dateinput: ElementRef;


	constructor(
		public commonService: CommonService,
		private fb: FormBuilder,
		private formValidationService: FormValidationService,
		private authenticationService: AuthenticationService,
		private blockUIService: BlockUIService,
		private snackBar: MatSnackBar,
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

	ngOnInit() {
		this.user = this.authenticationService.getUser();
		this.passwordVisibility = false;
		this.submitted = false;

		if (this.user && this.user.profilePicture) {
			this.getInitialImage(0);
		}
		else {
			this.showImageFlag = true;
		}

		this.infoForm = this.fb.group({
			firstName: [
				this.user.firstName,
				[Validators.required, this.formValidationService.isBlank]
			],
			lastName: [
				this.user.lastName,
				[Validators.required, this.formValidationService.isBlank]
			],
			username: [
				this.user.username,
				[Validators.required, this.formValidationService.isBlank]
			],
			email: [
				this.user.email,
				[Validators.required, this.formValidationService.isBlank, Validators.email]
			],
			aboutme: [this.user.aboutme? this.user.aboutme: ''],
			phone: [this.user.phone? this.user.phone: ''],
			tags: this.fb.array([]),
			birthday: [new Date(this.user.birthday), [Validators.required, this.formValidationService.isAdault]],
			gender: [this.user.gender? this.user.gender: ''],
			physicaladdress: [this.user.physicaladdress? this.user.physicaladdress: ''],
			physicalcity: [this.user.physicalcity? this.user.physicalcity: ''],
			physicalstate: [this.user.physicalstate? this.user.physicalstate: ''],
			physicalzipcode: [this.user.physicalzipcode? this.user.physicalzipcode: ''],
			shippingaddress: [this.user.shippingaddress? this.user.shippingaddress: ''],
			shippingcity: [this.user.shippingcity? this.user.shippingcity: ''],
			shippingstate: [this.user.shippingstate? this.user.shippingstate: ''],
			shippingzipcode: [this.user.shippingzipcode? this.user.shippingzipcode: ''],
		});

		this.formArray = this.infoForm.get('tags') as FormArray;
		this.blockUIService.setBlockStatus(true);
		this.commonService.getAllInterests().subscribe((res: any) => {
			if(res.data) {
				this.standardInterests = res.data;
				this.user.tags.forEach(item => {
					if (!this.standardInterests.some(x => x == item)) {
						this.standardInterests.push(item);
					};
				})
				this.standardInterests.forEach(item => {
					if (this.user.tags.some(interest => interest && interest === item)) {
						this.formArray.push(new FormControl(true));
					} else {
						this.formArray.push(new FormControl(false));
					}
				});
			}
			this.blockUIService.setBlockStatus(false);
		});
	}

	ngOnDestroy() {
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			var self = this;
			var date = new Date(self.user.birthday);
			var timeTemp = ('00' + (Number(date.getMonth()) + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + '-' +  date.getFullYear()
			self.dateinput.nativeElement.value = timeTemp;
			$(this.datepicker.nativeElement).DateTimePicker({
				dateFormat: "MM-dd-yyyy",
				isPopup: false,
				defaultDate: new Date(self.user.birthday),
				parentElement: ".cont-datetime",
				formatHumanDate: function (oDate, sMode, sFormat) {
					var timeTempForDisp = oDate.MM + "-" + oDate.dd + "-" + oDate.yyyy;
					var timeTempForSet = oDate.MM + "/" + oDate.dd + "/" + oDate.yyyy;
					if (timeTemp === "") {
						self.infoForm.controls.birthday.setValue('');
					} else {
						self.infoForm.controls.birthday.setValue(new Date(timeTempForSet));
						self.dateinput.nativeElement.value = timeTempForDisp;
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
					var timeTempForDisp = oInputElement.val();
					var timeTempForSet = timeTempForDisp.replace(new RegExp("-", "g"), "/");
					if (timeTemp === "") {
						self.infoForm.controls.birthday.setValue('');
					} else {
						self.infoForm.controls.birthday.setValue(new Date(timeTempForSet));
						self.dateinput.nativeElement.value = timeTempForDisp;

					}
					//This is to trigger form validation.
					self.dateinput.nativeElement.click();
				}
			})
		}
	}

	getInitialImage(index) {
		var reader = new FileReader();
		this.commonService.getImage(this.serverUrl + '/' + this.user.profilePicture.path).subscribe((res: any) => {
			this.uploadFile = res;
			reader.readAsDataURL(this.uploadFile);
			reader.onload = (event) => {
				this.uploadFiles.push({
					originalFile: this.uploadFile,
					croppedFile: this.uploadFile,
					croppedImage: reader.result
				});
			}
		}, (err: HttpErrorResponse) => {
			this.showImageFlag = true;
		});
	}

	checkError(form, field, error) {
		return this.formValidationService.checkError(form, field, error);
	}

	addPicture(data) {
		if (data) {
			this.uploadFiles[this.selectedFileIndex] = {
				originalFile: data.originalFile,
				croppedFile: data.croppedFile ? data.croppedFile : this.uploadFiles[this.selectedFileIndex].croppedFile,
				croppedImage: data.croppedImage ? data.croppedImage : this.uploadFiles[this.selectedFileIndex].croppedImage
			};
		}
		else {
			this.uploadFiles.splice(this.selectedFileIndex, 1);
		}
		this.selectedFileIndex = -1;
		this.changeProfilePicture();
	}

	openCrop(index) {
		if (this.selectedFileIndex != -1 && this.uploadFiles[this.selectedFileIndex].croppedFile == '') {
			this.uploadFiles.splice(this.selectedFileIndex, 1);
		}
		this.selectedFileIndex = index;
	}

	addFile(event: any): void {
		if (event.target.files && event.target.files[0]) {
			this.uploadFiles.push({
				originalFile: event.target.files[0],
				croppedFile: '',
				croppedImage: ''
			});
			this.selectedFileIndex = this.uploadFiles.length - 1;
		}
	}

	changeProfilePicture() {
		if (this.infoForm.valid) {
			var tags = this.standardInterests.filter((x, i) => !!this.infoForm.value.tags[i]);
			let uploadData = new FormData();
			this.uploadFiles.forEach(element => {
				if (element.croppedFile) {
					uploadData.append('file', element.croppedFile, element.croppedFile.name);
				}
			});
			this.submitted = true;
			this.blockUIService.setBlockStatus(true);
			this.commonService.changeProfilePicture(uploadData).subscribe((res: any) => {
				this.authenticationService.setToken(res.data);
				this.blockUIService.setBlockStatus(false);
				this.submitted = false;
			}, (err: HttpErrorResponse) => {
				this.submitted = false;
				this.blockUIService.setBlockStatus(false);
				this.snackBar.open(err.error.msg, 'Dismiss', { duration: 4000 });
			});
		}
	}

	submitInfoForm() {
		if (this.infoForm.valid) {
			var tags = this.standardInterests.filter((x, i) => !!this.infoForm.value.tags[i]);
			this.infoForm.value.tags = tags;
			this.submitted = true;
			this.blockUIService.setBlockStatus(true);
			this.commonService.updateProfile(this.infoForm.value).subscribe((res: any) => {
				this.authenticationService.setToken(res.data);
				this.blockUIService.setBlockStatus(false);
				this.submitted = false;
			}, (err: HttpErrorResponse) => {
				this.submitted = false;
				this.blockUIService.setBlockStatus(false);
				this.snackBar.open(err.error.msg, 'Dismiss', { duration: 4000 });
			});
		}
	}

}
