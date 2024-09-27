import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Brand} from "../../model/Brand.model";
import baseURL from "../helper/helper";
import {BrandModel} from "../../model/BrandModel.model";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private _http:HttpClient) { }

  getAllBrands(){
    return this._http.get<Brand[]>(`${baseURL}/api/general/brands`)
  }

  getAllBrandModels(){
    return this._http.get<BrandModel[]>(`${baseURL}/api/general/brand-models`)
  }


  getBrandModels(brandId: any) {
    return this._http.get<BrandModel[]>(`${baseURL}/api/general/brand-models/${brandId}`)
  }
}
