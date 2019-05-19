import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class MenuComponent implements OnInit {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  @Output() onClickMenuItem:EventEmitter<any> = new EventEmitter<any>();
  parentMenu:Array<any>;
  // public settings: Settings;
  constructor(
    // public appSettings:AppSettings, 
    public menuService:MenuService, 
    public router:Router
  ) { 
    // this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    console.log(this.menuItems);
    this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);  
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // if(this.settings.fixedHeader){
          let mainContent = document.getElementById('main-content');
          if(mainContent){
            mainContent.scrollTop = 0;
          }
        // }
        // else{
        //   document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        // }
      }                
    });
  }

  onClick(menuId){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);
    this.onClickMenuItem.emit(menuId);     
  }

}
