import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '$/services/common.service';
import { BlockUIService } from '$/services/block-ui.service';

@Component({
  selector: 'app-nocredit-dialog',
  templateUrl: './nocredit-dialog.component.html',
  styleUrls: ['./nocredit-dialog.component.scss']
})
export class NocreditDialogComponent implements OnInit {
  public defaultCredits: any;

  constructor(
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    public dialogRef: MatDialogRef < NocreditDialogComponent > ,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.blockUIService.setBlockStatus(true);
    this.commonService.getDefaultCredits().subscribe((res: any) => {
      if(res.data) {
        this.defaultCredits = res.data;
      }
      this.blockUIService.setBlockStatus(false);
    });
  }

  onNoClick(result): void {
    this.dialogRef.close(result);
  }

}
