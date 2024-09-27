import { Injectable } from '@angular/core';
import baseURL from "../helper";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryDiscountService {
  private baseUrl = baseURL + '/api/admin/discounts/category'; // Updated to include /admin

  constructor(private http: HttpClient) {}

  applyAllDiscounts(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-all`, discountRequest);
  }

  applyRetailerAndMechanicDiscounts(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-retailer-mechanic`, discountRequest);
  }

  applyRetailerAndCustomerDiscounts(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-retailer-customer`, discountRequest);
  }

  applyMechanicAndCustomerDiscounts(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-mechanic-customer`, discountRequest);
  }

  applyRetailerDiscount(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-retailer`, discountRequest);
  }

  applyMechanicDiscount(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-mechanic`, discountRequest);
  }

  applyCustomerDiscount(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply-customer`, discountRequest);
  }

  applyNoDiscounts(discountRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/no-discounts`, discountRequest);
  }
}
