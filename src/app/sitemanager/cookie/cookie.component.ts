import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

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
		private _renderer2: Renderer2,
		@Inject(DOCUMENT) private doc: Document
	) { }

	ngOnInit() {
		this.commonService.getCookiePageContent().subscribe((res: any) => {
			if (res.data) {
				var result = this.commonService.processQuill(res.data.quillContent);
				this.cookiePageContent = result.innerHtml;
				var scriptDiv = result.script;
				scriptDiv.id = 'cookieScript';

				if (this.doc.body.querySelector('div#cookieScript')) {
					this.doc.body.querySelector('div#cookieScript').remove();
				}
				this._renderer2.appendChild(this.doc.body, scriptDiv);
			} else {
				this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
			}
		}, (err: HttpErrorResponse) => {
			this.snackBar.open(err.error.msg, 'Dismiss');
		});
	}

}


