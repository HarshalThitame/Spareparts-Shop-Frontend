import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "../helper/helper";
import {Product} from "../../model/Product.model";

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  constructor(private _http:HttpClient) { }

  uploadProductsFile(selectedProductsFile: File) {
    const formData = new FormData();
    formData.append('file', selectedProductsFile);

    return this._http.post(`${baseURL}/api/admin/products/upload`,formData,{reportProgress:true,observe:'events'})

  }

  getProductDetails(id: number) {
    return this._http.get<Product>(`${baseURL}/api/admin/products/${id}`)
  }

  getAllProductDetails() {
    return this._http.get<Product[]>(`${baseURL}/api/admin/products`)

  }
}
