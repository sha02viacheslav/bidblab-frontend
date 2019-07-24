import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { SharedModule } from '$/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditsComponent } from './credits/credits.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { MailboxComponent } from './mailbox/mailbox.component';
import { MyanswersComponent } from './myanswers/myanswers.component';
import { MybidsComponent } from './mybids/mybids.component';
import { MyquestionsComponent } from './myquestions/myquestions.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { InviteComponent } from './invite/invite.component';

const routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: 'following', component: FollowingComponent },
      { path: 'followers', component: FollowersComponent },
      { path: 'mybids', component: MybidsComponent },
      { path: 'myquestions', component: MyquestionsComponent },
      { path: 'myanswers', component: MyanswersComponent },
      { path: 'credits', component: CreditsComponent },
      { path: 'editprofile', component: EditProfileComponent },
      { path: 'viewprofile', component: ViewProfileComponent },
      { path: 'invite', component: InviteComponent },
      { path: 'mailbox', component: MailboxComponent },
      { path: '**', redirectTo: 'myquestions' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AccountComponent,
    CreditsComponent,
    FollowersComponent,
    FollowingComponent,
    MailboxComponent,
    MyanswersComponent,
    MybidsComponent,
    MyquestionsComponent,
    EditProfileComponent,
    ViewProfileComponent,
    InviteComponent,
  ],
  exports: [
    AccountComponent
  ]
})
export class AccountModule { }

