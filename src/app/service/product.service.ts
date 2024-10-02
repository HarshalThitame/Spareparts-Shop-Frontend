import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper/helper";
import {Product} from "../model/Product.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private _http:HttpClient) { }

  addProduct(formData: any) {
    return this._http.post(`${baseURL}/api/admin/products`,formData)
  }

  getAllProducts() {
      return this._http.get<Product[]>(`${baseURL}/api/admin/products`)
  }

  getAllProductsByGeneral() {
    return this._http.get<Product[]>(`${baseURL}/api/general/products`)
  }

  getProductById(id: any) {
    return this._http.get(`${baseURL}/api/admin/products/${id}`)
  }

  getProductByIdByGeneral(id: any) {
    return this._http.get<Product>(`${baseURL}/api/general/product/${id}`)
  }

  // Search by dropdown
  searchByBrandsAndBrandModelAndCategory(brandId: number | undefined, brandModelId: number | undefined, categoryId: number) {
    return this._http.get<Product[]>(`${baseURL}/api/general/searchByBrandsAndBrandModelAndCategory/${brandId}/${brandModelId}/${categoryId}`);
  }

  searchByBrandAndModel(brandId: number | undefined, brandModelId: number | undefined) {
    return this._http.get<Product[]>(`${baseURL}/api/general/searchByBrandAndModel/${brandId}/${brandModelId}`);
  }

  searchByBrandAndCategory(brandId: number | undefined, categoryId: number | undefined) {
    return this._http.get<Product[]>(`${baseURL}/api/general/searchByBrandAndCategory/${brandId}/${categoryId}`);
  }

  searchByModelAndCategory(brandModelId: number | undefined, categoryId: number | undefined) {
    return this._http.get<Product[]>(`${baseURL}/api/general/searchByModelAndCategory/${brandModelId}/${categoryId}`);
  }

  searchByBrand(brandId: number | undefined) {
    return this._http.get<Product[]>(`${baseURL}/api/general/searchByBrand/${brandId}`);
  }

  searchByModel(brandModelId: number | undefined) {
    return this._http.get<Product[]>(`${baseURL}/api/general/searchByModel/${brandModelId}`);
  }

  searchByCategory(categoryId: number | undefined) {
    return this._http.get<Product[]>(`${baseURL}/api/general/searchByCategory/${categoryId}`);
  }


  updateProduct(productData: any) {
      return this._http.put(`${baseURL}/api/admin/products`,productData)

  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this._http.get<Product[]>(`${baseURL}/api/general/products/search?keyword=${keyword}`);
  }
}
