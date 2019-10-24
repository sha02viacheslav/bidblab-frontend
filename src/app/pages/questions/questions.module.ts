import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '$/shared.module';
import { QuestionsRoutingModule } from './questions-routing.module';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSnackBarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionsComponent } from './questions.component';
import { HomeComponent } from './home/home.component';
import { QuestionBoxComponent } from './question-box/question-box.component';
import { QuestionImageComponent } from './question-image/question-image.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { BlabComponent } from './blab/blab.component';
import { AnswerBoxComponent } from './answer-box/answer-box.component';
import { BidComponent } from './bid/bid.component';
// import { BidComponent } from './bid/bid.component';
// import { AboutComponent } from './about/about.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
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
    BlabComponent,
    AnswerBoxComponent,
    BidComponent,
    // QuestionDetailComponent, 
    // BidComponent, 
    // AboutComponent, 
  ],
  exports: [
    AnswerBoxComponent,
  ]
})
export class QuestionsModule {}

