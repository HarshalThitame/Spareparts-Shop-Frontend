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
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-shared-categories',
  templateUrl: './shared-categories.component.html',
  styleUrl: './shared-categories.component.css',
  animations: [
    trigger('bounceDrop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px) scale(0.8)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
        animate('0.2s ease-out', style({ transform: 'translateY(-10px)' })),
        animate('0.2s ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class SharedCategoriesComponent implements OnInit {
  categories: Category[] = [];
  bounceState: string='';



  constructor(private _categoryService: CategoryService,) {

  }

  ngOnInit(): void {
    this.bounceState = 'in'
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
