import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	public userId: string = '';

	constructor(
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			if (params.has('userId')) {
				this.userId = params.get('userId');
			}
		});
	}
	
}
