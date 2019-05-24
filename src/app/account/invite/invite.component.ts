import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../shared/services/common.service';
import { BlockUIService } from '../../shared/services/block-ui.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit{
  public form: FormGroup;
  public defaultCredits: any;
  public submitted: boolean = false;

  constructor(
    public fb: FormBuilder,
    public router:Router,
    private blockUIService: BlockUIService,
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
    this.blockUIService.setBlockStatus(true);
    this.commonService.getDefaultCredits().subscribe((res: any) => {
      this.defaultCredits = res.data;
      this.blockUIService.setBlockStatus(false);
    });
  }

  public submitForm() {
    if (this.form.valid) {
      this.submitted = true;
      this.blockUIService.setBlockStatus(true);
      this.commonService.invite(this.form.value).subscribe((res: any) => {
        this.blockUIService.setBlockStatus(false);
        this.submitted = false;
        if(res.data) {
          this.snackBar.open(res.msg, 'Dismiss', {duration: 1500});
          this.form.reset();
        } else {
          this.snackBar.open(res.msg, 'Dismiss', {duration: 1500});
        }
      });  
    }
  }

}



