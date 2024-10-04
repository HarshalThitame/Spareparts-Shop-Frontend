import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User.model";
import {Product} from "../../../model/Product.model";
import {Category} from "../../../model/Category.model";
import {SubCategory} from "../../../model/SubCategory.model";
import {LoginService} from "../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerCategoryService} from "../../../service/customerService/customer-category.service";
import {CustomerProductsService} from "../../../service/customerService/customer-products.service";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {SharedDataService} from "../../../service/SharedData/shared-data.service";
import Swal from "sweetalert2";
import noImageURL from '../../../service/helper/noImage';
import {ProductService} from "../../../service/product.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-retailer-all-products',
  templateUrl: './retailer-all-products.component.html',
  styleUrl: './retailer-all-products.component.css',
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

export class RetailerAllProductsComponent  implements OnInit {
  bounceState: string='';
  user: User;
  products: Product[] = [];
  isLoggedIn = false;
  id: any;
  filteredProducts: Product[] = [];
  categories: Category[] = []; // Assume categories are populated
  subCategories:SubCategory[]=[];
  searchTerm: string = '';
  priceRange: number = 100000; // Example price range
  minPrice: number = 0; // Minimum price
  maxPrice: number = 100000; // Maximum price
  selectedCategory: Category ;
  selectedSubCategory: SubCategory; // Add this line in your component class
  isSidebarVisible = true;
  isMobile: boolean =false;
  isPc: boolean = false;


  checkIfMobile(width: number) {
    this.isMobile = width < 768; // Set your breakpoint
    this.isPc = width > 768; // Set your breakpoint
    if (this.isMobile) {
      this.isSidebarVisible = false; // Show sidebar for PC
    }
    if(this.isPc){
      this.isSidebarVisible = true
    }
  }
  constructor(private _loginService: LoginService,
              private _router: Router,
              private _customerCategoryService: CustomerCategoryService,
              private _customerProductService: CustomerProductsService,
              private _route: ActivatedRoute,
              private _initializerService: InitializerService,
              private _sharedDataService:SharedDataService,
              private _productService: ProductService) {

    this.user = _initializerService.initializeUser()
    this.selectedCategory = _initializerService.initializeCategory();
    this.selectedSubCategory = _initializerService.initializeSubCategory();
  }

  ngOnInit(): void {
    this.checkIfMobile(window.innerWidth)
    this.bounceState = 'in'
    this.id = this._route.snapshot.paramMap.get('id');

    this.loadUser();
    this.loadAllProductsOfSubCategory(this.id);
    this.loadAllCategories();
    this._sharedDataService.loadProductBySearchDropdown(this.id);
    this._sharedDataService.filteredProducts$.subscribe(data => {
      this.filteredProducts = data;
    });
  }

  loadUser() {
    this.isLoggedIn = this._loginService.isLoggedIn();
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
      this.isLoggedIn = true;
    })
  }

  loadAllProductsOfSubCategory(id: any) {
    this._customerProductService.getProductsBySubCategoryId(id).subscribe(
      data => {
        this.products = data || []; // Assign empty array if null
        this.filteredProducts = this.products; // Initially show all products
        console.log(this.products);

      },
      error => {
        console.error('Error loading products:', error);
        this.products = []; // Reset in case of error
        this.filteredProducts = []; // Also reset filtered products
      }
    );
  }


  loadAllCategories() {
    this._customerCategoryService.getAllCategories().subscribe(data=>{
      this.categories = data;
    })
  }

  filterProducts() {
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter((product) => {
        return (product.name && product.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (product.brands && product.brands.some(brand => brand.name.toLowerCase().includes(this.searchTerm.toLowerCase()))) ||
          (product.brandModels && product.brandModels.some(model => model.name.toLowerCase().includes(this.searchTerm.toLowerCase()))) ||
          (product.partNumber && product.partNumber.toLowerCase().includes(this.searchTerm.toLowerCase()));
      });
    } else {
      this.filteredProducts = this.products; // Reset to all products if search term is empty
    }
  }

  filterByPrice() {
    this.filteredProducts = this.products.filter(product =>
      product.price >= this.minPrice && product.price <= this.maxPrice
    );
  }

  addToCart(product: Product) {
    const result = this._sharedDataService.checkLoginAndAddToCart(this.user, product, product.moq);

    if (result) {
      console.log("Product successfully added to the cart.");

      Swal.fire({
        title: 'Success!',
        text: 'The product has been successfully added to your cart. You can proceed to checkout or continue shopping to explore more items.',
        icon: 'success',
        timer: 4000, // 2 seconds
        showConfirmButton: false,
        footer: '<a href="/retailer/cart" class="swal2-footer-link btn btn-success border-0">Go to Cart</a>',
        willClose: () => {
          // Optional: do something when alert closes
        }
      })
    }
  }
  selectCategory(category: any): void {
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }
  selectSubCategory(subcategory: SubCategory) {
    this.selectedSubCategory = subcategory;
    if(this.selectedSubCategory!=null){
      this.loadAllProductsOfSubCategory(this.selectedSubCategory.id);
    }
  }

  filterBySubCategory(subcategory: SubCategory) {
    if (!subcategory) return; // Prevent filtering if subcategory is null

    this.filteredProducts = this.products.filter(product =>
      product.subCategories && product.subCategories.some(sub => sub.id === subcategory.id)
    );
    this._router.navigate(['/retailer/category/sub-category/all-products',subcategory.id])
  }





  calculateDiscountedPrice(mrp: number, discount: number): number {
    return mrp - (mrp * discount / 100);
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  protected readonly noImageURL = noImageURL;
}
