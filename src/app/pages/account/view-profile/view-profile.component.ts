import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '$/services/authentication.service';

@Component({
	selector: 'app-view-profile',
	templateUrl: './view-profile.component.html',
	styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
	public user: any;

	constructor(
		private authenticationService: AuthenticationService
	) { }

	ngOnInit() {
		this.user = this.authenticationService.getUser();
	}

}
