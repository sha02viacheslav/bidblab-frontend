import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  termsPageContent: string = '';
  constructor(
    public commonService: CommonService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.commonService.getTermsPageContent().subscribe(
    (res: any) => {
      if(res.data){
        this.termsPageContent = res.data.quillContent;
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


