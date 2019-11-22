import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';
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
	selector: 'app-ads-block',
	templateUrl: './ads-block.component.html',
	styleUrls: ['./ads-block.component.scss']
})
export class AdsBlockComponent implements OnInit {
	@Input() adsUnit: any;

	public visibleState: boolean = true;
	public myInnerHeight: number = 0;

	constructor(
		public el: ElementRef
	) { }


	@HostListener('window:scroll', ['$event'])
    checkScroll() {
		const componentPosition = this.el.nativeElement.offsetTop
		const scrollPosition = window.pageYOffset

		let difPosition = componentPosition - scrollPosition;

		if (difPosition < 2000 && difPosition > -1000) {
			this.visibleState = true;
		} else {
			this.visibleState = false;
		}

	}
	
	refreshed(event) {
		if (event.type === 'renderEnded') {
			this.myInnerHeight = event.data.size[1];
		}
	}

	ngOnInit() { }

}
