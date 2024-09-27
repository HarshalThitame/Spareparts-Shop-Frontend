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
  selector: 'app-retailer-dashboard',
  templateUrl: './retailer-dashboard.component.html',
  styleUrl: './retailer-dashboard.component.css'
})
export class RetailerDashboardComponent implements OnInit{
  user: User;
  categories: Category[]=[];
  products: Product[] = [];


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private _initializerServie:InitializerService) {
    this.user = _initializerServie.initializeUser();

  }

  ngOnInit(): void {
    this.loadUser();
    this.loadCategories();
    this.loadAllProducts()
  }


  private loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;

    });
  }

  loadCategories() {
    // Fetch available categories and subcategories
    this._categoryService.getCategoriesByGeneral().subscribe((data) => {
      this.categories = data;
      console.log(data)
    });

  }

  loadAllProducts() {
    this._productService.getAllProductsByGeneral().subscribe(data => {
      this.products = data;
    })
  }

  getDiscountedPrice(product: Product): number {
    return product.price - (product.price * this.getDiscount(product) / 100);
  }

  getDiscount(product: Product): number {
    switch (this.user.userRole) {
      case "CUSTOMER":
        return product.discountOnPurchase;
      case "RETAILER":
        return product.discountToRetailer;
      case "MECHANIC":
        return product.discountToMechanics;
      default:
        return product.discountOnPurchase;
    }
  }

  protected readonly noImage = NoImage;
}
