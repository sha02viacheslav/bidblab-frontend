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
  public sidenavOpen:boolean = true;
  public mails: any[];
  public mail: any;
  public newMail: boolean;
  public type:string = 'all';
  private totalMails: number;
	private pageSize: number;
	private pageIndex: number;
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
      'subject': ['', Validators.required],    
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

    let role;                        
    switch(this.type){
      case 'all': { role = 1 << 0 | 1 << 1 | 1 << 2; break; }
      case 'inbox': { role = 1 << 0; break; }
      case 'sent': { role = 1 << 1; break; }
      case 'archived': { role = 1 << 2; break; }
    }
    this.commonService.getMails(
      this.pageSize,
      this.pageIndex,
      this.search,
      role,
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
    // this.mail.unread = false;
    this.newMail = false;
    if(window.innerWidth <= 992){
      this.sidenav.close(); 
    }
  }

  public compose(){
    this.mail = null;
    this.form.controls.recievers.setValue(String('Admin'));
    this.newMail = true;
  }

  public setAsRead(){
    this.mail.unread = false;
  }

  public setAsUnRead(){
    this.mail.unread = true;
  }

  public delete() {
    this.mail.trash = true;
    this.mail.sent = false;
    this.mail.draft = false; 
    this.mail.starred = false; 
    this.getMails();
    this.mail = null;
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

  public restore(){
    this.mail.trash = false;
    this.type = 'all';
    this.getMails();
    this.mail = null; 
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
            title: "Are you sure send message?",
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
              },
              (err: HttpErrorResponse) => {
                this.snackBar.open(err.error.msg, 'Dismiss', {
                  duration: 2000
                });
              }
            );
            this.form.reset();
          }
        });
        
    }
  }

  public cancelSendMessage(mail){
    this.newMail = false; 
    if(mail.recievers && mail.subject && mail.message){
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
