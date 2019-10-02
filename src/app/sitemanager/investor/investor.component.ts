import { Component, OnInit } from '@angular/core';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-investor',
	templateUrl: './investor.component.html',
	styleUrls: ['./investor.component.scss']
})
export class InvestorComponent implements OnInit {
	investorPageContent: string = '';
	constructor(
		public commonService: CommonService,
		private snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.commonService.getInvestorPageContent().subscribe((res: any) => {
			if (res.data) {
				this.investorPageContent = res.data.quillContent;
			} else {
				this.snackBar.open(res.msg, 'Dismiss', { duration: 1500 });
			}
		}, (err: HttpErrorResponse) => {
			this.snackBar.open(err.error.msg, 'Dismiss');
		});
	}

}
