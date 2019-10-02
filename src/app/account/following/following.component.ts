import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '$/services/dialog.service';
import { CommonService } from '$/services/common.service';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '$/services/authentication.service';
import { BlockUIService } from '$/services/block-ui.service';
import { environment } from '@environments/environment';


@Component({
	selector: 'app-following',
	templateUrl: './following.component.html',
	styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {

	private followingQuestionsCount: number;
	private followingQuestions: any[] = [];
	private followingUsersCount: number;
	private followingUsers: any[] = [];
	isInit: boolean;
	serverUrl = environment.apiUrl;

	constructor(
		private blockUIService: BlockUIService,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService
	) { }

	ngOnInit() {
		this.isInit = false;
		this.isInit = true;
		this.followingQuestionsCount = 0;
		this.followingUsersCount = 0;
		this.blockUIService.setBlockStatus(true);
		this.commonService.getQuestionsFollowing().subscribe((res: any) => {
			this.followingQuestionsCount = res.data.count;
			this.followingQuestions = res.data.questions;
			this.blockUIService.setBlockStatus(false);
		}, (err: HttpErrorResponse) => {
			this.blockUIService.setBlockStatus(false);
			this.snackBar.open(err.error.msg, 'Dismiss', { duration: 1500 });
		});
		this.commonService.getUsersFollowing().subscribe((res: any) => {
			this.followingUsersCount = res.data.count;
			this.followingUsers = res.data.users;
			this.blockUIService.setBlockStatus(false);
		}, (err: HttpErrorResponse) => {
			this.blockUIService.setBlockStatus(false);
			this.snackBar.open(err.error.msg, 'Dismiss', { duration: 1500 });
		});
	}

	deleteFollow(followType, objectId) {
		this.blockUIService.setBlockStatus(true);
		if (objectId && this.authenticationService.getUser()._id) {
			this.commonService.deleteFollow(followType, objectId).subscribe((res: any) => {
				this.blockUIService.setBlockStatus(false);
				if (followType == 'question') {
					const index = this.followingQuestions.findIndex(
						currentQuestion => currentQuestion._id === objectId
					);
					if (index !== -1) {
						this.followingQuestions.splice(index, 1);
					}
				} else {
					const index = this.followingUsers.findIndex(
						currentUser => currentUser._id === objectId
					);
					if (index !== -1) {
						this.followingUsers.splice(index, 1);
					}
				}
			}, (err: HttpErrorResponse) => {
				this.blockUIService.setBlockStatus(false);
				this.snackBar.open(err.error.msg, 'Dismiss', { duration: 4000 });
			});
		}
	}
}