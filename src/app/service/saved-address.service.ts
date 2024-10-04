import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ShippingAddress} from "../model/ShippingAddress.model";
import {Observable} from "rxjs";
import baseURL from "./helper/helper";

@Injectable({
  providedIn: 'root'
})
export class SavedAddressService {

  constructor(private _http:HttpClient) { }
  // Create a new saved address
  createSavedAddress(savedAddress: ShippingAddress): Observable<ShippingAddress> {
    return this._http.post<ShippingAddress>(`${baseURL}/api/general/saved-addresses`, savedAddress);
  }

  // Get saved addresses by user ID
  getAddressesByUserId(userId: number): Observable<ShippingAddress[]> {
    return this._http.get<ShippingAddress[]>(`${baseURL}/api/general/saved-addresses/user/${userId}`);
  }

  // Delete a saved address by ID
  deleteSavedAddress(id: number): Observable<void> {
    return this._http.delete<void>(`${baseURL}/api/general/saved-addresses/${id}`);
  }
}
