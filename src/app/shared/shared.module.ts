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
// import { SignupDialogComponent } from './components/signup-dialog/signup-dialog.component';
// import { LoginComponent } from './components/login/login.component';
// import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
// import { QuestionDialogComponent } from './components/question-dialog/question-dialog.component';
import { AnswerDialogComponent } from './components/answer-dialog/answer-dialog.component';
// import { EmptyComponent } from './components/empty/empty.component';
// import { QuestionBoxComponent } from './components/question-box/question-box.component';
// import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
// import { ImageblockComponent } from './components/imageblock/imageblock.component';
// import { AccountNavComponent } from './components/account-nav/account-nav.component';
// import { AnswerBoxComponent } from './components/answer-box/answer-box.component';
// import { FollowBoxComponent } from './components/follow-box/follow-box.component';
// import { ReportDialogComponent } from './components/report-dialog/report-dialog.component';
// import { SearchComponent } from './components/search/search.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { VerticalMenuComponent } from './components/menu/vertical-menu/vertical-menu.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuestionDialogComponent } from './components/question-dialog/question-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
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
  ],
  entryComponents: [
    // ResetPasswordComponent,
    AnswerDialogComponent,
    AlertDialogComponent,
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
  ]
})
export class SharedModule {}
