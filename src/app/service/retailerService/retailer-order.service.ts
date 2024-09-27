import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../../model/Order.model";
import baseURL from "../helper/helper";

@Injectable({
  providedIn: 'root'
})
export class RetailerOrderService {

  constructor(private _http:HttpClient) { }

  createOrder(order:Order){
    return this._http.post(`${baseURL}/api/retailer/orders`,order)
  }


  getAllOrderByUser(id:any){
    return this._http.get<Order[]>(`${baseURL}/api/retailer/orders/user/${id}`)
  }
  getOrderByOrderId(id:any){
    return this._http.get<Order>(`${baseURL}/api/retailer/orders/${id}`)
  }
}
