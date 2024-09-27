import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Category} from "../../model/Category.model";
import baseURL from "../helper/helper";

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryService {

  constructor(private _http:HttpClient) { }

  getCategoriesByProductId(id:any){
    return this._http.get<any>(`${baseURL}/api/admin/category/product/${id}`)
  }

  getSubCategoriesByProductId(id:any){
    return this._http.get<any>(`${baseURL}/api/admin/category/sub/product/${id}`)
  }
}
