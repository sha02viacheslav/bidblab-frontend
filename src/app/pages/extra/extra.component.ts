import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '$/components/menu/menu.service';
import { CommonService } from '$/services/common.service';

@Component({
  selector: 'app-extra',
  templateUrl: './extra.component.html',
  styleUrls: ['./extra.component.scss']
})
export class ExtraComponent implements OnInit {

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
