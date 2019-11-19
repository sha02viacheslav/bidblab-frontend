import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { APP_BASE_HREF } from '@angular/common';
import { AuthInterceptor } from './auth.interceptor';
import { BlockUIModule } from 'ng-block-ui';
import { MAT_CHIPS_DEFAULT_OPTIONS, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { environment } from '@environments/environment';
import { SharedModule } from './shared/shared.module';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true               
};

@NgModule({
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    // TransferHttpCacheModule installs a Http interceptor that avoids duplicate HttpClient requests on the client, for requests that were already made when the application was rendered on the server side.
    // TransferHttpCacheModule,
    HttpClientModule,
    NgtUniversalModule,
    SharedModule,
    BlockUIModule.forRoot(),
    PerfectScrollbarModule,
    NgxPageScrollCoreModule.forRoot({duration: 10, scrollOffset: 120, _logLevel: 0}),
    NgxPageScrollModule,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, autoFocus: true, hasBackdrop: true }
    },
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
