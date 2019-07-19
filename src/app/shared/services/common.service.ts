import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subject, TimeoutError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private mediaObserver: MediaObserver,
  ) {}

  private scrollEventEmitter = new Subject();
  scrollEventReciver$ = this.scrollEventEmitter.asObservable();

  public isMediaActive(breakpoint) {
    return this.mediaObserver.isActive(breakpoint)
  }

  infiniteScrolled() {
    this.scrollEventEmitter.next();
  }

  processQuill(originQuill) {
    originQuill = originQuill.replace(new RegExp("\n", "g"), "");
    originQuill = originQuill.replace(new RegExp("&gt;", "g"), ">");
    originQuill = originQuill.replace(new RegExp("&lt;", "g"), "<");
    var a = document.createElement('div');
    a.innerHTML = originQuill
    while(a.querySelector('pre')){
      a.querySelector('pre').outerHTML = a.querySelector('pre').innerHTML;
    }
    
    let scriptDiv = document.createElement('div');
    while(a.querySelector('script')){
      let s = document.createElement('script');
      s.type = `text/javascript`;
      s.text = a.querySelector('script').innerHTML;
      scriptDiv.appendChild(s);
      a.querySelector('script').outerHTML = '';
    }
    var result = {innerHtml: a.innerHTML, script: scriptDiv}
    return result;
  }

  userLogin(body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/auth/userLogin`,
      body
    );
  }

  signup(body) {
    return this.httpClient.post(`${environment.apiUrl}/api/auth/signup`, body);
  }

  verifyAccount(token) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/auth/verifyAccount/${token}`,
      null
    );
  }

  forgotPassword(body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/auth/forgotPassword`,
      body
    );
  }

  checkResetPasswordToken(token) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/auth/checkResetPasswordToken/${token}`
    );
  }

  resetPassword(userId, token, body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/auth/resetPassword/${userId}/${token}`,
      body
    );
  }

  updateProfile(body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/auth/updateProfile`,
      body
    );
  }

  changeProfilePicture(body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/auth/changeProfilePicture`,
      body,
      {
        reportProgress: true,
      }
    );
  }

  changePassword(body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/auth/changePassword`,
      body
    );
  }

  getQuestions(limit?, offset?, search?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getQuestions?limit=${limit ||
        10}&offset=${offset || 0}&search=${search || ''}`
    );
  }

  getQuestionsCanAnswer(limit?, offset?, search?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getQuestionsCanAnswer?limit=${limit ||
        10}&offset=${offset || 0}&search=${search || ''}`
    );
  }

  getQuestionByQuestionId(questionId, userId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getQuestionByQuestionId/${questionId}/${userId}`
    );
  }

  getUserDataByuserId(userId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUserDataByuserId/${userId}`
    );
  }

  getUserAnswerByuserId(userId, tagFilter?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUserAnswerByuserId?userId=${userId || ''}&tagFilter=${tagFilter || ''}`
    );
  }

  getUserQuestionByuserId(userId, tagFilter?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUserQuestionByuserId?userId=${userId || ''}&tagFilter=${tagFilter || ''}`
    );
  }

  getQuestionsByAskerId() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getQuestionsByAskerId/`
    );
  }

  getQuestionsFollowing() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getQuestionsFollowing/`
    );
  }

  getUsersFollowing() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUsersFollowing/`
    );
  }

  getUserData() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUserData/`
    );
  }

  getQuestionsWithYourAnswers() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getQuestionsWithYourAnswers/`
    );
  }

  getMyCredits() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getMyCredits/`
    );
  }

  addQuestion(body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/common/addQuestion`,
      body,
      {
        reportProgress: true
      }
    );
  }

  addAnswer(questionId, answertype, body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/common/addAnswer/${questionId}/${answertype}`,
      body
    );
  }

  skipAnswer(questionId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/skipAnswer/${questionId}`
    );
  }

  updateQuestion(questionId, body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/admin/updateQuestion/${questionId}`,
      body
    );
  }

  updateAnswer(questionId, answerId, body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/admin/updateAnswer/${questionId}/${answerId}`,
      body
    );
  }

  deleteQuestion(questionId) {
    return this.httpClient
      .delete(`${environment.apiUrl}/api/admin/deleteQuestion/${questionId}`)
      .toPromise();
  }

  deleteUser(userId) {
    return this.httpClient
      .delete(`${environment.apiUrl}/api/admin/deleteUser/${userId}`)
      .toPromise();
  }

  changeQuestionPicture(body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/common/changeQuestionPicture`,
      body,
      {
        reportProgress: true,
      }
    );
  }

  addFollow(followType, objectId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/addFollow/${followType}/${objectId}`
    );
  }
  deleteFollow(followType, objectId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/deleteFollow/${followType}/${objectId}`
    );
  }
  addThumb(questionId, answerId, thumbType) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/addThumb/${questionId}/${answerId}/${thumbType}`
    );
  }

  addReport(body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/common/addReport`,
      body
    );
  }  
  
  getAllTags() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getAllTags`
    );
  }

  getAllInterests() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getAllInterests`
    );
  }

  getDefaultCredits() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getDefaultCredits`
		);
  }

  getAuctions(limit?, offset?, search?, auctionType?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getAuctions?limit=${limit ||
        10}&offset=${offset || 0}&search=${search || ''}&auctionType=${auctionType || ''}`
    );
  }

  getAuctionsAfterLogin(limit?, offset?, search?, auctionType?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getAuctionsAfterLogin?limit=${limit ||
        10}&offset=${offset || 0}&search=${search || ''}&auctionType=${auctionType || ''}`
    );
  }

  getBiddingAuctions(limit?, offset?, search?, auctionType?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getBiddingAuctions?limit=${limit ||
        10}&offset=${offset || 0}&search=${search || ''}&auctionType=${auctionType || ''}`
    );
  }

  getAuctionById(auctionId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getAuctionById/${auctionId}`
    );
  }

  addBid(auctionId, body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/common/addBid/${auctionId}`,
      body
    );
  }

  getImage(imageUrl: string){
    return this.httpClient
      .get(imageUrl, { responseType: 'blob' });
  }

  getAboutPageContent() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getAboutPageContent`
		);
	}

  getHowPageContent() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getHowPageContent`
		);
  }
  
  getPrivacyPageContent() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getPrivacyPageContent`
		);
  }
  
  getCookiePageContent() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getCookiePageContent`
		);
  }
  
  getTermsPageContent() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getTermsPageContent`
		);
  }
  
  getInvestorPageContent() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getInvestorPageContent`
		);
  }
  
  sendMessage(body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/common/sendMessage`,
      body
    );
  } 

  archiveMessage(body) {
      return this.httpClient.post(
        `${environment.apiUrl}/api/common/archiveMessage`,
        body
      );
  } 

  getMails(limit?, offset?, search?, type?, active?, direction?) {
      return this.httpClient.get<any>(
        `${environment.apiUrl}/api/common/getMails?limit=${limit ||
          10}&offset=${offset || 0}&search=${search || ''}&type=${type ||
          ''}&active=${active || ''}&direction=${direction || ''}`
      );
  }

  applyRoleOfMails(body, roleType, apply){
      return this.httpClient.post(
          `${environment.apiUrl}/api/common/applyRoleOfMails/${roleType}/${apply}`,
          body
      );
  }

  invite(body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/common/invite`,
      body
    );
  } 
  
  squarePay(body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/common/squarePay`,
      body
    );
  } 

  goHome() {
    this.router.navigateByUrl('/');
  }

}
