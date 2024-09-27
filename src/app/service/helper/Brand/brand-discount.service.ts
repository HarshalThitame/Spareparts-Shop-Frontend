import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import baseURL from "../helper";

@Injectable({
  providedIn: 'root'
})
export class BrandDiscountService {
  private apiUrl = baseURL+'/api/admin/discounts/brand'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  // Apply all discounts (retailer, mechanic, customer)
  applyAllDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-all`, discountFormValue);
  }

  // Apply retailer and mechanic discounts (no customer discount)
  applyRetailerAndMechanicDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-retailer-mechanic`, discountFormValue);
  }

  // Apply retailer and customer discounts (no mechanic discount)
  applyRetailerAndCustomerDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-retailer-customer`, discountFormValue);
  }

  // Apply mechanic and customer discounts (no retailer discount)
  applyMechanicAndCustomerDiscounts(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-mechanic-customer`, discountFormValue);
  }

  // Apply only retailer discount
  applyRetailerDiscount(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-retailer`, discountFormValue);
  }

  // Apply only mechanic discount
  applyMechanicDiscount(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-mechanic`, discountFormValue);
  }

  // Apply only customer discount
  applyCustomerDiscount(discountFormValue: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply-customer`, discountFormValue);
  }
}
