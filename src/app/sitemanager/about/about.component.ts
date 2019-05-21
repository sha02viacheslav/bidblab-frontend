import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  aboutPageContent: string = '';
  constructor(
    public commonService: CommonService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.commonService.getAboutPageContent().subscribe(
    (res: any) => {
      if(res.data){
        this.aboutPageContent = res.data.quillContent;
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
