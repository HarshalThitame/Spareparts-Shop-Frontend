import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import baseURL from "./helper/helper";
import {Category} from "../model/Category.model";
import {SubCategory} from "../model/SubCategory.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private _http:HttpClient) { }

  getCategories() {
    return this._http.get<Category[]>(`${baseURL}/api/admin/category`)
  }
  getCategoriesByGeneral() {
    return this._http.get<Category[]>(`${baseURL}/api/general/categories`)
  }

  getSubCategories() {
    return this._http.get(`${baseURL}/api/admin/subCategories`)
  }

  getSubCategoriesByCategoryId(id:any){
    return this._http.get<SubCategory[]>(`${baseURL}/api/general/subCategories/${id}`)
  }

  addCategory(category: any){
    return this._http.post<Category>(`${baseURL}/api/admin/category`,category)
  }

  updateCategory(editingCategoryId: number, formValue: any) {
    return this._http.put<Category>(`${baseURL}/api/admin/category/${editingCategoryId}`,formValue)
  }

  deleteCategory(categoryId: any) {
    return this._http.delete(`${baseURL}/api/admin/category/${categoryId}`)
  }

  deleteSubCategory(id: any) {
    return this._http.delete(`${baseURL}/api/admin/category/subcategory/${id}`)
  }
}
