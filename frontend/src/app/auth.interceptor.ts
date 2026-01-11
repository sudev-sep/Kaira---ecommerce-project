import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let modifiedReq = req;
    if (token) {
      // DRF TokenAuthentication expects the header value to be 'Token <key>' not 'Bearer'
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`
        }
      });
    }


    if(req.url.includes('/login/') || req.url.includes('/register/')) {
      return next.handle(req);
    }

    return next.handle(modifiedReq).pipe(
      catchError((err) => {
        // On 401, clear stored auth and redirect to login
        if (err && err.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('usertype');
          localStorage.removeItem('is_superuser');
          try {
            this.router.navigate(['/login']);
          } catch (e) {
            // navigation may fail in some contexts; ignore
          }
        }
        return throwError(() => err);
      })
    );
  }
}
