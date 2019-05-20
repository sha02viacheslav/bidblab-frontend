import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { UserGuard } from '../shared/guards/user.guard';
import { QuestionsComponent } from './questions.component';
import { HomeComponent } from './home/home.component';
import { BidComponent } from './bid/bid.component';
import { BlabComponent } from './blab/blab.component';
// import { AboutComponent } from './about/about.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionsComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'bid', component: BidComponent },
      { path: 'blab', component: BlabComponent },
      // { path: 'about', component: AboutComponent },
      { path: 'question-detail/:questionId', component: QuestionDetailComponent },
      { path: '**', redirectTo: 'home' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule {}

