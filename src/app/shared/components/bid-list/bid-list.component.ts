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

@Component({
  selector: 'app-bid-list',
  templateUrl: './bid-list.component.html',
  styleUrls: ['./bid-list.component.scss']
})
export class BidListComponent implements OnInit, OnDestroy {

  public auctionRole = {
    pending: 1,
    process: 2,
    closed: 4,
    deleted: 8,
    all: 15
  };
  @Input() myBidsFlag: boolean;
  form: FormGroup;
  auctions: any[] = [];
  auction: any;
  totalAuctionsCount: number;
  private socketEventsSubscription: Subscription;
  public pageSize: number = 10;
  public pageIndex: number = 0;
  serverUrl = environment.apiUrl;
  auctionType: number = this.auctionRole.process;
  public selectedSortField: string = '';
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
  ) {
    commonService.scrollEventReciver$.subscribe(params => {
      this.onScroll();
    });
  }

  ngOnInit() {  
    this.pageSize = 10;
    this.getAuctions();
    if(this.authenticationService.isAuthenticated()){
      this.bidService.getMyCredits();
    }
    this.bidService.detailAuction = null;
    this.listenToSocket();
  }

  ngOnDestroy() {
    this.socketEventsSubscription.unsubscribe();
  }

  getAuctions() {
    if(this.myBidsFlag){
      this.commonService.getBiddingAuctions(this.pageSize, this.pageIndex, null, this.auctionType).subscribe(
        (res: any) => {
          this.totalAuctionsCount = res.data.totalAuctionsCount;
          var start = this.auctions.length;
          res.data.auctions.forEach(element => {
            element.index = start++;
            this.auctions.push(element);
          });
        },
        (err: HttpErrorResponse) => {
          this.snackBar.open(err.error.msg, 'Dismiss');
        }
      );
    }
    else{
      if(this.authenticationService.isAuthenticated()){
        this.commonService.getAuctionsAfterLogin(this.pageSize, this.pageIndex, null, this.auctionType).subscribe(
          (res: any) => {
            this.totalAuctionsCount = res.data.totalAuctionsCount;
            var start = this.auctions.length;
            res.data.auctions.forEach(element => {
              element.index = start++;
              this.auctions.push(element);
            });
          },
          (err: HttpErrorResponse) => {
            this.snackBar.open(err.error.msg, 'Dismiss');
          }
        );
      }
      else{
        this.commonService.getAuctions(this.pageSize, this.pageIndex, null, this.auctionType).subscribe(
          (res: any) => {
            this.totalAuctionsCount = res.data.totalAuctionsCount;
            var start = this.auctions.length;
            res.data.auctions.forEach(element => {
              element.index = start++;
              this.auctions.push(element);
            });
          },
          (err: HttpErrorResponse) => {
            this.snackBar.open(err.error.msg, 'Dismiss');
          }
        );
      }
    }
  }

  getAuction(auctionId) {
    this.commonService.getAuctionById(auctionId).subscribe(
      (res: any) => {
        const index = this.auctions.findIndex(
          currentQuestion => currentQuestion._id === res.data.auction._id
        );
        if (index !== -1) {
          res.data.auction.index = this.auctions[index].index;
          this.auctions[index] = res.data.auction;
          if(this.bidService.detailAuction && this.auctions[index].index == this.bidService.detailAuction.index){
            this.bidService.detailAuction = null;
            setTimeout(() => { 
              this.bidService.detailAuction = this.auctions[index];
            }, 100);
          }
        }
      },
      (err: HttpErrorResponse) => {
        this.snackBar.open(err.error.msg, 'Dismiss');
      }
    );
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

  onScroll() {
    if((this.pageIndex + 1) * this.pageSize < this.totalAuctionsCount){
      this.pageIndex = this.pageIndex + 1;
      this.getAuctions();
    } 
  }  

  private listenToSocket() {
    this.socketEventsSubscription = this.socketsService
      .getSocketEvents()
      .pipe(filter((event: any) => event.payload))
      .subscribe((event: any) => {
        if (event.payload.type === 'auction') {
          if (event.name === 'createdData') {
            // console.log("create auction")
          } else if (event.name === 'updatedData') {
            // console.log("update auction", event.payload.data);
            this.getAuction(event.payload.data.auctionId);
            this.snackBar.open('Auction was updated.', 'Dismiss', {
              duration: 2000
            });
          }
        }
      });
  }

}

