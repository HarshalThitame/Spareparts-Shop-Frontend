import {Component, OnInit} from '@angular/core';
import {Brand} from "../../../model/Brand.model";
import {BrandModel} from "../../../model/BrandModel.model";
import {Category} from "../../../model/Category.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {ProductService} from "../../../service/product.service";
import {CategoryService} from "../../../service/category.service";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {BrandService} from "../../../service/customerService/brand.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../../model/User.model";

@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrl: './dropdown-search.component.css'
})
export class DropdownSearchComponent implements OnInit {
  brands: Brand[] = [];
  brandModels: BrandModel[] = [];
  user: User;
  selectedBrand: Brand = {
    id: 0,
    name: '',
    brandModels: []
  };

  selectedModel: BrandModel = {
    id: 0,
    name: ''
  };
  selectedCategory: Category = {
    id: 0,
    name: '',
    description: '',
    categoryImage: '',
    subCategories: []
  };
  categories: Category[] = [];

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private _initializerServie: InitializerService,
              private _brandService: BrandService,
              private _snackBar: MatSnackBar) {
    this.user = _initializerServie.initializeUser();

  }

  ngOnInit(): void {
    this.loadUser();
    this.loadCategories();
    this.loadAllBrandAndModel()
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

  loadAllBrandAndModel() {
    this._brandService.getAllBrands().subscribe(data => {
      this.brands = data;
      console.log(this.brands)
    }, error => {
      console.log(error)
      this._snackBar.open("Error While Loading Brands.")
    })

  }

  onBrandSelect(brand: any) {

    if (brand === null) {
      this.selectedBrand = {
        brandModels: this.brandModels,
        id: 0,
        name: ''
      }
    } else {
      this.selectedBrand = brand; // Store the selected brand ID
      this._brandService.getBrandModels(this.selectedBrand.id).subscribe(
        (data) => {
          this.brandModels = data; // Update brand models based on selected brand
        },
        (error) => {
          console.error('Error fetching brand models:', error);
        }
      );
    }
    this.onModelSelect(null)

  }

  onCategorySelect(cat: any) {
    if (cat === null) {
      this.selectedCategory = {
        categoryImage: "", description: "", id: 0, name: "", subCategories: []
      }
    } else {
      this.selectedCategory = cat;
    }
  }

  onModelSelect(model: any) {
    if (model === null) {
      this.selectedModel = {
        id: 0,
        name: ''
      }
    } else {
      this.selectedModel = model;
    }
  }

  SearchByDropdown() {

    if (this.selectedBrand.id!=0 || this.selectedModel.id!=0 || this.selectedCategory.id!=0){
      const allId = this.selectedBrand.id + '-' + this.selectedModel.id + '-' + this.selectedCategory.id;
      if (this.user.userRole === "CUSTOMER")
        this._router.navigate(['/category/sub-category/all-products/', allId])
      else if (this.user.userRole === "RETAILER")
        this._router.navigate(['/retailer/category/sub-category/all-products/', allId])
      else if (this.user.userRole === "MECHANIC")
        this._router.navigate(['/mechanic/category/sub-category/all-products/', allId])
      else
        this._router.navigate(['/category/sub-category/all-products/', allId])

    }else {
      this._snackBar.open("Please Select any one option","",{duration:3000})
    }

  }
}
