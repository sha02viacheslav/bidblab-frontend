// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
// 	selector: 'app-not-found',
// 	templateUrl: './not-found.component.html'
// })
// export class NotFoundComponent {
// 	constructor(
// 		public router: Router
// 	) {
// 	}

// 	searchResult(): void {
// 		this.router.navigate(['/search']);
// 	}

// 	ngAfterViewInit() {
// 	}

// }

import { Component, Inject, Injector, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

@Component({
	selector: 'app-not-found',
	templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(Injector) private injector: Injector
	) { }

	ngOnInit() {
		if (!isPlatformBrowser(this.platformId)) {
			// this.response.status(404);
			const response = this.injector.get(RESPONSE) as Response;
			response.status(404);
		}
	}

}