import { Injectable } from '@angular/core';
import baseURL from "../helper/helper";
import {Cart} from "../../model/Cart.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RetailerCartService {

  constructor(private _http:HttpClient) { }

  addOrUpdateToCart(cart:Cart){
    return this._http.post(`${baseURL}/api/retailer/cart/add`,cart);
  }

  getCartByUser(id: number) {
    return this._http.get<Cart>(`${baseURL}/api/retailer/cart/${id}`);
  }

  removeItem(userId: any,productId:any) {
    return this._http.delete(`${baseURL}/api/retailer/cart/remove/${userId}/${productId}`)
  }

  deleteCart(id: any) {
    return this._http.delete(`${baseURL}/api/retailer/cart/clear/${id}`)
  }
}
