import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../shared/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
// import { AuthenticationService } from '../../../shared/services/authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { environment } from '../../../../../environments/environment';
// import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatOption, MatSort } from '@angular/material';

@Component({
  selector: 'app-auction-result',
  templateUrl: './auction-result.component.html',
  styleUrls: ['./auction-result.component.scss']
})
export class AuctionResultComponent implements OnInit, AfterViewInit {

  @Input() auction: any; 
  @Input() auctionType: any;
  private serverUrl = environment.apiUrl;
	public displayedColumns: string[] = ['bidPrice', 'username', 'createdAt'];
	public dataSource:any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
    this.auction.bids.forEach(element => {
      element.username = element.bidder.username;
    });
    this.dataSource = new MatTableDataSource<any>(this.auction.bids);
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  
}





