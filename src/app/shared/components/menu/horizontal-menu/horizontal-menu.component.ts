import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from '../menu.service';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class HorizontalMenuComponent implements OnInit {
  @Input('menuParentId') menuParentId;
  public menuItems:Array<any>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  constructor(
    public menuService:MenuService,
    public router:Router
  ) { }

  ngOnInit() {
    this.menuItems = this.menuService.getHorizontalMenuItems();
    this.menuItems = this.menuItems.filter(item => item.parentId == this.menuParentId);
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // if(this.settings.fixedHeader){
        //   let mainContent = document.getElementById('main-content');
        //   if(mainContent){
        //     mainContent.scrollTop = 0;
        //   }
        // }
        // else{
        //   document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        // }
      }                
    });
  } 

}