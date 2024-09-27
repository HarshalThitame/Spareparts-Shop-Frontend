import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../../model/Product.model";
import baseURL from "../helper/helper";
import {Category} from "../../model/Category.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerCategoryService {

  constructor(private _http:HttpClient) { }

  getAllCategories(){
    return this._http.get<Category[]>(`${baseURL}/api/general/categories`)

  }
  getCategoryById(id: any) {
    return this._http.get<Category>(`${baseURL}/api/general/category/${id}`)
  }
}
