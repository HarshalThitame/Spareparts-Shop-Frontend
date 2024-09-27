import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Cart} from "../../model/Cart.model";
import baseURL from "../helper/helper";

@Injectable({
  providedIn: 'root'
})
export class MechanicCartService {
  constructor(private _http:HttpClient) { }

  addOrUpdateToCart(cart:Cart){
    return this._http.post(`${baseURL}/api/mechanic/cart/add`,cart);
  }

  getCartByUser(id: number) {
    return this._http.get<Cart>(`${baseURL}/api/mechanic/cart/${id}`);
  }

  removeItem(userId: any,productId:any) {
    return this._http.delete(`${baseURL}/api/mechanic/cart/remove/${userId}/${productId}`)
  }

  deleteCart(id: any) {
    return this._http.delete(`${baseURL}/api/mechanic/cart/clear/${id}`)
  }
}
