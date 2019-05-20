import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})

export class UserGuard implements CanLoad, CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/questions/home'], {
        queryParams: {
          returnUrl: state.url
        }
      });
      return false;
    }
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.authenticationService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
