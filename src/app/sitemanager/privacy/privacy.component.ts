import { Renderer2, Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit, AfterViewInit {
  privacyPageContent: string = '';
  scriptDiv: any;
  constructor(
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) { }

  ngOnInit() {
    this.commonService.getPrivacyPageContent().subscribe(
      (res: any) => {
        if (res.data) {
          var temp = res.data.quillContent;
          temp = temp.replace(new RegExp("\n", "g"), "");
          temp = temp.replace(new RegExp("&gt;", "g"), ">");
          temp = temp.replace(new RegExp("&lt;", "g"), "<");
          this.privacyPageContent = this.processQuill(temp);
          this._renderer2.appendChild(this._document.body, this.scriptDiv);
        }
        else {
          this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
        }
      },
      (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.msg, 'Dismiss');
      }
    );
  }

  ngAfterViewInit(){
  }

  processQuill(originQuill) {
    var a = document.createElement('div');
    a.innerHTML = originQuill
    while(a.querySelector('pre')){
      a.querySelector('pre').outerHTML = a.querySelector('pre').innerHTML;
    }
    
    this.scriptDiv = this._renderer2.createElement('div');
    this.scriptDiv.id = 'privacyScript';
    
    while(a.querySelector('script')){
      let s = this._renderer2.createElement('script');
      s.type = `text/javascript`;
      s.text = a.querySelector('script').innerHTML;
      this.scriptDiv.appendChild(s);
      a.querySelector('script').outerHTML = '';
    }
    if(document.body.querySelector('div#privacyScript')){
      document.body.querySelector('div#privacyScript').remove();
    }
    return a.innerHTML;
  }





}


