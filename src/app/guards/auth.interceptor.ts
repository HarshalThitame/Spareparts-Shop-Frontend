import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {LoginService} from "../service/login.service";

// const TOKEN_HEADER = 'Authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private login: LoginService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('htharshal-ecom.s3.amazonaws.com')) {
      // Clone the request without the Authorization header
      return next.handle(req.clone({ headers: req.headers.delete('Authorization') }));
    }

    //add the jwt token (local storage) request
    const token = this.login.getToken();
    // console.log('token........ ' + token);

    if (token != null) {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
          'ngrok-skip-browser-warning': 'true',
        },
      });
    }
    // console.log('authReq ' + headers);

    return next.handle(req);
  }
}

export const authInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];
