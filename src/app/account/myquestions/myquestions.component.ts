import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '$/services/dialog.service';
import { CommonService } from '$/services/common.service';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';

@Component({
	selector: 'app-myquestions',
	templateUrl: './myquestions.component.html',
	styleUrls: ['./myquestions.component.scss']
})
export class MyquestionsComponent implements OnInit {

	public mytotalQuestionsCount: number;
	public myquestions: any[] = [];

	constructor(
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
	) { }

	ngOnInit() {
		this.mytotalQuestionsCount = 0;
		this.blockUIService.setBlockStatus(true);
		this.commonService.getQuestionsByAskerId().subscribe((res: any) => {
			this.mytotalQuestionsCount = res.data.count;
			this.myquestions = res.data.questions;
			this.blockUIService.setBlockStatus(false);
		}, (err: HttpErrorResponse) => {
			this.blockUIService.setBlockStatus(false);
			this.snackBar.open(err.error.msg, 'Dismiss', { duration: 1500 });
		});
	}

}