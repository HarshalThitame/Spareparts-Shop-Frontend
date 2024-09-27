import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "../helper/helper";
import {Cart} from "../../model/Cart.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerCartService {

  constructor(private _http:HttpClient) { }

  addOrUpdateToCart(cart:Cart){
    return this._http.post(`${baseURL}/api/customer/cart/add`,cart);
  }

  getCartByUser(id: number) {
    return this._http.get<Cart>(`${baseURL}/api/customer/cart/${id}`);
  }

  removeItem(userId: any,productId:any) {
      return this._http.delete(`${baseURL}/api/customer/cart/remove/${userId}/${productId}`)
  }

  deleteCart(id: any) {
    return this._http.delete(`${baseURL}/api/customer/cart/clear/${id}`)
  }

}
