import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
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
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule } from '@angular/material';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { SignupDialogComponent } from './components/signup-dialog/signup-dialog.component';
// import { LoginComponent } from './components/login/login.component';
// import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
// import { QuestionDialogComponent } from './components/question-dialog/question-dialog.component';
// import { AnswerDialogComponent } from './components/answer-dialog/answer-dialog.component';
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
import { MenuComponent } from './components/menu/menu.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuestionDialogComponent } from './components/question-dialog/question-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
// import { BidListComponent } from './components/bid-list/bid-list.component';
// import { AuctionDetailComponent } from './components/bid-list/auction-detail/auction-detail.component';
// import { AuctionGridComponent } from './components/bid-list/auction-grid/auction-grid.component';
// import { AuctionResultComponent } from './components/bid-list/auction-result/auction-result.component';
// import { AuctionLayerComponent } from './components/bid-list/auction-layer/auction-layer.component';
// import { AuctionDialogComponent } from './components/bid-list/auction-dialog/auction-dialog.component';
// import { NumericDirective } from './directives/number.directive';
// import { DetectScrollDirective } from './directives/detect-scroll.directive';

//import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
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
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    ImageCropperModule,
    PerfectScrollbarModule,
   // QuillModule
  ],
  declarations: [
    // FooterComponent,
    // LoginComponent,
    // SignupDialogComponent,
    // ResetPasswordComponent,
    // AnswerDialogComponent,
    // QuestionDialogComponent,
    // EmptyComponent,
    // QuestionBoxComponent,
    // AlertDialogComponent,
    // ImageblockComponent,
    // AccountNavComponent,
    // AnswerBoxComponent,
    // FollowBoxComponent,
    // ReportDialogComponent,
    // SearchComponent,
    // UploadImageComponent,
    MenuComponent,
    QuestionDialogComponent,
    AlertDialogComponent,
    UploadImageComponent,
    // BidListComponent,
    // AuctionDetailComponent,
    // AuctionGridComponent,
    // AuctionResultComponent,
    // AuctionLayerComponent,
    // AuctionDialogComponent,
    // NumericDirective,
    // DetectScrollDirective
  ],
  entryComponents: [
    // LoginComponent,
    // SignupDialogComponent,
    // ResetPasswordComponent,
    // AnswerDialogComponent,
    AlertDialogComponent,
    // ImageblockComponent,
    QuestionDialogComponent,
    // ReportDialogComponent,
    // AuctionDialogComponent
  ],
  exports: [
    FlexLayoutModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
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
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    // FooterComponent,
    // QuestionBoxComponent,
    // ImageblockComponent,
    // AccountNavComponent,
    // AnswerBoxComponent,
    // FollowBoxComponent,
    // SearchComponent,
    UploadImageComponent,
    MenuComponent,
    // BidListComponent,
    // NumericDirective,
    // DetectScrollDirective
  ]
})
export class SharedModule {}
