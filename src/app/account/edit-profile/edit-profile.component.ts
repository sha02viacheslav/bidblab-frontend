import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserService } from '../../shared/services/user.service';
import { DialogService } from '../../shared/services/dialog.service';
import { CommonService } from '../../shared/services/common.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  user: any;
  submitted: boolean;
  disabledShippingAddress: boolean = false;
  passwordVisibility: boolean;
  infoForm: FormGroup;
  passwordForm: FormGroup;
  private userUpdatesSubscription: Subscription;
  serverUrl = environment.apiUrl;
  standardInterests: string[];
  formArray: FormArray;
  uploadFiles: any[] = [];
  originalImage: string = '';
  showImageFlag: boolean = false;
  selectedFileIndex: number = -1;
  uploadFile: any;


  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private authenticationService: AuthenticationService,
    private blockUIService: BlockUIService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    public commonService: CommonService,
  ) {}

  ngOnInit() {
    this.getUserUpdates();
    this.passwordVisibility = false;
    this.submitted = false;

    if(this.user && this.user.profilePicture){
      this.getInitialImage(0); 
    }
    else{
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
      aboutme: [this.user.aboutme],
      phone: [this.user.phone],
      customTag: [''],
      tags: this.fb.array([]),
      birthday: [new Date(this.user.birthday), [Validators.required, this.formValidationService.isAdault]],
      gender: [this.user.gender],
      physicaladdress: [this.user.physicaladdress],
      physicalcity: [this.user.physicalcity],
      physicalstate: [this.user.physicalstate],
      physicalzipcode: [this.user.physicalzipcode],
      shippingaddress: [this.user.shippingaddress],
      shippingcity: [this.user.shippingcity],
      shippingstate: [this.user.shippingstate],
      shippingzipcode: [this.user.shippingzipcode],
    });

    this.commonService.getStandardInterests().subscribe((res: any) => {
      this.standardInterests = res.data;
      this.formArray = this.infoForm.get('tags') as FormArray;
      this.user.tags.forEach( item => {
        if(!this.standardInterests.some( x => x == item)){
          this.standardInterests.push(item);
        };
      })
      this.standardInterests.forEach(item => {
        if(this.user.tags.some(interest => interest && interest === item)) {
          this.formArray.push(new FormControl(true));
        } else {
          this.formArray.push(new FormControl(false));
        }
      });
      this.blockUIService.setBlockStatus(false);
      this.snackBar.open(res.msg, 'Dismiss', {duration: 1500});
    }, (err: HttpErrorResponse) => {
      this.blockUIService.setBlockStatus(false);
      this.snackBar.open(err.error.msg, 'Dismiss', {duration: 1500});
    });
    
    this.passwordForm = this.fb.group({
      currentPassword: [
        '',
        [
          Validators.required,
          this.formValidationService.isBlank,
          Validators.minLength(8)
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

  ngOnDestroy() {
    // this.userUpdatesSubscription.unsubscribe();
  }

  getInitialImage(index){
    var reader = new FileReader();
    this.commonService.getImage(this.serverUrl + '/' + this.user.profilePicture.path).subscribe(
      (res: any) => {
        this.uploadFile = res;
        reader.readAsDataURL(this.uploadFile);
        reader.onload = (event) => {
          this.uploadFiles.push({
            originalFile: this.uploadFile, 
            croppedFile: this.uploadFile,  
            croppedImage: reader.result
          });
        }
      },
      (err: HttpErrorResponse) => {
        this.showImageFlag = true;
      }
    );  
  }

  addCustomTag(){
    event.preventDefault();
    if(this.infoForm.value.customTag){
      if(this.standardInterests.find(x => x == this.infoForm.value.customTag)){
        this.infoForm.controls.customTag.setValue('');
      }
      else{
        this.standardInterests.push(this.infoForm.value.customTag);
        this.formArray.push(new FormControl(true));
        this.infoForm.controls.customTag.setValue('');
      }
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

  submitInfoForm() {
    if (this.infoForm.valid) {
      var tags = this.standardInterests.filter((x, i) => !!this.infoForm.value.tags[i]);
      let uploadData = new FormData();
      this.uploadFiles.forEach(element => {
        if(element.croppedFile){
          uploadData.append('file', element.croppedFile, element.croppedFile.name);
        }
      });
      uploadData.append('firstName', this.infoForm.value.firstName);
      uploadData.append('lastName', this.infoForm.value.lastName);
      uploadData.append('username', this.infoForm.value.username);
      uploadData.append('email', this.infoForm.value.email);
      uploadData.append('aboutme', this.infoForm.value.aboutme);
      uploadData.append('phone', this.infoForm.value.phone);
      uploadData.append('tags', JSON.stringify(tags));
      uploadData.append('birthday', this.infoForm.value.birthday);
      uploadData.append('gender', this.infoForm.value.gender);
      uploadData.append('physicaladdress', this.infoForm.value.physicaladdress);
      uploadData.append('physicalcity', this.infoForm.value.physicalcity);
      uploadData.append('physicalstate', this.infoForm.value.physicalstate);
      uploadData.append('physicalzipcode', this.infoForm.value.physicalzipcode);
      uploadData.append('shippingaddress', this.infoForm.value.shippingaddress);
      uploadData.append('shippingcity', this.infoForm.value.shippingcity);
      uploadData.append('shippingstate', this.infoForm.value.shippingstate);
      uploadData.append('shippingzipcode', this.infoForm.value.shippingzipcode);

      this.submitted = true;
      this.blockUIService.setBlockStatus(true);
      this.userService.updateProfile(uploadData).subscribe((res: any) => {
        this.authenticationService.setUser(res.data);
        this.blockUIService.setBlockStatus(false);
        this.submitted = false;
        this.snackBar.open(res.msg, 'Dismiss', {duration: 1500});
      }, (err: HttpErrorResponse) => {
        this.submitted = false;
        this.blockUIService.setBlockStatus(false);
        this.snackBar.open(err.error.msg, 'Dismiss', {duration: 4000});
      });
    }
  }

  submitPasswordForm(formDirective) {
    if (this.passwordForm.valid) {
      this.submitted = true;
      this.blockUIService.setBlockStatus(true);
      this.userService.changePassword(this.passwordForm.value).subscribe(
        (res: any) => {
          this.blockUIService.setBlockStatus(false);
          this.passwordForm.reset();
          formDirective.resetForm();
          this.submitted = false;
          this.snackBar.open(res.msg, 'Dismiss', {
            duration: 1500
          });
        },
        (err: HttpErrorResponse) => {
          this.submitted = false;
          this.blockUIService.setBlockStatus(false);
          this.snackBar.open(err.error.msg, 'Dismiss', {
            duration: 4000
          });
        }
      );
    }
  }

  addPicture(data) {
    if (data) {
      this.uploadFiles[this.selectedFileIndex] = {
        originalFile: data.originalFile,
        croppedFile: data.croppedFile? data.croppedFile : this.uploadFiles[this.selectedFileIndex].croppedFile,
        croppedImage: data.croppedImage? data.croppedImage : this.uploadFiles[this.selectedFileIndex].croppedImage
      };
    }
    else{
      this.uploadFiles.splice(this.selectedFileIndex, 1);
    }
    this.selectedFileIndex = -1;
  }

  openCrop(index){
    if(this.selectedFileIndex != -1 && this.uploadFiles[this.selectedFileIndex].croppedFile == ''){
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

  private getUserUpdates() {
    this.userUpdatesSubscription = this.authenticationService
      .getUserUpdates()
      .subscribe(user => (this.user = user));
  }
}
