import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Offer} from '../../model/Offer.model';
import baseURL from "../helper/helper";
import {Product} from "../../model/Product.model";

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private _http: HttpClient) {
  }

  /**
   * Fetches all active offers from the backend.
   */
  getActiveOffers(): Observable<Offer[]> {
    return this._http.get<Offer[]>(`${baseURL}/api/admin/offers/active`);
  }
  /**
   * Fetches all active offers from the backend.
   */
  getActiveOffersForUsers(): Observable<Offer[]> {
    return this._http.get<Offer[]>(`${baseURL}/api/general/offers/active`);
  }

  createOffer(offer:Offer) {
    return this._http.post<Offer>(`${baseURL}/api/admin/offers`,offer)
  }

  updateOffer(offer: Offer) {
    return this._http.put<Offer>(`${baseURL}/api/admin/offers/add-image`,offer)
  }
  deleteOffer(id: any) {
    return this._http.delete<any>(`${baseURL}/api/admin/offers/${id}`)
  }
  getProductOfActivatedService(id: any) {
    return this._http.get<Product[]>(`${baseURL}/api/general/offers/products/${id}`);
  }

  getActiveOffer(id: any) {
    return this._http.get<Offer>(`${baseURL}/api/general/offers/${id}`);
  }
}
