import { Component, OnDestroy, Inject, OnInit, Optional, AfterViewInit, AfterContentInit, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators,  FormControl  } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FormValidationService } from '../../services/form-validation.service';
import { BlockUIService } from '../../services/block-ui.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';
import { SocketsService } from '../../services/sockets.service';
import { ENTER } from '@angular/cdk/keycodes';
const COMMA = 188;

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.scss']
})
export class QuestionDialogComponent implements OnInit {

  @ViewChild('inputForTag') inputForTag: ElementRef;
  submitted: boolean;
  infoForm: FormGroup;
  standardInterests: string[];
  uploadFiles: any[] = [];
  defaultCredits: any;
  selectedFileIndex: number = -1;
  public autocomplete: any[] = [];
  private autocompleteSubscription: Subscription;
  separatorKeysCodes = [ENTER, COMMA];
  tags = [];

  constructor(
    private fb: FormBuilder,
    private formValidationService: FormValidationService,
    private blockUIService: BlockUIService,
    public commonService: CommonService,
    private socketsService: SocketsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.submitted = false;
    this.infoForm = this.fb.group({
      title: [
        this.data.question ? this.data.question.title : (this.data.newTitle? this.data.newTitle : ''),
        [
          Validators.required,
          Validators.maxLength(500),
          this.formValidationService.isBlank
        ]
      ],
      tag: ['']
    });

    this.autocompleteSubscription = this.infoForm
    .get('tag')
    .valueChanges.pipe(debounceTime(100))
    .subscribe(text => {
      if (text.trim()) {
        this.autocomplete = this.standardInterests.filter(element => element.match(new RegExp("(" + text + ")", "i")));
      } else {
        this.autocomplete = [];
      }
    });

    this.commonService.getStandardInterests().subscribe(
      (res: any) => {
        this.standardInterests = res.data;
      },
      (err: HttpErrorResponse) => {
      }
    );

    this.commonService.getDefaultCredits().subscribe(
			(res: any) => {
					this.defaultCredits = res.data;
				},
			(err: HttpErrorResponse) => {
				}
			);
    
  }

  addTag() {
    if(this.tags.length < 3) {
      let value = this.infoForm.value.tag;
      if ((value || '').trim()) {
        this.tags.push(value.trim());
      }
      this.infoForm.controls.tag.setValue('');
      this.inputForTag.nativeElement.value = '';
    } else {
      this.snackBar.open('You can add tags less than or equal to 3.', 'Dismiss', {duration: 4000});
    }
  }

  removeTag(index: any) {
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  checkError(form, field, error) {
    return this.formValidationService.checkError(form, field, error);
  }

  submitForm() {
    if (this.infoForm.valid) {
      if(!this.tags.length || this.tags.length > 3) {
        this.snackBar.open('You must add tags less than or equal to 3.', 'Dismiss', {duration: 4000});
      } else {
        let uploadData = new FormData();
        this.uploadFiles.forEach(element => {
          if(element.croppedFile){
            uploadData.append('file', element.croppedFile, element.croppedFile.name);
          }
        });

        uploadData.append('title', this.infoForm.value.title);
        uploadData.append('tags', JSON.stringify(this.tags));
        this.blockUIService.setBlockStatus(true);
        this.commonService.addQuestion(uploadData).subscribe((res: any) => {
          this.socketsService.notify('createdData', {
            type: 'question',
            data: res.data
          });
          this.blockUIService.setBlockStatus(false);
          this.submitted = true;
          this.dialogRef.close(res.data);
        }, (err: HttpErrorResponse) => {
          this.submitted = false;
          this.blockUIService.setBlockStatus(false);
          this.snackBar.open(err.error.msg, 'Dismiss', {duration: 4000});
        });
      }
    }
  }

  addPicture(data) {
    if (data) {
      this.uploadFiles[this.selectedFileIndex] = {
        originalFile: data.originalFile,
        croppedFile: data.croppedFile? data.croppedFile : this.uploadFiles[this.selectedFileIndex].croppedFile,
        croppedImage: data.croppedImage? data.croppedImage : this.uploadFiles[this.selectedFileIndex].croppedImage
      };
    }
    else{
      this.uploadFiles.splice(this.selectedFileIndex, 1);
    }
    this.selectedFileIndex = -1;
  }

  openCrop(index){
    if(this.selectedFileIndex != -1 && this.uploadFiles[this.selectedFileIndex].croppedFile == ''){
      this.uploadFiles.splice(this.selectedFileIndex, 1);
    }
    this.selectedFileIndex = index;
  }

  addFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.uploadFiles.push({
        originalFile: event.target.files[0],
        croppedFile: '',
        croppedImage: ''
      });
      this.selectedFileIndex = this.uploadFiles.length - 1;
    }
  }

}

