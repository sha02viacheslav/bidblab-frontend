import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import {
  MatButtonModule,
  MatInputModule,
  MatSnackBarModule,
  MatCardModule,
  MatTabsModule,
  MatIconModule,
  MatSelectModule,
  MatChipsModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    SharedModule,
    UserRoutingModule
  ],
  declarations: [UserComponent],
})
export class UserModule {}
