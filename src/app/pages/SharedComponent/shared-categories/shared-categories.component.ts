import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User.model";
import {Category} from "../../../model/Category.model";
import {Product} from "../../../model/Product.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {ProductService} from "../../../service/product.service";
import {CategoryService} from "../../../service/category.service";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import NoImage from "../../../service/helper/noImage";

@Component({
  selector: 'app-shared-categories',
  templateUrl: './shared-categories.component.html',
  styleUrl: './shared-categories.component.css'
})
export class SharedCategoriesComponent implements OnInit {
  categories: Category[] = [];


  constructor(private _categoryService: CategoryService,) {

  }

  ngOnInit(): void {
    this.loadCategories();
  }


  loadCategories() {
    // Fetch available categories and subcategories
    this._categoryService.getCategoriesByGeneral().subscribe((data) => {
      this.categories = data;
      console.log(data)
    });
  }

  protected readonly NoImage = NoImage;
}
