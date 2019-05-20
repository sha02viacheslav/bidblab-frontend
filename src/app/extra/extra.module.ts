import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserGuard } from '../shared/guards/user.guard';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InviteComponent } from './invite/invite.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

const routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:friendEmail', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'invite', component: InviteComponent, canActivate: [UserGuard] },
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
    SignupComponent,
    LoginComponent,
    InviteComponent,
  ],
  exports: [
  ]
})
export class ExtraModule { }


