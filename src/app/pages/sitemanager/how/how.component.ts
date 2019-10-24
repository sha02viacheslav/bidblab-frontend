import { Component, OnInit } from '@angular/core';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-how',
	templateUrl: './how.component.html',
	styleUrls: ['./how.component.scss']
})
export class HowComponent implements OnInit {
	howPageContent: any;
	constructor(
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		protected sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.commonService.getHowPageContent().subscribe((res: any) => {
			if (res.data) {
				var result = this.commonService.processQuill(res.data.quillContent);
				this.howPageContent = this.sanitizer.bypassSecurityTrustHtml(result.innerHtml);
			} else {
				this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
			}
		}, (err: HttpErrorResponse) => {
			this.snackBar.open(err.error.msg, 'Dismiss');
		});
	}
}

