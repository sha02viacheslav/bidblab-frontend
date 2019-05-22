import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { CommonService } from '../../shared/services/common.service';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})

export class MailboxComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;

  public mailRole = {
    inbox: 1 ,
    sent: 2,
    archived: 4,
    trash: 8,
    all: 15
  }

  public sidenavOpen:boolean = true;
  public mails: any[];
  public mail: any;
  public newMail: boolean;
  public mailType:number = this.mailRole.all;
  public totalMails: number;
	private pageSize: number;
	public pageIndex: number;
	private search: string = '';
	private sortParam = {
		active: 'name',
		direction: 'asc',
	};
  public searchText: string;
  public form:FormGroup;
	public selection = new SelectionModel<any>(true, []);
  serverUrl = environment.apiUrl;
  
  

  constructor(
    public formBuilder: FormBuilder, 
    public snackBar: MatSnackBar,
    public commonService: CommonService,
		public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getMails();      
    if(window.innerWidth <= 992){
      this.sidenavOpen = false;
    }
    this.form = this.formBuilder.group({
      'recievers': ['Admin', Validators.required],
      'subject': '',    
      'message': ''
    }); 
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth <= 992) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  getMails(event?) {
    if (event) {
      this.pageSize = event.pageSize;
      this.pageIndex = event.pageIndex;
    }   
    this.commonService.getMails(
      this.pageSize,
      this.pageIndex,
      this.search,
      this.mailType,
      this.sortParam.active,
      this.sortParam.direction,
    ).subscribe(
      (res: any) => {
        this.totalMails = res.data.totalMails;
        this.mails = res.data.mails;

        this.mail = '';
        this.mails.forEach(row => {
          row.selected = false;
          row.isDeleted = (row.role & (1 << 3))? true : false;
        });
        this.selection.clear();
        if(this.totalMails <= this.pageSize * this.pageIndex){
        this.pageIndex = 0;
        }
      },
      (err: HttpErrorResponse) => {
      }
    );
  }
  
  isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.mails.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.mails.forEach(row => this.selection.select(row));
	}

  public viewDetail(mail){
    this.mail = mail;    
    this.mails.forEach(m => m.selected = false);
    this.mail.selected = true;
    if(!this.mail.sender){
      this.form.controls.recievers.setValue(String('Admin'));
      this.form.controls.subject.setValue(this.mail.subject);
      this.form.controls.message.setValue('');
    }
    // this.mail.unread = false;
    this.newMail = false;
    if(window.innerWidth <= 992){
      this.sidenav.close(); 
    }
  }

  public compose(){
    this.mail = null;
    this.form.controls.recievers.setValue(String('Admin'));
    this.form.controls.subject.setValue('');
    this.form.controls.message.setValue('');
    this.newMail = true;
  }

  public applyRoleOfMails(roleType, apply){
		var mailIds = [];
		this.mails.forEach( (row) => {
			if(this.selection.selected.some( selected => selected.index == row.index )){
				mailIds.push(row._id);
			}
		});
		this.finalApplyRoleOfMails(mailIds, roleType, apply);
	}

	public applyRoleOfMail(mailId, roleType, apply){
		var mailIds = [];
		mailIds.push(mailId);
		this.finalApplyRoleOfMails(mailIds, roleType, apply);
	}

	public finalApplyRoleOfMails(mailIds, roleType, apply) {
		if(mailIds.length){
			if(confirm("Are you sure to " + (apply == 'true'? 'delete' : 'restore') + "?")){
				this.commonService.applyRoleOfMails(mailIds, roleType, apply)
					.subscribe(
					(res: any) => {
            this.getMails();
            this.mail = null;
					},
					(err: HttpErrorResponse) => {
					}
					);
			}
		}
		else{
			alert("Select the questions");
		}
  }
  

  public changeStarStatus() {       
    this.mail.starred = !this.mail.starred;
    this.getMails(); 
  }

  applySearch(searchValue: string) {
		this.search = searchValue.trim().toLowerCase();
		this.getMails();
	}

  public sendMessage(mail){
    if (this.form.valid) {
      this.dialog.
        open(AlertDialogComponent, {
          data: {
            title: this.form.value.subject? "Are you sure send message?" : 
              "This message has no subject. Are you sure you want to send it?",
            comment: "",
            dialog_type: "confirm" 
          },
          width: '320px',
        }).afterClosed().subscribe(result => {
          if(result == 'more'){
            this.commonService.sendMessage(mail).subscribe(
              (res: any) => {
                this.snackBar.open('Mail sent to ' + mail.recievers + ' successfully!', null, {
                  duration: 2000,
                });
                this.getMails();
                this.form.reset();
              },
              (err: HttpErrorResponse) => {
                this.snackBar.open(err.error.msg, 'Dismiss', {
                  duration: 2000
                });
              }
            );
          }
        });
    }
  }

  public cancelSendMessage(mail){
    this.newMail = false; 
    if(mail.recievers){
      if(confirm("Will you archive message?")){
        this.commonService.archiveMessage(mail).subscribe(
          (res: any) => {
            this.snackBar.open(res.msg, null, {
              duration: 2000,
            });
            this.getMails();
          },
          (err: HttpErrorResponse) => {
            this.snackBar.open(err.error.msg, 'Dismiss', {
              duration: 2000
            });
          }
        );
      }
    }
    this.form.reset();  
  }

}
