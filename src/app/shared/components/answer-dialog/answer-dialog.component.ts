import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '../../services/form-validation.service';
import { BlockUIService } from '../../services/block-ui.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { SocketsService } from '../../services/sockets.service';

@Component({
  selector: 'app-answer-dialog',
  templateUrl: './answer-dialog.component.html',
  styleUrls: ['./answer-dialog.component.scss']
})
export class AnswerDialogComponent implements OnInit {
  submitted: boolean;
  form: FormGroup;
  defaultCredits: any;

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private socketsService: SocketsService,
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.submitted = false;
    this.form = this.fb.group({
      content: [
        this.data.answer ? this.data.answer.content : '',
        [
          Validators.required,
          Validators.maxLength(500),
          this.formValidationService.isBlank
        ]
      ]
    });

		this.commonService.getDefaultCredits().subscribe(
			(res: any) => {
					this.defaultCredits = res.data;
				},
			(err: HttpErrorResponse) => {
				}
			);
  }

  checkError(form, field, error) {
    return this.formValidationService.checkError(form, field, error);
  }

  submitForm(answertype) {
    if(answertype == 'skip'){
      this.dialogRef.close(true);
    }
    else if (this.form.valid) {
      this.submitted = true;
      this.blockUIService.setBlockStatus(true);
      if (this.data.answer) {
        this.commonService
          .updateAnswer(
            this.data.question._id,
            this.data.answer._id,
            this.form.value
          )
          .subscribe(
            (res: any) => {
              this.socketsService.notify('updatedData', {
                type: 'answer',
                data: Object.assign(
                  { questionId: this.data.questionId },
                  res.data
                )
              });
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(res.msg, 'Dismiss', {
                  duration: 1500
                })
                .afterOpened()
                .subscribe(() => {
                  res.data.answerer = this.data.answer.answerer;
                  this.dialogRef.close(res.data);
                });
            },
            (err: HttpErrorResponse) => {
              this.submitted = false;
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(err.error.msg, 'Dismiss', {
                  duration: 4000
                })
                .afterDismissed()
                .subscribe(() => {});
            }
          );
      } else {
        this.commonService
          .addAnswer(this.data.question._id, answertype, this.form.value)
          .subscribe(
            (res: any) => {
              this.socketsService.notify('createdData', {
                type: 'answer',
                data: Object.assign(
                  { questionId: this.data.questionId },
                  res.data
                )
              });
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(res.msg, 'Dismiss', {
                  duration: 1500
                })
                .afterOpened()
                .subscribe(() => {
                  this.dialogRef.close(true);
                });
            },
            (err: HttpErrorResponse) => {
              this.submitted = false;
              this.blockUIService.setBlockStatus(false);
              this.snackBar
                .open(err.error.msg, 'Dismiss', {
                  duration: 4000
                })
                .afterDismissed()
                .subscribe(() => {});
            }
          );
      }
    }
  }
}
