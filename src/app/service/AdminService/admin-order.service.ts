import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../../model/Order.model";
import baseURL from "../helper/helper";
import {Product} from "../../model/Product.model";

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {

  constructor(private _http: HttpClient) {
  }

  getAllOrders() {
    return this._http.get<Order[]>(`${baseURL}/api/admin/orders`)
  }

  getAllOrderByUser(id: any) {
    return this._http.get<Order[]>(`${baseURL}/api/admin/orders/user/${id}`)
  }

  getOrderByOrderId(id: any) {
    return this._http.get<Order>(`${baseURL}/api/admin/orders/${id}`)
  }

  deleteOrder(orderId: number) {
    return this._http.delete(`${baseURL}/api/admin/orders/${orderId}`)
  }

  markedAsViewed(id: any) {
    return this._http.get(`${baseURL}/api/admin/orders/marked-as-viewed/${id}`)
  }

  markedAsUnViewed(id:any) {
    return this._http.get(`${baseURL}/api/admin/orders/marked-as-un-viewed/${id}`)
  }

  updateOrder(order: Order) {
    return this._http.put<Order>(`${baseURL}/api/admin/orders/update-order`, order)
  }


}
