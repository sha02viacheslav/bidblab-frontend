import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
  
@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {

  @Input() auction: any;
  serverUrl = environment.apiUrl;

  constructor() { }

  ngOnInit() {
  }

}
