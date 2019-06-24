import { Injectable } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  public auctionRole = {
    pending: 1,
    process: 2,
    closed: 4,
    deleted: 8,
    all: 15
  };
  public detailAuction: any;
  public questionCredits: number = 0;
  public optionalImageCredits: number = 0;
  public answerCredits: number = 0;
  public referalCredits: number = 0;
  public signupCredits: number = 0;
  public totalCredits: number = 0;
  public loseCredits: number = 0;
  public availuableCredits: number = 0;
  
  constructor(
    public commonService: CommonService,
  ) { }

  public getMyCredits(){
    this.commonService.getMyCredits().subscribe(
      (res: any) => {
        this.questionCredits = res.data.credits.questionCredits;
        this.optionalImageCredits = res.data.credits.optionalImageCredits;
        this.answerCredits = res.data.credits.answerCredits;
        this.referalCredits = res.data.credits.referalCredits;
        this.signupCredits = res.data.credits.signupCredits;
        this.totalCredits = this.questionCredits + this.optionalImageCredits + this.answerCredits + this.referalCredits + this.signupCredits;
        this.loseCredits = res.data.credits.loseCredits;
        this.availuableCredits = this.totalCredits - this.loseCredits;
      },
    );
  }
}

