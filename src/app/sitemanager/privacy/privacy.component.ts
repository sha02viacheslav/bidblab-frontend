import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  privacyPageContent: string = '';
  constructor(
    public commonService: CommonService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.commonService.getPrivacyPageContent().subscribe(
    (res: any) => {
      if(res.data){
        this.privacyPageContent = res.data.quillContent;
      }
      else{
        this.snackBar.open(res.msg, 'Dismiss', {duration: 1500});
      }
    },
    (err: HttpErrorResponse) => {
      this.snackBar.open(err.error.msg, 'Dismiss');
    }
  );
  }

}


