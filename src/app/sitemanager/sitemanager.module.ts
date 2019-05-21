import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HowComponent } from './how/how.component';
import { TermsComponent } from './terms/terms.component';
import { CookieComponent } from './cookie/cookie.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { AboutComponent } from './about/about.component';

export const routes = [
  { path: 'how', component: HowComponent},
  { path: 'terms', component: TermsComponent},
  { path: 'cookie', component: CookieComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'about', component: AboutComponent },
];


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    HowComponent, 
    TermsComponent, 
    CookieComponent, 
    PrivacyComponent,
    AboutComponent,
  ]
})
export class SitemanagerModule { }
