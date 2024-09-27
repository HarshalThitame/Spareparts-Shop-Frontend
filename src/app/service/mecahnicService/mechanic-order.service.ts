import { Injectable } from '@angular/core';
import baseURL from "../helper/helper";
import {Order} from "../../model/Order.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MechanicOrderService {

  constructor(private _http:HttpClient) { }

  createOrder(order:Order){
    return this._http.post(`${baseURL}/api/mechanic/orders`,order)
  }


  getAllOrderByUser(id:any){
    return this._http.get<Order[]>(`${baseURL}/api/mechanic/orders/user/${id}`)
  }

  getOrderByOrderId(id:any){
    return this._http.get<Order>(`${baseURL}/api/mechanic/orders/${id}`)
  }
}
