import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import baseURL from "../helper";

@Injectable({
  providedIn: 'root'
})
export class BrandAndModelDiscountService {
  private apiUrl = baseURL+'/api/admin/discounts/brand-model'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  // Apply all discounts: retailer, mechanic, and customer
  applyAllDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-all-discounts`, discountFormValue);
  }

  // Apply retailer and mechanic discounts when customer discount is not applied
  applyRetailerAndMechanicDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-retailer-and-mechanic-discounts`, discountFormValue);
  }

  // Apply retailer and customer discounts when mechanic discount is not applied
  applyRetailerAndCustomerDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-retailer-and-customer-discounts`, discountFormValue);
  }

  // Apply mechanic and customer discounts when retailer discount is not applied
  applyMechanicAndCustomerDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-mechanic-and-customer-discounts`, discountFormValue);
  }

  // Apply only retailer discount
  applyRetailerDiscount(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-retailer-discount`, discountFormValue);
  }

  // Apply only mechanic discount
  applyMechanicDiscount(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-mechanic-discount`, discountFormValue);
  }

  // Apply only customer discount
  applyCustomerDiscount(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-customer-discount`, discountFormValue);
  }}
