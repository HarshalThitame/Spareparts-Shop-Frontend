import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../model/User.model";
import {Category} from "../../../model/Category.model";
import {Product} from "../../../model/Product.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {ProductService} from "../../../service/product.service";
import {CategoryService} from "../../../service/category.service";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import NoImage from "../../../service/helper/noImage";
import noImage from "../../../service/helper/noImage";
import {animate, style, transition, trigger} from "@angular/animations";
import {Brand} from "../../../model/Brand.model";
import {BrandModel} from "../../../model/BrandModel.model";
import {BrandService} from "../../../service/customerService/brand.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-retailer-dashboard',
  templateUrl: './retailer-dashboard.component.html',
  styleUrl: './retailer-dashboard.component.css',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateX(-100%)'}),
        animate('0.5s ease-out', style({opacity: 1, transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({opacity: 0, transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('bounceDrop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px) scale(0.8)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
        animate('0.2s ease-out', style({ transform: 'translateY(-10px)' })),
        animate('0.2s ease-out', style({ transform: 'translateY(0)' })),
      ]),
    ]),
  ]
})
export class RetailerDashboardComponent implements OnInit {
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;

  searchKeyword: string = '';
  bounceState: string = '';
  user: User;
  categories: Category[] = [];
  products: Product[] = [];
  displayedProducts: Product[] = [];
  images: string[] = [
    'https://harshal-ecom.s3.eu-north-1.amazonaws.com/bgimage1.png', // First image
    'https://harshal-ecom.s3.eu-north-1.amazonaws.com/bgimage2.png', // First image
    'https://harshal-ecom.s3.eu-north-1.amazonaws.com/bgimage3.png', // First image


  ];
  currentImage: string = this.images[0];
  currentIndex: number = 0;
  brands: Brand[] = [];
  brandModels: BrandModel[] = [];
  filterProducts: Product[] =[];
  initialLoadCount: number = 6;
  additionalLoadCount: number = 12;
  currentLoadedCount: number = 0; // Track how many products are currently displayed
  totalProducts: number = 0; // Track total products count
  topSellingProducts: Product[]=[];



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
    this.bounceState = 'in'
    this.loadUser();
    this.loadCategories();
    this.load18AllProducts()
    this.loadTopSellingProduct();

  }

  loadTopSellingProduct() {
    this._productService.getTopSellingProduct().subscribe(data=>{
      this.topSellingProducts = data;
      console.log(this.topSellingProducts)
    })
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

  load18AllProducts() {
    this._productService.get18ProductsByGeneral().subscribe((data) => {
      this.products = data;
      this.totalProducts = this.products.length;
      this.loadMoreProducts(this.initialLoadCount);
    });
  }
  loadMoreProducts(count: number) {
    const nextBatch = this.products.slice(this.currentLoadedCount, this.currentLoadedCount + count);
    this.displayedProducts = this.displayedProducts.concat(nextBatch);
    this.currentLoadedCount += nextBatch.length; // Update the current loaded count
  }

  // Method to load more products on button click
  onLoadMoreClick() {
    if (this.currentLoadedCount < this.totalProducts) {
      this.loadMoreProducts(this.additionalLoadCount);
    }
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


  searchProduct() {
    if (this.searchKeyword === '' || this.searchKeyword === null) {
      this.filterProducts = this.products;
    } else {
      this._productService.searchProducts(this.searchKeyword).subscribe((data) => {
        this.filterProducts = data;
        this.displayedProducts = data.slice(0, this.additionalLoadCount);
        this.currentLoadedCount = this.additionalLoadCount;
        const scrollToPosition = this.scrollTarget.nativeElement.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchProduct();
    }
  }

  isOutOfStock(topProduct: Product) {
    return topProduct.stockQuantity==0
  }
}

