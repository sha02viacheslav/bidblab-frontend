import { Injectable } from '@angular/core';
import { BehaviorSubject, TimeoutError } from 'rxjs';
import * as jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string = null;
  private userSubject: BehaviorSubject<any>;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('jwt');
      const user = localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')).user : null;
      this.userSubject = new BehaviorSubject<any>(user);
    }
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
    this.userSubject.next(jwtDecode(localStorage.getItem('jwt')).user);
  }

  getUser() {
    return this.userSubject.getValue();
  }

  getUserUpdates() {
    return this.userSubject.asObservable();
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  isAuthenticated() {
    return this.token != null;
  }

  // isAdmin() {
  //   return this.isAuthenticated() && jwtDecode(this.token).admin;
  // }

  logout() {
    // this.token = null;
    this.userSubject.next(null);
    this.clearLocalStorage();
    this.router.navigateByUrl('/');
  }

  clearLocalStorage(){
    localStorage.removeItem('jwt');
  }
}
