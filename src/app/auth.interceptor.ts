import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './shared/services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        this.authenticationService.getToken() || ''
      )
    });
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          err.status === 401 &&
          err.error.msg === 'Login timed out, please login again.'
        ) {
          this.authenticationService.logout();
        }
        return observableThrowError(err);
      })
    );
  }
}
