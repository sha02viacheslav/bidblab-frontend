import { Component, OnDestroy, OnInit, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { BlockUIService } from './shared/services/block-ui.service';
import { SwUpdate } from '@angular/service-worker';
import { takeWhile, filter } from 'rxjs/operators';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './shared/services/authentication.service';
import { DialogService } from './shared/services/dialog.service';
// import { ResetPasswordComponent } from './shared/components/reset-password/reset-password.component';
declare var $: any;

import { Location } from '@angular/common';
import { environment } from '../environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { MenuService } from './shared/components/menu/menu.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav:any;
  @ViewChild('sidenavPS') sidenavPS: PerfectScrollbarComponent;
  private blockingSubscription: Subscription;
  private routerSubscription: Subscription;
  @BlockUI() blockUI: NgBlockUI;
  user: any;
  // private userUpdatesSubscription: Subscription;
  serverUrl = environment.apiUrl;

  mainNavLinks: any[];
  activeLinkIndex = -1;
  mobileQuery: MediaQueryList;
  public menuItems:Array<any>;

  menuHidden = false;

  constructor(
    private blockUIService: BlockUIService,
    private swUpdate: SwUpdate,
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private location: Location,
    public menuService:MenuService,
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
    // $("#main-nicescrollable").niceScroll({
		// 	cursorcolor: "#e91e63",
		// 	cursorborder: '#e91e63',
		// 	autohidemode: true,
		// 	background: "#aaa",
		// 	cursorminheight: 15,
		// 	cursorborderradius: 15,
		// 	cursorwidth: 3,
		// 	cursoropacitymin: 0.1,
    // });

    // setInterval(() => {
    //   $("#main-nicescrollable").getNiceScroll().resize();
    // }, 1000);
    
    this.authenticationService.getUserUpdates().subscribe(user => (this.user = user));
    this.menuItems = this.menuService.getVerticalMenuItems();
    this.getBlockStatus();
    this.checkForUpdates();
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));

    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.mainNavLinks.indexOf(this.mainNavLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

  ngOnDestroy() {
    // this.routerSubscription.unsubscribe();
    // this.blockingSubscription.unsubscribe();
    // this.userUpdatesSubscription.unsubscribe();
  }

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  private checkResetPasswordToken() {
    this.route.paramMap.subscribe(params => {
      if (params.has('resetPasswordToken')) {
        if (!this.authenticationService.isAuthenticated()) {
          const token = params.get('resetPasswordToken');
          this.commonService.checkResetPasswordToken(token).subscribe(
            (res: any) => {
              this.openResetPasswordDialog(token, res.data);
            },
            (err: HttpErrorResponse) => {
              this.snackBar.open(err.error.msg, 'Dismiss');
              this.router.navigateByUrl('/');
            }
          );
        } else {
          this.snackBar.open('You are already logged in.', 'Dismiss');
          this.router.navigateByUrl('/');
        }
      }
    });
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  private openResetPasswordDialog(token, userId) {
    // this.dialogService.open(ResetPasswordComponent, {
    //   data: {
    //     token,
    //     userId
    //   }
    // });
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

  private checkForUpdates() {
    this.swUpdate.available
      .pipe(takeWhile(() => this.swUpdate.isEnabled))
      .subscribe(() => {
        if (confirm('A new version of the app is available. Update Now?')) {
          window.location.reload();
        }
      });
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  closeMenu(){
    this.menuHidden = false;
  }

  openProfile() {
    this.router.navigateByUrl(`/account`);
  }

  goHome() {
    this.router.navigateByUrl('/');
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

  public closeSubMenus(){
    let menu = document.querySelector(".sidenav-menu-outer");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  public updatePS(e){
    this.sidenavPS.directiveRef.update();
  }

  onScroll() {  
    this.commonService.infiniteScrolled();
  }  

}


