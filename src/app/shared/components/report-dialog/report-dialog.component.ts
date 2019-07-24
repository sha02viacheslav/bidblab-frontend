import { Component, OnDestroy, Inject, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '../../services/form-validation.service';
import { BlockUIService } from '../../services/block-ui.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { SocketsService } from '../../services/sockets.service';
import { AuthenticationService } from '$/services/authentication.service';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent implements OnInit {
  submitted: boolean = false;
  reports: string[];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private socketsService: SocketsService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ReportDialogComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    this.reports = ["spam", "abuse", "inappropriate"];
    this.form = this.fb.group({
      reportType: [
        this.reports[0],
        [
          Validators.required,
          this.formValidationService.isBlank
        ]
      ],
      reportNote: [
        '',
        [
          Validators.maxLength(50),
          this.formValidationService.isBlank
        ]
      ],
    });
  }

  checkError(form, field, error) {
    return this.formValidationService.checkError(form, field, error);
  }

  submitForm() {
    if (this.form.valid) {
      this.submitted = true;
      this.blockUIService.setBlockStatus(true);
      this.form.value.questionId = this.data.questionId;
      this.form.value.answerId = this.data.answerId;
      this.commonService.addReport(this.form.value).subscribe(
        (res: any) => {
            this.blockUIService.setBlockStatus(false);
            this.snackBar.open(res.msg, 'Dismiss', {duration: 1500})
            .afterOpened()
            .subscribe(() => {
              this.dialogRef.close(res.data);
            });
        },
        (err: HttpErrorResponse) => {
          this.submitted = false;
          this.blockUIService.setBlockStatus(false);
          this.snackBar.open(err.error.msg, 'Dismiss', { duration: 4000 });
        }
      );
    }
    
  }

}
