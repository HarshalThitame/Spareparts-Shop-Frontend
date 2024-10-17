import { Injectable } from '@angular/core';
import baseURL from "../helper/helper";
import {Order} from "../../model/Order.model";
import {HttpClient} from "@angular/common/http";
import {EmailData} from "../../model/EmailData.model";

@Injectable({
  providedIn: 'root'
})
export class MechanicOrderService {

  constructor(private _http:HttpClient) { }

  createOrder(order:Order){
    return this._http.post(`${baseURL}/api/mechanic/orders`,order)
  }

  sendEmailOfOrder(emailData:EmailData){
    return this._http.post(`${baseURL}/api/mechanic/orders/send-order-mail`,emailData)
  }


  getAllOrderByUser(id:any){
    return this._http.get<Order[]>(`${baseURL}/api/mechanic/orders/user/${id}`)
  }

  getOrderByOrderId(id:any){
    return this._http.get<Order>(`${baseURL}/api/mechanic/orders/${id}`)
  }

  cancelOrder(id:any){
    return this._http.delete(`${baseURL}/api/mechanic/orders/${id}/cancel`)
  }
}
