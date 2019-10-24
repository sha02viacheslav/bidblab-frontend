import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '$/services/dialog.service';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { environment } from '@environments/environment';

@Component({
	selector: 'app-followers',
	templateUrl: './followers.component.html',
	styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {
	private totalFollowers: number;
	public follows: any[] = [];
	public serverUrl = environment.apiUrl;

	constructor(
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService
	) { }

	ngOnInit() {
		this.totalFollowers = 0;
		this.blockUIService.setBlockStatus(true);
		this.commonService.getUserData().subscribe((res: any) => {
			this.follows = res.data.user.follows;
			this.blockUIService.setBlockStatus(false);
		}, (err: HttpErrorResponse) => {
			this.blockUIService.setBlockStatus(false);
			this.snackBar.open(err.error.msg, 'Dismiss', {
				duration: 1500
			});
		});
	}

}
