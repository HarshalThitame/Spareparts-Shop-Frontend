import { Injectable } from '@angular/core';
import { User } from '../../model/User.model';
import {HttpClient} from "@angular/common/http";
import baseURL from "../helper/helper";

@Injectable({
  providedIn: 'root'
})
export class AdminCustomerService {

  constructor(private _http:HttpClient) {
  }

  addUser(newUser: User) {
    return this._http.post<User>(`${baseURL}/api/admin/user/add-new-user`,newUser);

  }
  getAllUsers() {
     return this._http.get<User[]>(`${baseURL}/api/admin/user/get-all`);
  }

  updateUser(editingUser: User) {
    return this._http.put<User>(`${baseURL}/api/admin/user/update-user`,editingUser);
  }

  deleteUser(id: number) {
    return this._http.delete<User>(`${baseURL}/api/admin/user/delete/${id}`);
  }

  getUserById(id: any) {
    return this._http.get<User>(`${baseURL}/api/admin/user/user-details/${id}`);
  }
  getOrderHistory(id: any) {
    return this._http.get<any>(`${baseURL}/api/admin/user/total/${id}`);
  }
  getMostPurchasedProducts(id: any) {
    return this._http.get<any>(`${baseURL}/api/admin/user/most-purchased-products/${id}`);
  }
}
