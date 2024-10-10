import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import baseURL from "./helper/helper";
import {User} from "../model/User.model";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loginStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService) {
  }


  //get current user
  public getCurrentUser() {
    let token: any = this.getToken();
    console.log("token from service : " + token);
    let observable = this.http.get<any>(`${baseURL}/auth/current-user`);
    observable.subscribe(data => {
      if (!data.active) {
        this.logout()
      }
    })
    return observable;
  }

  public createUser(user: any) {
    return this.http.post<any>(`${baseURL}/auth/signup`, user);
  }

  deleteUSer(user: any) {
    return this.http.delete(`${baseURL}/auth/delete/${user.id}`)
  }


  //generate token
  public generateToken(loginData: any) {

    return this.http.post(`${baseURL}/auth/login`, loginData);
  }

  public loginUser(token: any) {
    const expirationDate = new Date(new Date().getTime() + 60 * 60 * 24 * 8 * 1000); // 8 days from now
    this.cookieService.set('token', token, {secure: false, path: '/', expires: expirationDate})
    console.log(this.cookieService.get('token'))
    return true;
  }

  public updateSeller(seller: any) {
    return this.http.put(`${baseURL}/auth/update`, seller);
  }

  public updateUser(user: any) {
    return this.http.put(`${baseURL}/auth/update`, user);
  }

  public updateUserPassword(user: any) {
    return this.http.put(`${baseURL}/auth/update-password`, user);
  }

  public isLoggedIn() {
    let tokenStr = this.cookieService.get('token'); // Get token from cookie

    return tokenStr !== undefined && tokenStr !== '';
  }

  public isUserPresent(email: any) {
    return this.http.post<any>(`${baseURL}/auth/is-present`, email);
  }

  public logout() {
    // Ensure to match the 'path' and 'secure' options when deleting the cookie
    this.cookieService.delete('token', '/', '', false); // path='/', domain='', and secure=false (match your loginUser options)

    localStorage.removeItem('user');
    console.log(this.cookieService.get('token')); // Should return an empty string if deleted successfully
    return true;
  }


  //set userDetails
  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  //Get user
  public getUser() {
    let userStr = localStorage.getItem('user');

    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.logout();
      return null;
    }
  }


  //get user role

  public getUserRole() {
    let user = this.getUser();
    return user.userRole;
  }


  public getToken() {
    return this.cookieService.get('token');
  }
}
