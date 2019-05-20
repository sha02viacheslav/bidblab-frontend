import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { BidService } from '../bid.service';

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
    this.bidService.detailAuction = this.auction;
    this.bidService.detailAuction.display = true;
  }
  
  lessDetail(){
    this.bidService.detailAuction = '';
  }
}

