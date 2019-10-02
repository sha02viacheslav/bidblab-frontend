import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from '../menu.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class VerticalMenuComponent implements OnInit {
  @Input('menuItems') menuItems;
  @Input('menuParentId') menuParentId;
  @Output() onClickMenuItem:EventEmitter<any> = new EventEmitter<any>();
  parentMenu:Array<any>;
  constructor(
    public menuService:MenuService, 
    public router:Router,
		@Inject(DOCUMENT) private doc
  ) { }

  ngOnInit() {
    this.parentMenu = this.menuItems.filter(item => item.parentId == this.menuParentId);  
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let mainContent = this.doc.getElementById('main-content');
        if(mainContent){
          mainContent.scrollTop = 0;
        }
      }                
    });
  }

  onClick(menuId){
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);
    this.onClickMenuItem.emit(menuId);     
  }

}
