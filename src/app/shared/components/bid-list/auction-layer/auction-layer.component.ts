import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DialogService } from '../../../../shared/services/dialog.service';
import { AlertDialogComponent } from '../../../../shared/components/alert-dialog/alert-dialog.component';
import { NocreditDialogComponent } from '../../../../shared/components/nocredit-dialog/nocredit-dialog.component';
import { environment } from '../../../../../environments/environment';
import { BidService } from '../bid.service';
import { AuctionDialogComponent } from '../auction-dialog/auction-dialog.component';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auction-layer',
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => in', [
        animate(500, style({transform: 'translateX(-100%)'}))
      ])
    ])
  ],
  templateUrl: './auction-layer.component.html',
  styleUrls: ['./auction-layer.component.scss']
})
export class AuctionLayerComponent implements OnInit {

  @Input() auction: any;
  @Input() auctionType: any;
  private serverUrl = environment.apiUrl;

  constructor(
    private bidService: BidService,
		public dialog: MatDialog,
    private dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  openBidDialog(){
    if (this.authenticationService.isAuthenticated()) {
      if(this.bidService.availuableCredits < this.auction.bidFee){
        this.dialog.open(NocreditDialogComponent, 
          {
            data: {},
            width: '320px',
          });
      }
      else{
        this.dialog
          .open(AuctionDialogComponent, {
            data: {
              auction: this.auction
            },
            width: '800px'
          })
          .afterClosed()
          .subscribe(newBid => {
            if (newBid) {
              this.dialog.
                open(AlertDialogComponent, {
                  data: {
                    title: "Bid successfully submitted!",
                    comment: "",
                    dialog_type: "bid" 
                  },
                  width: '320px',
                }).afterClosed().subscribe(result => {
                  if(result == 'more'){
                    this.openBidDialog();
                  }
                });
            }
          });
      }
    }
    else{
      this.router.navigateByUrl('/extra/login');
    }
  }

  displayDetail(){
    this.bidService.detailAuction = this.auction;
  }
  
}
