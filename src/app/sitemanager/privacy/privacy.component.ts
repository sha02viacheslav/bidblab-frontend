import { Component, OnInit, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

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
		private _renderer2: Renderer2,
		@Inject(DOCUMENT) private _document: Document
	) { }

	ngOnInit() {
		this.commonService.getPrivacyPageContent().subscribe((res: any) => {
			if (res.data) {
				var result = this.commonService.processQuill(res.data.quillContent);
				this.privacyPageContent = result.innerHtml;
				var scriptDiv = result.script;
				scriptDiv.id = 'privacyScript';
				if (document.body.querySelector('div#privacyScript')) {
					document.body.querySelector('div#privacyScript').remove();
				}
				this._renderer2.appendChild(this._document.body, scriptDiv);
			} else {
				this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
			}
		}, (err: HttpErrorResponse) => {
			this.snackBar.open(err.error.msg, 'Dismiss');
		});
	}

}


