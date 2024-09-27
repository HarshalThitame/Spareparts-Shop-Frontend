import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "../helper/helper";
import {ShippingAddress} from "../../model/ShippingAddress.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerShippingAddressService {

  constructor(private _http:HttpClient) { }

  saveCustomerAddress(formData:FormData){
    return this._http.post(`${baseURL}/api/customer/shipping-addresses`,formData)
  }
  getAddressByUser(id: number) {
    return this._http.get<ShippingAddress[]>(`${baseURL}/api/customer/shipping-addresses/user/${id}`)

  }
}
