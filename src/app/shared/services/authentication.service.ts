import { Injectable } from '@angular/core';
import { BehaviorSubject, TimeoutError } from 'rxjs';
import * as jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;
  private userSubject: BehaviorSubject<any>;

  constructor(
    private router: Router,
  ) {
    this.token = localStorage.getItem('jwt');
    const user =
      JSON.parse(localStorage.getItem('user')) ||
      (this.token ? jwtDecode(this.token).user : null);
    this.userSubject = new BehaviorSubject<any>(user);
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
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
    return this.token != null && this.getUser() != null;
  }

  isAdmin() {
    return this.isAuthenticated() && jwtDecode(this.token).admin;
  }

  logout() {
    this.token = null;
    this.userSubject.next(null);
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
