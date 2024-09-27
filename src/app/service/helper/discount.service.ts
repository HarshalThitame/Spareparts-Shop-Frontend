import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import baseURL from './helper';
import {DiscountRequest} from "../../model/DiscountRequest.model";

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private baseUrl = baseURL + '/api/admin/discounts'; // Updated to include /admin

  constructor(private http: HttpClient) {}

  applyAllDiscounts(discountRequest: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-all`, discountRequest);
  }

  applyRetailerAndMechanicDiscounts(discountRequest: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-retailer-mechanic`, discountRequest);
  }

  applyRetailerAndCustomerDiscounts(discountRequest: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-retailer-customer`, discountRequest);
  }

  applyMechanicAndCustomerDiscounts(discountRequest: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-mechanic-customer`, discountRequest);
  }

  applyRetailerDiscount(discountRequest: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-retailer`, discountRequest);
  }

  applyMechanicDiscount(discountRequest: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-mechanic`, discountRequest);
  }

  applyCustomerDiscount(discountRequest: DiscountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-customer`, discountRequest);
  }

  applyNoDiscounts(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/no-discounts`, { product });
  }
}
