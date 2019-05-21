import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss']
})
export class CookieComponent implements OnInit {
  cookiePageContent: string = '';
  constructor(
    public commonService: CommonService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.commonService.getCookiePageContent().subscribe(
    (res: any) => {
      if(res.data){
        this.cookiePageContent = res.data.quillContent;
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


