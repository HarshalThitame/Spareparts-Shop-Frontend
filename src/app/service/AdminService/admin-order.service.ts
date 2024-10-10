import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../../model/Order.model";
import baseURL from "../helper/helper";
import {Product} from "../../model/Product.model";
import {OrderItem} from "../../model/OrderItem.model";
import {EmailData} from "../../model/EmailData.model";

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {


  constructor(private _http: HttpClient) {
  }

  getAllOrders() {
    return this._http.get<Order[]>(`${baseURL}/api/admin/orders`)
  }

  getAllOrdersByPagination(currentPage: number, pageSize: number) {
    return this._http.get<any>(`${baseURL}/api/admin/orders/by-pagination?page=${currentPage}&size=${pageSize}`);
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

  getAllOrderItems() {
    return this._http.get<OrderItem[]>(`${baseURL}/api/admin/order-items`)
  }


  sendEmail(emailData: EmailData) {
    return this._http.post(`${baseURL}/api/admin/orders/send-order-mail`,emailData)
  }

  getNewOrders() {
    return this._http.get<Order[]>(`${baseURL}/api/admin/orders/new-orders`)
  }

  getNewOrderCount() {
    return this._http.get<number>(`${baseURL}/api/admin/orders/new-order-count`)
  }

  getVorOrders(page: number, size: number) {
    return this._http.get<any[]>(`${baseURL}/api/admin/orders/by-pagination/is-vor?page=${page}&size=${size}`);
  }

}
