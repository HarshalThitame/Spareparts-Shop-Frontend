import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../../../service/category.service";
import {ProductService} from "../../../../service/product.service";
import {LoginService} from "../../../../service/login.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AdminBrandService} from "../../../../service/AdminService/admin-brand.service";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {User} from "../../../../model/User.model";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {Category} from "../../../../model/Category.model";
import {Product} from "../../../../model/Product.model";
import {Brand} from "../../../../model/Brand.model";
import {BrandModel} from "../../../../model/BrandModel.model";
import {DiscountService} from "../../../../service/helper/discount.service";
import {CategoryDiscountService} from "../../../../service/helper/Category/category-discount.service";
import {BrandDiscountService} from "../../../../service/helper/Brand/brand-discount.service";
import {
  BrandAndCategoryDiscountService
} from "../../../../service/helper/brand-and-category/brand-and-category-discount.service";
import {BrandAndModelDiscountService} from "../../../../service/helper/Brand-Model/brand-and-model-discount.service";

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrl: './admin-discount.component.css'
})
export class AdminDiscountComponent implements OnInit {
  user: User;
  discountForm: FormGroup | any;
  brandForm!: FormGroup;
  categories: Category[] = [];
  products: Product[] = []
  brands: Brand[] = []
  models: BrandModel[] = []

