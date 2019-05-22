import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit{
  public form:FormGroup;
	public passwordHide:boolean = true;
  returnUrl: string = '';
  public defaultCredits: any;

  constructor(
    public fb: FormBuilder,
    public router:Router,
    private authenticationService: AuthenticationService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
  ){
    this.form = this.fb.group({
      'friendEmail': [null, Validators.compose([Validators.required, Validators.email])],
    });
  };

  ngOnInit(){
    this.commonService.getDefaultCredits().subscribe(
			(res: any) => {
					this.defaultCredits = res.data;
				},
			(err: HttpErrorResponse) => {
				}
			);
  }

  public submitForm() {
    if (this.form.valid) {
      this.commonService.invite(this.form.value).subscribe(
        (res: any) => {
          if(res.data){
            this.snackBar.open(res.msg, 'Dismiss', {
              duration: 1500
            });
            this.form.reset();
          }
          else{
            this.snackBar.open(res.msg, 'Dismiss', {
              duration: 1500
            });
          }
        },
        (err: HttpErrorResponse) => {
        }
      );  
    }
  }

}



