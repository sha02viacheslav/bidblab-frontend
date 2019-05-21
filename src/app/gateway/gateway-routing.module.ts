import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GatewayComponent } from './gateway.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';

const routes: Routes = [
  {
    path: '',
    component: GatewayComponent,
    children: [
      { path: 'verifyAccount/:verificationToken', component: VerifyAccountComponent },
      { path: 'resetPassword/:resetPasswordToken', component: VerifyAccountComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatewayRoutingModule { }
