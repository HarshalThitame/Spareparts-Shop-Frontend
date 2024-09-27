import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../../model/Category.model";
import {Brand} from "../../../../model/Brand.model";
import {BrandModel} from "../../../../model/BrandModel.model";
import {ProductService} from "../../../../service/product.service";
import {CategoryService} from "../../../../service/category.service";
import {AdminBrandService} from "../../../../service/AdminService/admin-brand.service";
import {User} from "../../../../model/User.model";
import {SubCategory} from "../../../../model/SubCategory.model";
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {HttpEventType} from "@angular/common/http";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {Product} from "../../../../model/Product.model";
import {AdminCategoryService} from "../../../../service/AdminService/admin-category.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-admin-edit-product',
  templateUrl: './admin-edit-product.component.html',
  styleUrl: './admin-edit-product.component.css'
})
export class AdminEditProductComponent implements OnInit {
  productForm: FormGroup;
  id: any;
  selectedFile: File | null = null;
  user: User | undefined;
  selectedCategories: Category[] = [];
  selectedSubCategories: SubCategory[] = [];
  selectedBrands: Brand[] = [];
  selectedBrandModels: BrandModel[] = [];
  category: any;
  brands: Brand[] = [];
  calculatedPrices = {
    purchase: 0,
    counter: 0,
    mechanics: 0,
    retailer: 0,
  };
  discountAmounts = {
    purchase: 0,
    counter: 0,
    mechanics: 0,
    retailer: 0,
  };
  product: Product;

  constructor(
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _loginService: LoginService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _adminBrandService: AdminBrandService,
    private _adminProductService: AdminProductService,
    private _route: ActivatedRoute,
    private _initializeService: InitializerService,
    private _adminCategoryService: AdminCategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      partNumber: ['', Validators.required],
      stockQuantity: [0, Validators.required],
      binLocation: ['', Validators.required],
      discountOnPurchase: [0, Validators.required],
      discountToCounter: [0, Validators.required],
      discountToMechanics: [0, Validators.required],
      discountToRetailer: [0, Validators.required],
      gst: [0],
      selectedCheckboxes: this.fb.array([]),

    });
    this.product = _initializeService.initializeProduct()
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.loadCategories();
    this.loadBrands();
    this.loadProduct();
  }

  loadProduct() {
    this._adminProductService.getProductDetails(this.id).subscribe(data => {
      this.product = data;
      this.productForm.patchValue(this.product)

      this._adminCategoryService.getCategoriesByProductId(this.id).subscribe(data => {
        this.selectedCategories = this.product.categories || []
        this.product.categories?.push(data)
      }, error => {
        console.log(error)
      })
      this._adminCategoryService.getSubCategoriesByProductId(this.id).subscribe(data => {
        this.selectedSubCategories = data || []
        this.product.subCategories?.splice(0)
        for (let i = 0; i <data.length; i++) {
          let subCat: SubCategory;
          subCat = {
            id: data[i].id,
            name: data[i].name,
            category: data[i].category
          };
          this.product.subCategories?.push(subCat)
        }
        }, error => {
        console.log(error)
      })

      this.selectedBrands = this.product.brands;
      this.selectedBrandModels = this.product.brandModels
    })
  }

  calculateDiscount(type: string) {
    const price = this.productForm.value.price; // Get the original price

    switch (type) {
      case 'purchase':
        const purchaseDiscount = this.productForm.value.discountOnPurchase;
        this.calculatedPrices.purchase = price - (price * purchaseDiscount / 100);
        this.discountAmounts.purchase = price * purchaseDiscount / 100; // Calculate discount amount
        break;
      case 'counter':
        const counterDiscount = this.productForm.value.discountToCounter;
        this.calculatedPrices.counter = price - (price * counterDiscount / 100);
        this.discountAmounts.counter = price * counterDiscount / 100; // Calculate discount amount
        break;
      case 'mechanics':
        const mechanicsDiscount = this.productForm.value.discountToMechanics;
        this.calculatedPrices.mechanics = price - (price * mechanicsDiscount / 100);
        this.discountAmounts.mechanics = price * mechanicsDiscount / 100; // Calculate discount amount
        break;
      case 'retailer':
        const retailerDiscount = this.productForm.value.discountToRetailer;
        this.calculatedPrices.retailer = price - (price * retailerDiscount / 100);
        this.discountAmounts.retailer = price * retailerDiscount / 100; // Calculate discount amount
        break;
    }
  }


  loadCategories() {
    this._categoryService.getCategories().subscribe(data => {
      this.category = data;
      this.setupCheckboxes();
    });
  }

  loadBrands() {
    this._adminBrandService.getAllBrands().subscribe(data => {
      this.brands = data;
    });
  }

  get selectedCheckboxes(): FormArray {
    return this.productForm.get('selectedCheckboxes') as FormArray;
  }

  setupCheckboxes(): void {
    const checkboxes = this.category.map(() => this.fb.control(false));
    this.productForm.setControl('selectedCheckboxes', this.fb.array(checkboxes));
  }

  onCheckboxChange(event: Event, category: any, subCategory?: any): void {
    const target = event.target as HTMLInputElement;
    const {checked} = target;

    if (!subCategory) {
      this.updateSelection(this.selectedCategories, category, checked);
      this.clearChildSelections(category.id);
    } else {
      this.updateSelection(this.selectedSubCategories, {...subCategory, parentId: category.id}, checked);
    }
  }

  private updateSelection(array: any[], item: any, checked: boolean): void {
    if (checked) {
      array.push(item);
    } else {
      const index = array.findIndex(i => i.id === item.id);
      if (index > -1) {
        array.splice(index, 1);
      }
    }
  }

  private clearChildSelections(categoryId: number): void {
    this.selectedSubCategories = this.selectedSubCategories.filter(sc => sc.id !== categoryId);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  onBrandChange(event: Event, brand: Brand): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedBrands.push(brand);
    } else {
      const index = this.selectedBrands.findIndex(b => b.id === brand.id);
      if (index !== -1) {
        this.selectedBrands.splice(index, 1);
      }
    }
  }

  onModelChange(event: Event, model: BrandModel, brand: Brand): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedBrandModels.push(model);
    } else {
      const index = this.selectedBrandModels.findIndex(m => m.id === model.id);
      if (index !== -1) {
        this.selectedBrandModels.splice(index, 1);
      }
    }
  }

  isBrandSelected(brandId: number | undefined): boolean {
    return this.selectedBrands.some(b => b.id === brandId);
  }

  isModelSelected(modelId: number | undefined, brandId: number | undefined): boolean {
    return this.selectedBrandModels.some(m => m.id === modelId);
  }

  isCategorySelected(id: any) {
    return this.selectedCategories.some(c => c.id === id)
  }

  isSubCategorySelected(id: any) {
    return this.selectedSubCategories.some(sc => sc.id === id)
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = {
        id:this.id,
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        brands: this.selectedBrands.map(b => ({id: b.id})),
        brandModels: this.selectedBrandModels.map(m => ({id: m.id})),
        partNumber: this.productForm.value.partNumber,
        stockQuantity: this.productForm.value.stockQuantity,
        binLocation: this.productForm.value.binLocation,
        discountOnPurchase: this.productForm.value.discountOnPurchase,
        discountToCounter: this.productForm.value.discountToCounter,
        discountToMechanics: this.productForm.value.discountToMechanics,
        discountToRetailer: this.productForm.value.discountToRetailer,
        categories: this.selectedCategories.length > 0 ? this.selectedCategories.map(c => ({id: c.id})) : [],
        subCategories: this.selectedSubCategories.length > 0 ? this.selectedSubCategories.map(sc => ({id: sc.id})) : [],
      };

      console.log(productData);
      this._productService.addProduct(productData).subscribe(data => {
        console.log(data);
        Swal.fire({
          title: 'Success!',
          text: 'Product updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }, error => {
        console.log(error);
        this._snackBar.open("Error while creating product.", "", {duration: 3000});
      });
    } else {
      this._snackBar.open("Please ensure all product information is accurately filled.", "", {duration: 3000})
    }
  }



}
