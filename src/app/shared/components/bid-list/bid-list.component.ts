import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { MatSnackBar } from '@angular/material';
import { DialogService } from '../../../shared/services/dialog.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { BlockUIService } from '../../../shared/services/block-ui.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AnswerDialogComponent } from '../../../shared/components/answer-dialog/answer-dialog.component';
import { SocketsService } from '../../../shared/services/sockets.service';
import { AlertDialogComponent } from '../../../shared/components/alert-dialog/alert-dialog.component';
import { resource } from 'selenium-webdriver/http';
import { environment } from '../../../../environments/environment';
import { MatSelect } from '@angular/material';
import { BidService } from './bid.service';
declare var $: any;

@Component({
  selector: 'app-bid-list',
  templateUrl: './bid-list.component.html',
  styleUrls: ['./bid-list.component.scss']
})
export class BidListComponent implements OnInit, OnDestroy {

  @Input() myBidsFlag: boolean;
  form: FormGroup;
  auctions: any[] = [];
  allAuctions: any[];
  auction: any;
  topAuction: any;
  totalAllAuctionsCount: number;
  cntAuctionsCount: number;
  private socketEventsSubscription: Subscription;
  private pageSize: number;
  serverUrl = environment.apiUrl;
  selectedSortField: string = 'closes';
  sortFields = [
    {value: 'bidblabPrice', viewValue: 'BidBlab Price'},
    {value: 'retailPrice', viewValue: 'Retail Price'},
    {value: 'closes', viewValue: 'Close Time'}
  ]; 
  sortDirection: number = 0;
	private sortParam = {
		active: 'closes',
		direction: 'asc',
  };
  sortDirectionList = [
    'asc',
    'desc',
    ''
  ];
  listType: number = 0;
 
  constructor(
    private fb: FormBuilder,
    private socketsService: SocketsService,
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    public bidService: BidService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {  
    this.pageSize = 10;
    this.getAuctions();
    this.bidService.getMyCredits();
    this.bidService.detailAuction = '';
    
  }

  ngOnDestroy() {
  }

  getAuctions() {
    this.blockUIService.setBlockStatus(true);
    if(this.myBidsFlag){
      this.commonService.getBiddingAuctions().subscribe(
        (res: any) => {
          this.totalAllAuctionsCount = res.data.totalAllAuctionsCount;
          this.allAuctions = res.data.auctions;
          this.applyFilter();
          this.blockUIService.setBlockStatus(false);
        },
        (err: HttpErrorResponse) => {
          this.snackBar.open(err.error.msg, 'Dismiss');
        }
      );
    }
    else{
      if(this.authenticationService.isAuthenticated()){
        this.commonService.getAuctionsAfterLogin().subscribe(
          (res: any) => {
            this.totalAllAuctionsCount = res.data.totalAllAuctionsCount;
            this.allAuctions = res.data.auctions;
            this.applyFilter();
            this.blockUIService.setBlockStatus(false);
          },
          (err: HttpErrorResponse) => {
            this.snackBar.open(err.error.msg, 'Dismiss');
          }
        );
      }
      else{
        this.commonService.getAuctions().subscribe(
          (res: any) => {
            this.totalAllAuctionsCount = res.data.totalAllAuctionsCount;
            this.allAuctions = res.data.auctions;
            this.applyFilter();
            this.blockUIService.setBlockStatus(false);
          },
          (err: HttpErrorResponse) => {
            this.snackBar.open(err.error.msg, 'Dismiss');
          }
        );
      }
    }
  }

  applyFilter(){
    this.auctions = [];
    this.bidService.detailAuction = '';
    this.cntAuctionsCount = 0;
    this.allAuctions.forEach(element => {
      if(this.listType == 0 && element.role != 'closed' || this.listType == 1 && element.role == 'closed'){
        element.index = this.cntAuctionsCount++;
        this.auctions.push(element);
      }
    });
    this.topAuction = this.auctions[0];
  }

  applySort() {
    this.sortParam.active = this.selectedSortField;
    this.sortParam.direction = this.sortDirectionList[this.sortDirection];
    this.auctions.sort((a: any, b: any) => {
      const temp1 = a[this.sortParam.active];
      const temp2 = b[this.sortParam.active];
      if ( temp1 < temp2 ) {
        return this.sortDirection;
      } else if ( temp1 > temp2 ) {
        return -1*this.sortDirection;
      } else {
        return 0;
      }
    });
    for( var index in this.auctions){
      this.auctions[index].index = index;
    };
  }

  changeSortDirection(event){
    event.stopPropagation();
    this.sortDirection = (this.sortDirection + 2) % 3 - 1;
    this.applySort();
  }

}

