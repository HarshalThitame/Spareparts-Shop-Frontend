import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "../helper/helper";
import {Brand} from "../../model/Brand.model";
import {BrandModel} from "../../model/BrandModel.model";

@Injectable({
  providedIn: 'root'
})
export class AdminBrandService {


  constructor(private _http:HttpClient) { }

  getAllBrands()
  {
    return this._http.get<Brand[]>(`${baseURL}/api/admin/brand/all`)
  }


  deleteBrand(brandId: any) {
    return this._http.delete(`${baseURL}/api/admin/brand/${brandId}`)

  }

  updateBrand(editingBrandId: any, newBrand: Brand) {
    return this._http.put<Brand>(`${baseURL}/api/admin/brand/${editingBrandId}`,newBrand);

  }

  addBrand(newBrand: Brand) {
    return this._http.post<Brand>(`${baseURL}/api/admin/brand`,newBrand);
  }

  deleteBrandModel(id: any) {
    return this._http.delete(`${baseURL}/api/admin/brand/models/${id}`)
  }

  getBrandModels(brandId: any) {
    return this._http.get<BrandModel[]>(`${baseURL}/api/admin/brand/${brandId}/models`)
  }

}
