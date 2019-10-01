import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule } from '@angular/material';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AnswerDialogComponent } from './components/answer-dialog/answer-dialog.component';
import { VerticalMenuComponent } from './components/menu/vertical-menu/vertical-menu.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuestionDialogComponent } from './components/question-dialog/question-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { NocreditDialogComponent } from './components/nocredit-dialog/nocredit-dialog.component';
import { SquareDialogComponent } from './components/square-dialog/square-dialog.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { NumericDirective } from './directives/number.directive';

//import { QuillModule } from 'ngx-quill';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HorizontalMenuComponent } from './components/menu/horizontal-menu/horizontal-menu.component';
import { BidListComponent } from './components/bid-list/bid-list.component';
import { AuctionDetailComponent } from './components/bid-list/auction-detail/auction-detail.component';
import { AuctionDialogComponent } from './components/bid-list/auction-dialog/auction-dialog.component';
import { AuctionGridComponent } from './components/bid-list/auction-grid/auction-grid.component';
import { AuctionLayerComponent } from './components/bid-list/auction-layer/auction-layer.component';
import { AuctionResultComponent } from './components/bid-list/auction-result/auction-result.component';
import { SearchComponent } from './components/search/search.component';
import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';

import {AppShellNoRenderDirective} from './directives/app-shell-no-render.directive';
import {AppShellRenderDirective} from './directives/app-shell-render.directive';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    // FlexLayoutServerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ImageCropperModule,
    PerfectScrollbarModule,
    InfiniteScrollModule,
    // QuillModule
  ],
  declarations: [
    // ResetPasswordComponent,
    AnswerDialogComponent,
    VerticalMenuComponent,
    QuestionDialogComponent,
    AlertDialogComponent,
    NocreditDialogComponent,
    SquareDialogComponent,
    UploadImageComponent,
    HorizontalMenuComponent,
    BidListComponent,
    AuctionDetailComponent,
    AuctionDialogComponent,
    AuctionGridComponent,
    AuctionLayerComponent,
    AuctionResultComponent,
    NumericDirective,
    SearchComponent,
    ReportDialogComponent,
    AppShellNoRenderDirective,
    AppShellRenderDirective
  ],
  entryComponents: [
    // ResetPasswordComponent,
    AnswerDialogComponent,
    AlertDialogComponent,
    NocreditDialogComponent,
    SquareDialogComponent,
    QuestionDialogComponent,
    ReportDialogComponent,
    AuctionDialogComponent
  ],
  exports: [
    FlexLayoutModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    InfiniteScrollModule,
    SearchComponent,
    UploadImageComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BidListComponent,
    NumericDirective,
    AppShellNoRenderDirective,
    AppShellRenderDirective
  ],
  providers: [
    AppShellNoRenderDirective,
    AppShellRenderDirective
  ]
})
export class SharedModule {}
