import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) {}

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

  getQuestionByQuestionId(questionId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getQuestionByQuestionId/${questionId}`
    );
  }

  getUserDataByuserId(userId) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUserDataByuserId/${userId}`
    );
  }

  getUserAnswerByuserId(userId, interestFilter?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUserAnswerByuserId?userId=${userId || ''}&interestFilter=${interestFilter || ''}`
    );
  }

  getUserQuestionByuserId(userId, interestFilter?) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getUserQuestionByuserId?userId=${userId || ''}&interestFilter=${interestFilter || ''}`
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

  deleteAnswer(questionId, answerId) {
    return this.httpClient
      .delete(
        `${environment.apiUrl}/api/admin/deleteAnswer/${questionId}/${answerId}`
      )
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

  addReport(questionId, answerId, body) {
    return this.httpClient.post(
      `${environment.apiUrl}/api/common/addReport/${questionId}/${answerId}`,
      body
    );
  }  
  getStandardInterests() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getStandardInterests`
    );
  }

  getDefaultCredits() {
		return this.httpClient.get(
			`${environment.apiUrl}/api/common/getDefaultCredits`
		);
  }
  
  getAuctions() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getAuctions`
    );
  }

  getAuctionsAfterLogin() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getAuctionsAfterLogin`
    );
  }

  getBiddingAuctions() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/common/getBiddingAuctions`
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

  goHome() {
    this.router.navigateByUrl('/');
  }

}
