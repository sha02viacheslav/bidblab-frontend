import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '$/services/dialog.service';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { QuestionDialogComponent } from '$/components/question-dialog/question-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertDialogComponent } from '$/components/alert-dialog/alert-dialog.component';

@Component({
	selector: 'app-read-more',
	templateUrl: './read-more.component.html',
	styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {
	@Input() content: any;
	@Input() maxLength: number;
	public contentVisibility: boolean = false;

	constructor(
		private fb: FormBuilder,
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
		private router: Router
	) { }

	ngOnInit() {
		
	}

	public toggleContent(visibility, event) {
		event.stopPropagation();
		event.preventDefault();
		this.contentVisibility = visibility;
	}

}
