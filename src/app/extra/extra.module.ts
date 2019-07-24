import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserGuard } from '$/guards/user.guard';
import { SharedModule } from '$/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:friendEmail', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword/:token/:userId', component: ResetPasswordComponent },
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
    ResetPasswordComponent,
  ],
  exports: [
  ]
})
export class ExtraModule { }