  constructor(private fb: FormBuilder,
              private _categoryService: CategoryService,
              private _productService: ProductService,
              private _loginService: LoginService,
              private _router: Router,
              private _snackBar: MatSnackBar,
              private _adminBrandService: AdminBrandService,
              private _adminProductService: AdminProductService,
              private _initializerService: InitializerService,
              private _discountService: DiscountService,
              private _categoryDiscountService: CategoryDiscountService,
              private _brandDiscountService: BrandDiscountService,
              private _brandAndCategoryDiscountService: BrandAndCategoryDiscountService,
              private _brandAndModelDiscountService: BrandAndModelDiscountService,
  ) {

    this.discountForm = this.fb.group({
      discountType: ['', Validators.required],
      customerDiscount: ['', [Validators.min(0), Validators.max(100)]],
      retailerDiscount: ['', [Validators.min(0), Validators.max(100)]],
      mechanicDiscount: ['', [Validators.min(0), Validators.max(100)]],
      product: [''],
      category: [''],
      brand: [''],
      model: ['']
    });
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      brandModels: this.fb.array([]) // Initialize with an empty array
    });

    this.user = this._initializerService.initializeUser();
  }

  ngOnInit(): void {

    this.loadUser();

  }

  loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
      this.loadProducts()
      this.loadCategories()
      this.loadBrands();
    })
  }

  loadProducts() {
    this._adminProductService.getAllProductDetails().subscribe(data => {
      this.products = data;


    })
  }

  loadCategories() {
    this._categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadBrands() {
    this._adminBrandService.getAllBrands().subscribe(data => {
      this.brands = data;
    });
  }

  get brandModels(): FormArray {
    return this.brandForm.get('brandModels') as FormArray;
  }


  onBrandChange() {
    const selectedBrandId = this.discountForm.get('brand').value;
    if (selectedBrandId) {
      this.fetchModels(selectedBrandId); // Fetch models for the selected brand
    } else {
      this.models = []; // Clear models if no brand is selected
    }
  }

  private fetchModels(selectedBrandId: any) {
    this._adminBrandService.getBrandModels(selectedBrandId).subscribe(data => {
      this.models = data;
    })
  }

  onSubmit() {
    if (this.discountForm.valid) {
      const discountFormValue = this.discountForm.value;
      console.log(discountFormValue);

      if (discountFormValue.discountType === 'product') {
        if (discountFormValue.product !== '') {
          const {retailerDiscount, mechanicDiscount, customerDiscount, product} = discountFormValue;

          console.log(retailerDiscount)
          // Check all discounts provided
          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._discountService.applyAllDiscounts({
              product,
              retailerDiscount,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("All discounts applied successfully", "", {duration: 3000});
            });

            // Check retailer and mechanic discounts
          } else if (retailerDiscount !== '' && mechanicDiscount !== '') {
            this._discountService.applyRetailerAndMechanicDiscounts({
              product,
              retailerDiscount,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Mechanic discounts applied successfully", "", {duration: 3000});
            });

            // Check retailer and customer discounts
          } else if (retailerDiscount !== '' && customerDiscount !== '') {
            this._discountService.applyRetailerAndCustomerDiscounts({
              product,
              retailerDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Customer discounts applied successfully", "", {duration: 3000});
            });

            // Check mechanic and customer discounts
          } else if (mechanicDiscount !== '' && customerDiscount !== '') {
            this._discountService.applyMechanicAndCustomerDiscounts({
              product,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic and Customer discounts applied successfully", "", {duration: 3000});
            });

            // Check only retailer discount
          } else if (retailerDiscount !== '') {
            this._discountService.applyRetailerDiscount({
              product,
              retailerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer discount applied successfully", "", {duration: 3000});
            });

            // Check only mechanic discount
          } else if (mechanicDiscount !== '') {
            this._discountService.applyMechanicDiscount({
              product,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic discount applied successfully", "", {duration: 3000});
            });

            // Check only customer discount
          } else if (customerDiscount !== '') {
            this._discountService.applyCustomerDiscount({
              product,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Customer discount applied successfully", "", {duration: 3000});
            });

            // If no discounts were provided
          } else {
            this._snackBar.open("No discounts were applied", "", {duration: 3000});
          }
        } else {
          this._snackBar.open("Please select a product", "", {duration: 3000});
        }
      } else if (discountFormValue.discountType === 'category') {
        if (discountFormValue.category !== '') {

          const {retailerDiscount, mechanicDiscount, customerDiscount, category} = discountFormValue;

          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._categoryDiscountService.applyAllDiscounts({
              category,
              retailerDiscount,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("All discounts applied successfully", "", {duration: 3000});
            });
          } else if (retailerDiscount !== '' && mechanicDiscount !== '') {
            this._categoryDiscountService.applyRetailerAndMechanicDiscounts({
              category,
              retailerDiscount,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Mechanic discounts applied successfully", "", {duration: 3000});
            });
          } else if (retailerDiscount !== '' && customerDiscount !== '') {
            this._categoryDiscountService.applyRetailerAndCustomerDiscounts({
              category,
              retailerDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Customer discounts applied successfully", "", {duration: 3000});
            });
          } else if (mechanicDiscount !== '' && customerDiscount !== '') {
            this._categoryDiscountService.applyMechanicAndCustomerDiscounts({
              category,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic and Customer discounts applied successfully", "", {duration: 3000});
            });
          } else if (retailerDiscount !== '') {
            this._categoryDiscountService.applyRetailerDiscount({
              category,
              retailerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer discount applied successfully", "", {duration: 3000});
            });
          } else if (mechanicDiscount !== '') {
            this._categoryDiscountService.applyMechanicDiscount({
              category,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic discount applied successfully", "", {duration: 3000});
            });
          } else if (customerDiscount !== '') {
            this._categoryDiscountService.applyCustomerDiscount({
              category,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Customer discount applied successfully", "", {duration: 3000});
            });
          } else {
            this._snackBar.open("No discounts to apply", "", {duration: 3000});
          }
        } else {
          this._snackBar.open("Please select a category", "", {duration: 3000});
        }
      } else if (discountFormValue.discountType === 'brand') {
        if (discountFormValue.brand !== '') {

          const {retailerDiscount, mechanicDiscount, customerDiscount, brand} = discountFormValue;

          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._brandDiscountService.applyAllDiscounts({
              brand,
              retailerDiscount,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("All discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply retailer and mechanic discounts when customer discount is not applied
          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount === '') {
            this._brandDiscountService.applyRetailerAndMechanicDiscounts({
              brand,
              retailerDiscount,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Mechanic discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply retailer and customer discounts when mechanic discount is not applied
          if (retailerDiscount !== '' && mechanicDiscount === '' && customerDiscount !== '') {
            this._brandDiscountService.applyRetailerAndCustomerDiscounts({
              brand,
              retailerDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Customer discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply mechanic and customer discounts when retailer discount is not applied
          if (retailerDiscount === '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._brandDiscountService.applyMechanicAndCustomerDiscounts({
              brand,
              mechanicDiscount,
              customerDiscount
            }).subscribe((response: any) => {
              console.log(response);
              this._snackBar.open("Mechanic and Customer discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply only retailer discount when mechanic and customer discounts are not applied
          if (retailerDiscount !== '' && mechanicDiscount === '' && customerDiscount === '') {
            this._brandDiscountService.applyRetailerDiscount({
              brand,
              retailerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer discount applied successfully", "", {duration: 3000});
            });
          }

// Apply only mechanic discount when retailer and customer discounts are not applied
          if (retailerDiscount === '' && mechanicDiscount !== '' && customerDiscount === '') {
            this._brandDiscountService.applyMechanicDiscount({
              brand,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic discount applied successfully", "", {duration: 3000});
            });
          }

// Apply only customer discount when retailer and mechanic discounts are not applied
          if (retailerDiscount === '' && mechanicDiscount === '' && customerDiscount !== '') {
            this._brandDiscountService.applyCustomerDiscount({
              brand,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Customer discount applied successfully", "", {duration: 3000});
            });
          }
        } else {
          this._snackBar.open("Please select a brand", "", {duration: 3000});
        }
      } else if (discountFormValue.discountType === 'brand-category') {
        if (discountFormValue.category !== '' && discountFormValue.brand !== '') {
          const {retailerDiscount, mechanicDiscount, customerDiscount, brand, category} = discountFormValue;
          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._brandAndCategoryDiscountService.applyAllDiscounts({
              brand,
              category,
              retailerDiscount,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("All discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply retailer and mechanic discounts when customer discount is not applied
          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount === '') {
            this._brandAndCategoryDiscountService.applyRetailerAndMechanicDiscounts({
              brand,
              category,
              retailerDiscount,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Mechanic discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply retailer and customer discounts when mechanic discount is not applied
          if (retailerDiscount !== '' && mechanicDiscount === '' && customerDiscount !== '') {
            this._brandAndCategoryDiscountService.applyRetailerAndCustomerDiscounts({
              brand,
              category,
              retailerDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Customer discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply mechanic and customer discounts when retailer discount is not applied
          if (retailerDiscount === '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._brandAndCategoryDiscountService.applyMechanicAndCustomerDiscounts({
              brand,
              category,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic and Customer discounts applied successfully", "", {duration: 3000});
            });
          }

// Apply only retailer discount when mechanic and customer discounts are not applied
          if (retailerDiscount !== '' && mechanicDiscount === '' && customerDiscount === '') {
            this._brandAndCategoryDiscountService.applyRetailerDiscount({
              brand,
              category,
              retailerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer discount applied successfully", "", {duration: 3000});
            });
          }

// Apply only mechanic discount when retailer and customer discounts are not applied
          if (retailerDiscount === '' && mechanicDiscount !== '' && customerDiscount === '') {
            this._brandAndCategoryDiscountService.applyMechanicDiscount({
              brand,
              category,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic discount applied successfully", "", {duration: 3000});
            });
          }

// Apply only customer discount when retailer and mechanic discounts are not applied
          if (retailerDiscount === '' && mechanicDiscount === '' && customerDiscount !== '') {
            this._brandAndCategoryDiscountService.applyCustomerDiscount({
              brand,
              category,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Customer discount applied successfully", "", {duration: 3000});
            });
          }

        } else {
          this._snackBar.open("Please select a brand and category", "", {duration: 3000});

        }
      } else if (discountFormValue.discountType === 'brand-model') {
        if (discountFormValue.brand !== '' && discountFormValue.model !== '') {
          const {retailerDiscount, mechanicDiscount, customerDiscount, brand, model} = discountFormValue;
          // Apply all discounts (retailer, mechanic, customer)
          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._brandAndModelDiscountService.applyAllDiscounts({
              brand,
              model,
              retailerDiscount,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("All discounts applied successfully", "", {duration: 3000});
            });
          }

          // Apply retailer and mechanic discounts when customer discount is not applied
          if (retailerDiscount !== '' && mechanicDiscount !== '' && customerDiscount === '') {
            this._brandAndModelDiscountService.applyRetailerAndMechanicDiscounts({
              brand,
              model,
              retailerDiscount,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Mechanic discounts applied successfully", "", {duration: 3000});
            });
          }

          // Apply retailer and customer discounts when mechanic discount is not applied
          if (retailerDiscount !== '' && mechanicDiscount === '' && customerDiscount !== '') {
            this._brandAndModelDiscountService.applyRetailerAndCustomerDiscounts({
              brand,
              model,
              retailerDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer and Customer discounts applied successfully", "", {duration: 3000});
            });
          }

          // Apply mechanic and customer discounts when retailer discount is not applied
          if (retailerDiscount === '' && mechanicDiscount !== '' && customerDiscount !== '') {
            this._brandAndModelDiscountService.applyMechanicAndCustomerDiscounts({
              brand,
              model,
              mechanicDiscount,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic and Customer discounts applied successfully", "", {duration: 3000});
            });
          }

          // Apply only retailer discount
          if (retailerDiscount !== '' && mechanicDiscount === '' && customerDiscount === '') {
            this._brandAndModelDiscountService.applyRetailerDiscount({
              brand,
              model,
              retailerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Retailer discount applied successfully", "", {duration: 3000});
            });
          }

          // Apply only mechanic discount
          if (retailerDiscount === '' && mechanicDiscount !== '' && customerDiscount === '') {
            this._brandAndModelDiscountService.applyMechanicDiscount({
              brand,
              model,
              mechanicDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Mechanic discount applied successfully", "", {duration: 3000});
            });
          }

          // Apply only customer discount
          if (retailerDiscount === '' && mechanicDiscount === '' && customerDiscount !== '') {
            this._brandAndModelDiscountService.applyCustomerDiscount({
              brand,
              model,
              customerDiscount
            }).subscribe(response => {
              console.log(response);
              this._snackBar.open("Customer discount applied successfully", "", {duration: 3000});
            });
          }
        } else {
          this._snackBar.open("Please select a brand and model", "", {duration: 3000});
        }
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      this._snackBar.open("Form is invalid, please check the inputs", "", {duration: 3000});
    }
  }
}
