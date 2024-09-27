import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {LoginService} from "../../service/login.service";
import {Router} from "@angular/router";
import {ProductService} from "../../service/product.service";
import {CategoryService} from "../../service/category.service";
import {User} from "../../model/User.model";
import {InitializerService} from "../../model/InitializerService/initializer.service";
import {Product} from "../../model/Product.model";
import {Category} from "../../model/Category.model";
import {animate, style, transition, trigger} from "@angular/animations";
import NoImage from "../../service/helper/noImage";
import {BrandService} from "../../service/customerService/brand.service";
import {Brand} from "../../model/Brand.model";
import {BrandModel} from "../../model/BrandModel.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(-100%)'}),
        animate('0.5s ease-out', style({opacity: 1, transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({opacity: 0, transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class HomeDashboardComponent implements OnInit {
  user: User;
  categories: Category[] = [];
  products: Product[] = [];
  images: string[] = [
    'https://harshal-ecom.s3.eu-north-1.amazonaws.com/bgimage1.png', // First image
    'https://harshal-ecom.s3.eu-north-1.amazonaws.com/bgimage2.png', // First image
    'https://harshal-ecom.s3.eu-north-1.amazonaws.com/bgimage3.png', // First image


  ];
  currentImage: string = this.images[0];
  currentIndex: number = 0;
  brands: Brand[] = [];
  brandModels: BrandModel[] = [];


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private _initializerServie: InitializerService,
              private _brandService: BrandService,
              private _snackBar: MatSnackBar) {
    this.user = _initializerServie.initializeUser();


    setInterval(() => this.changeImage(), 2000); // Change image every 2 seconds


  }

  ngOnInit(): void {
    this.loadUser();
    this.loadCategories();
    this.loadAllProducts()
  }






  private loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
      if (this.user.userRole === "CUSTOMER") {
        this._router.navigate(['/'])
      } else if (this.user.userRole === "RETAILER") {
        this._router.navigate(['/retailer'])
      } else if (this.user.userRole === "MECHANIC") {
        this._router.navigate(['/mechanic'])
      } else if (this.user.userRole === "ADMIN") {
        this._router.navigate(['/admin'])
      }
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

  changeImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length; // Cycle through images
    this.currentImage = this.images[this.currentIndex]; // Update image source
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
