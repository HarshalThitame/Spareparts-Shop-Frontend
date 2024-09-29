import { Component, OnInit } from '@angular/core';
import { LoginService } from "../../../service/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../../service/product.service";
import { CategoryService } from "../../../service/category.service";
import { Category } from "../../../model/Category.model";
import { SubCategory } from "../../../model/SubCategory.model";
import { CustomerCategoryService } from "../../../service/customerService/customer-category.service";
import NoImage from "../../../service/helper/noImage";
import {User} from "../../../model/User.model";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-shared-sub-categories',
  templateUrl: './shared-sub-categories.component.html',
  styleUrls: ['./shared-sub-categories.component.css',], // Corrected to styleUrls
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
export class SharedSubCategoriesComponent implements OnInit {
  bounceState: string='';
  user: User;
  subCategories: SubCategory[] = [];
  id: any;
  searchTerm: string = '';
  categories: Category[] = []; // Populate this with your categories
  filteredSubCategories: SubCategory[] = []; // This will hold filtered subcategories
  selectedCategory: Category | null = null;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _customerCategoryService: CustomerCategoryService,
    private _categoryService: CategoryService,
    private _route: ActivatedRoute,
    private _initializerService:InitializerService
  ) {
    this.user = _initializerService.initializeUser();
  }

  ngOnInit(): void {
    this.bounceState = 'in'
    this.id = this._route.snapshot.paramMap.get('id');
    this.loadUser();
    this.loadSubCategories(this.id);
    this.loadAllCategories();
    this.loadCategoryById(this.id)
  }

  loadCategoryById(id: any) {
        this._customerCategoryService.getCategoryById(id).subscribe(data=>{
          this.selectedCategory = data;
        })
    }

  private loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    });
  }

  loadSubCategories(id: any) {
    this._categoryService.getSubCategoriesByCategoryId(id).subscribe(data => {
      this.subCategories = data;
      this.filteredSubCategories = this.subCategories; // Initially display all subcategories
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  loadAllCategories() {
    this._customerCategoryService.getAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  // Method to filter subcategories based on search term and selected category
  filterCategories() {
    this.filteredSubCategories = this.subCategories.filter(subCat => {
      const matchesSearchTerm = subCat.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSelectedCategory = this.selectedCategory ? subCat.id === this.selectedCategory.id : true; // Adjust this based on your data structure
      return matchesSearchTerm && matchesSelectedCategory;
    });
  }

  // Method to select a category
  selectCategory(category: Category) {
    this.selectedCategory = category;
    this.loadSubCategories(category.id)
    this._router.navigate(['/category/sub-category',category.id])
  }

  protected readonly NoImage = NoImage;

  gotoAllProducts(id:any) {
    if (this.user.userRole==="CUSTOMER")
    {
      this._router.navigate(['/category/sub-category/all-products',id]);
    }
    else
    if (this.user.userRole==="RETAILER")
    {
      this._router.navigate(['/retailer/category/sub-category/all-products',id]);
    }
    else
    if (this.user.userRole==="MECHANIC")
    {
      this._router.navigate(['/mechanic/category/sub-category/all-products',id]);
    }
  }
}
