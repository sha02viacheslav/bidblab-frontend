import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-how',
  templateUrl: './how.component.html',
  styleUrls: ['./how.component.scss']
})
export class HowComponent implements OnInit {
  howPageContent: string = '';
  constructor(
    public commonService: CommonService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.commonService.getHowPageContent().subscribe(
    (res: any) => {
      if(res.data){
        this.howPageContent = res.data.quillContent;
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

