import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Offer} from '../../model/Offer.model';
import baseURL from "../helper/helper";

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

  createOffer(offer:Offer) {
    return this._http.post<Offer>(`${baseURL}/api/admin/offers`,offer)
  }
}
