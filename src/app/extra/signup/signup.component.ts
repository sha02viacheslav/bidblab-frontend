import { Component, OnInit, Renderer2, Inject, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { BlockUIService } from '../../shared/services/block-ui.service';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../shared/services/common.service';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';
import { DialogService } from '../../shared/services/dialog.service';
import { DOCUMENT } from '@angular/common';
import Rolldate from 'rolldate';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  submitted: boolean;
  passwordVisibility: boolean;
  form: FormGroup;
  private friendEmail: string = '';
  public defaultCredits: any;
  
  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private dialogService: DialogService,
    private elementRef:ElementRef
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
      this.defaultCredits = res.data;
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

    new Rolldate({
      el: '#roll-date-picker',
      format: 'MM-DD-YYYY',
      beginYear: 1920,
      endYear: 2020,
      lang: {title:'Select A Date', confirm:'Set', cancel:'Cancel', year:'', month:'', day:''},
      value: '2017-10-21',
      confirm: (date) =>  {
        this.form.controls.birthday.setValue(new Date(date));
      }
    })
    
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
      this.commonService.signup(this.form.value).subscribe(
        (res: any) => {
          this.blockUIService.setBlockStatus(false);
          this.snackBar.open(res.msg, 'Dismiss', {duration: 1500});
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
        },
        (err: HttpErrorResponse) => {
          this.submitted = false;
          this.blockUIService.setBlockStatus(false);
          this.snackBar
            .open(err.error.msg, 'Dismiss', {
              duration: 4000
            })
            .afterDismissed()
            .subscribe(() => {});
        }
      );
    }
  }

  close(){
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

}

