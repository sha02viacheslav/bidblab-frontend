import { Component, OnDestroy, Inject, OnInit, HostListener, ViewChild, ViewEncapsulation, PLATFORM_ID } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockUIService } from './shared/services/block-ui.service';
import { takeWhile, filter } from 'rxjs/operators';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from '@environments/environment';
import { MenuService } from './shared/components/menu/menu.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AuthenticationService } from './shared/services/authentication.service';
import { DialogService } from './shared/services/dialog.service';
import { SeoService } from '$/services/seo.service';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
declare var $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [MenuService],
})
export class AppComponent implements OnInit, OnDestroy {
	@ViewChild('sidenav') sidenav: any;
	@ViewChild('sidenavPS') sidenavPS: PerfectScrollbarComponent;
	private userUpdatesSubscription: Subscription;
	private blockingSubscription: Subscription;
	private routerSubscription: Subscription;
	@BlockUI() blockUI: NgBlockUI;
	public user: any;
	public serverUrl = environment.apiUrl;

	public mainNavLinks: any[];
	public activeLinkIndex = -1;
	public mobileQuery: MediaQueryList;
	public menuItems: Array<any>;
	public menuHidden = false;

	constructor(
		private blockUIService: BlockUIService,
		private router: Router,
		private route: ActivatedRoute,
		public commonService: CommonService,
		private snackBar: MatSnackBar,
		private authenticationService: AuthenticationService,
		private dialogService: DialogService,
		private seoService: SeoService,
		private location: Location,
		public menuService: MenuService,
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(DOCUMENT) private doc
	) {
		this.mainNavLinks = [
			{
				label: 'Home',
				link: '/questions/home',
				index: 0
			}, {
				label: 'Bid',
				link: '/questions/bid',
				index: 1
			}, {
				label: 'Blab',
				link: '/questions/blab',
				index: 2
			}, {
				label: 'About',
				link: '/questions/about',
				index: 3
			},
		];
	}

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			$("#main-nicescrollable").niceScroll({
				cursorcolor: "#e91e63",
				cursorborder: '#e91e63',
				autohidemode: true,
				background: "#aaa",
				cursorminheight: 15,
				cursorborderradius: 15,
				cursorwidth: 3,
				cursoropacitymin: 0.1,
			});

			setInterval(() => {
				$("#main-nicescrollable").getNiceScroll().resize();
			}, 1000);
		}

		this.menuItems = this.menuService.getVerticalMenuItems();
		this.getBlockStatus();
		this.routerSubscription = this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(() => {
				this.seoService.createLinkForCanonicalURL();
				if (isPlatformBrowser(this.platformId)) {
					this.toggleSidenav();
					window.scrollTo(0, 0);
				}
			});
		this.userUpdatesSubscription = this.authenticationService
			.getUserUpdates()
			.subscribe(user => (this.user = user));
		this.router.events.subscribe((res) => {
			this.activeLinkIndex = this.mainNavLinks.indexOf(this.mainNavLinks.find(tab => tab.link === '.' + this.router.url));
		});
	}

	ngOnDestroy() {
		if(this.userUpdatesSubscription) {
			this.userUpdatesSubscription.unsubscribe();
		}
		this.routerSubscription.unsubscribe();
		this.blockingSubscription.unsubscribe();
	}

	public toggleSidenav() {
		this.sidenav.toggle();
	}

	isAuthenticated() {
		return this.authenticationService.isAuthenticated();
	}

	getBlockStatus() {
		this.blockingSubscription = this.blockUIService
			.getBlockStatus()
			.subscribe(status => {
				if (status) {
					this.blockUI.start();
				} else {
					this.blockUI.stop();
				}
			});
	}

	toggleMenu() {
		this.menuHidden = !this.menuHidden;
	}

	closeMenu() {
		this.menuHidden = false;
	}

	goBack() {
		this.location.back();
	}

	isHome() {
		const path = this.location.path(false);
		return path === '' || path === '/questions/home';
	}

	logout() {
		this.authenticationService.logout();
		this.closeMenu();
	}

	public closeSubMenus() {
		let menu = this.doc.querySelector(".sidenav-menu-outer");
		if (menu) {
			for (let i = 0; i < menu.children[0].children.length; i++) {
				let child = menu.children[0].children[i];
				if (child) {
					if (child.children[0].classList.contains('expanded')) {
						child.children[0].classList.remove('expanded');
						child.children[1].classList.remove('show');
					}
				}
			}
		}
	}

	public updatePS(e) {
		this.sidenavPS.directiveRef.update();
	}

	onScroll() {
		this.commonService.infiniteScrolled();
	}

}
