import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '$/components/menu/menu.service';
import { CommonService } from '$/services/common.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public menuItems:Array<any>;
  constructor(
    private router: Router,
    public menuService:MenuService,
    public commonService: CommonService,
  ) { }

  ngOnInit() {
    this.menuItems = this.menuService.getVerticalMenuItems();
  }

}
