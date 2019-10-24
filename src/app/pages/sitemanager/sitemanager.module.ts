import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '$/shared.module';
import { QuillModule } from 'ngx-quill';
import { HowComponent } from './how/how.component';
import { TermsComponent } from './terms/terms.component';
import { CookieComponent } from './cookie/cookie.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutComponent } from './about/about.component';
import { InvestorComponent } from './investor/investor.component';

export const routes = [
  { path: 'how', component: HowComponent},
  { path: 'terms', component: TermsComponent},
  { path: 'cookie', component: CookieComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'about', component: AboutComponent },
  { path: 'investor', component: InvestorComponent },
];


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    QuillModule,
  ],
  declarations: [
    HowComponent, 
    TermsComponent, 
    CookieComponent, 
    PrivacyComponent,
    AboutComponent,
    InvestorComponent,
  ]
})
export class SitemanagerModule { }
