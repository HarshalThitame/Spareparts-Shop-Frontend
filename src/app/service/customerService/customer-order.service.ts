import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../../model/Order.model";
import baseURL from "../helper/helper";

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  constructor(private _http:HttpClient) { }

  createOrder(order:Order){
    return this._http.post(`${baseURL}/api/customer/orders`,order)
  }

  getAllOrderByUser(id:any){
    return this._http.get<Order[]>(`${baseURL}/api/customer/orders/user/${id}`)
  }

  getOrderByOrderId(id:any){
    return this._http.get<Order>(`${baseURL}/api/customer/orders/${id}`)
  }
}
