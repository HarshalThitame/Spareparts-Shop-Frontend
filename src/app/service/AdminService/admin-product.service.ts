import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "../helper/helper";
import {Product} from "../../model/Product.model";
import {Image} from "../../model/Image.model";
import {Observable} from "rxjs";

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

  addOrUpdateProduct(product:Product) {
    return this._http.post<Product>(`${baseURL}/api/admin/products`,product)
  }

  addProductCoverImages(images:any){
    return this._http.post<Image>(`${baseURL}/api/admin/products/upload-cover-image`,images)
  }


  updateProductMainImage(product:Product,image:any){
    return this._http.post<any>(`${baseURL}/api/admin/products/upload-main-image/${product.id}`, {image})
  }


  getLowStockProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${baseURL}/api/admin/alert/products/low-stock`);
  }

  getDeadProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${baseURL}/api/admin/alert/products/dead`);
  }

  getRecentlyUpdatedProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${baseURL}/api/admin/alert/products/recent-updates`);
  }

  updateProductStock(product: Product) {
    return this._http.post<Product>(`${baseURL}/api/admin/products/update-stock`,product)
  }
  updateProductBlockedStatus(product: Product) {
    return this._http.post<Product>(`${baseURL}/api/admin/products/blocked`,product)
  }

}
