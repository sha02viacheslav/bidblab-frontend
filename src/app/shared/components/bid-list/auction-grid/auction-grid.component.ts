import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BidService } from '../bid.service';
import { MatTableDataSource, MatOption, MatSort } from '@angular/material';

@Component({
  selector: 'app-auction-grid',
  templateUrl: './auction-grid.component.html',
  styleUrls: ['./auction-grid.component.scss']
})
export class AuctionGridComponent implements OnInit {

  @Input() auction: any;
  serverUrl = environment.apiUrl;

  constructor(
    private bidService: BidService,
  ) { }

  ngOnInit() {
  }

  displayDetail(){
    this.lessDetail();
    setTimeout(() => { 
      this.viewDetail();
    }, 100);
    
  }

  viewDetail(){
    this.bidService.detailAuction = this.auction;
  }
  
  lessDetail(){
    this.bidService.detailAuction = null;
    this.bidService.dataSource = null;
  }
}

