import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { disableDebugTools } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private httpClient: HttpClient) {}

  updateProfile(body) {
    return this.httpClient.patch(
      `${environment.apiUrl}/api/user/updateProfile`,
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
}
