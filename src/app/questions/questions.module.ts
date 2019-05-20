import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { QuestionsRoutingModule } from './questions-routing.module';
// import {
//   MatAutocompleteModule,
//   MatButtonModule,
//   MatCardModule,
//   MatChipsModule,
//   MatDividerModule,
//   MatIconModule,
//   MatInputModule,
//   MatPaginatorModule,
//   MatSnackBarModule
// } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionsComponent } from './questions.component';
import { HomeComponent } from './home/home.component';
import { QuestionBoxComponent } from './question-box/question-box.component';
import { QuestionImageComponent } from './question-image/question-image.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
// import { QuestionDetailComponent } from './question-detail/question-detail.component';
// import { BlabComponent } from './blab/blab.component';
// import { BidComponent } from './bid/bid.component';
// import { AboutComponent } from './about/about.component';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    //InfiniteScrollModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // MatInputModule,
    // MatButtonModule,
    // MatIconModule,
    // MatSnackBarModule,
    // MatCardModule,
    // MatChipsModule,
    // MatAutocompleteModule,
    // MatPaginatorModule,
    // MatDividerModule,
    SharedModule,
    QuestionsRoutingModule
  ],
  entryComponents:[
  ],
  declarations: [
    QuestionsComponent,
    HomeComponent,
    QuestionBoxComponent,
    QuestionImageComponent,
    QuestionDetailComponent, 
    // QuestionDetailComponent, 
    // BlabComponent, 
    // BidComponent, 
    // AboutComponent, 
  ]
})
export class QuestionsModule {}

