import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../shared/components/menu/menu.service';
import { CommonService } from '../shared/services/common.service';

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
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.menuItems = this.menuService.getVerticalMenuItems();
  }

}
