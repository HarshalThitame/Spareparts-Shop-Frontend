import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../../model/Product.model";
import baseURL from "../helper/helper";

@Injectable({
  providedIn: 'root'
})
export class CustomerProductsService {

  constructor(private _http:HttpClient) { }

  getAllProductsByGeneral() {
    return this._http.get<Product[]>(`${baseURL}/api/general/products`)
  }
  getProductByIdByGeneral(id: any) {
    return this._http.get<Product>(`${baseURL}/api/general/product/${id}`)
  }
  getProductsBySubCategoryId(id:any){
    return this._http.get<Product[]>(`${baseURL}/api/general/products/by-sub-category/${id}`)
  }
}
