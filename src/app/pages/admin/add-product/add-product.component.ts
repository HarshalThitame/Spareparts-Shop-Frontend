import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from "../../../service/category.service";
import { ProductService } from "../../../service/product.service";
import { LoginService } from "../../../service/login.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../../../model/User.model";
import { Category } from "../../../model/Category.model";
import { Brand } from "../../../model/Brand.model";
import { AdminBrandService } from "../../../service/AdminService/admin-brand.service";
import { BrandModel } from "../../../model/BrandModel.model";
import {SubCategory} from "../../../model/SubCategory.model";
import {HttpBackend, HttpClient, HttpEventType, HttpHeaders} from "@angular/common/http";
import {AdminProductService} from "../../../service/AdminService/admin-product.service";
import baseURL from "../../../service/helper/helper";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;
  user: User | undefined;
  selectedCategories: Category[] = [];
  selectedSubCategories:SubCategory[]=[];
  selectedBrands: Brand[] = [];
  selectedBrandModels: BrandModel[] = [];
  category: any;
  brands: Brand[] = [];
  selectedProductsFile: File | null = null;
  message: string = "";
  uploadProgress: number = 0;
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
  private httpWithoutInterceptor: HttpClient;
  private uploadedImageUrl: any;

  constructor(
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _loginService: LoginService,
    private _router: Router,
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
    private _adminBrandService: AdminBrandService,
    private httpBackend: HttpBackend,
    private _adminProductService:AdminProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      partNumber: ['', Validators.required],
      stockQuantity: [0, Validators.required],
      binLocation: ['', Validators.required],
      discountOnPurchase: [0, Validators.required],
      discountToCounter: [0],
      discountToMechanics: [0, Validators.required],
      discountToRetailer: [0, Validators.required],
      mainImage:[],
      gst:[0],
      selectedCheckboxes: this.fb.array([]),

    });
    this.httpWithoutInterceptor = new HttpClient(httpBackend);

  }

  ngOnInit(): void {
    console.log(Date.now())
    console.log((Date.now()+(Date.length*Date.length))*2)
    this.loadCategories();
    this.loadBrands();
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
    const { checked } = target;

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

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Get the selected file

    if (file) {
      // Check if the file size exceeds 5 MB
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (file.size > maxSizeInBytes) {
        alert(`File size should be less than ${maxSizeInMB} MB.`);
        this.selectedFile = null; // Reset the selected file
      } else {
        this.selectedFile = file; // File is valid
        this.uploadMainImage();
      }
    }
  }
  uploadMainImage() {
    this.uploadImage('Main-Image')
  }
  uploadImage(folderName: string) {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    // Step 1: Get the pre-signed URL from Spring Boot
    this._http.get<any>(`${baseURL}/auth/presigned-url/${folderName}`).subscribe(response => {
      const uploadUrl = response.url;
      const objectKey = response.key;  // Assuming backend returns the S3 key

      // Define the Content-Type
      const contentType = this.selectedFile?.type || 'application/octet-stream';

      // Step 2: Upload the image to S3 using the pre-signed URL
      this.httpWithoutInterceptor.put(uploadUrl, this.selectedFile, {
        headers: {
          'Content-Type': contentType
        },
        reportProgress: true,
        observe: 'events'
      }).subscribe(
        event => {
          if (event.type === 4) { // HttpEventType.Response
            console.log('Image successfully uploaded');



            // Step 3: Construct the image URL (replace with your actual bucket's URL)
            const bucketBaseUrl = 'https://harshal-ecom.s3.amazonaws.com/';
            this.uploadedImageUrl = `${bucketBaseUrl}${objectKey}`;
            console.log('Uploaded Image URL:', this.uploadedImageUrl);

            if (folderName === 'Main-Image') {
              console.log("inside MAin -image")

              this.productForm.value.mainImage = this.uploadedImageUrl;
            }

            this.selectedFile = null;
          }
        },
        error => {
          console.error('Error uploading image:', error);
        }
      );
    });
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

  onSubmit() {
    if (this.productForm.valid) {
      try {
        // Await the image upload to finish

        const productData = {
          id: (Date.now() + (Date.length * Date.length)) * 2,
          name: this.productForm.value.name,
          description: this.productForm.value.description,
          price: this.productForm.value.price,
          brands: this.selectedBrands.map(b => ({ id: b.id })),
          brandModels: this.selectedBrandModels.map(m => ({ id: m.id })),
          partNumber: this.productForm.value.partNumber,
          stockQuantity: this.productForm.value.stockQuantity,
          binLocation: this.productForm.value.binLocation,
          discountOnPurchase: this.productForm.value.discountOnPurchase,
          discountToCounter: this.productForm.value.discountToCounter,
          discountToMechanics: this.productForm.value.discountToMechanics,
          discountToRetailer: this.productForm.value.discountToRetailer,
          mainImage: this.productForm.value.mainImage,
          gst: this.productForm.value.gst,
          categories: this.selectedCategories.length > 0 ? this.selectedCategories.map(c => ({ id: c.id })) : [],
          subCategories: this.selectedSubCategories.length > 0 ? this.selectedSubCategories.map(sc => ({ id: sc.id })) : [],
        };

        console.log(productData);

        // Add product to the server
        const data = this._productService.addProduct(productData).toPromise();
        console.log(data);
        Swal.fire({
          title: 'Product Created!',
          text: 'Product successfully created.',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000
        });      } catch (error) {
        console.log(error);
        this._snackBar.open("Error while creating product.", "", { duration: 3000 });
      }
    } else {
      this._snackBar.open("Please ensure all product information is accurately filled.", "", { duration: 3000 });
    }
  }



  onProductFileChange(event: any): void {
    this.selectedProductsFile = event.target.files[0];
  }


  uploadFile(): void {
    console.log(this.selectedProductsFile)
    if (this.selectedProductsFile) {
      this._adminProductService.uploadProductsFile(this.selectedProductsFile).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Update upload progress
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            // File upload completed successfully
            this.message = 'File uploaded successfully!';
            this.uploadProgress = 0;
          }
        },
          (error: any) => {
          // Handle error during file upload
          console.error('File upload failed:', error);
          this.message = 'File upload failed!';
          this.uploadProgress = 0;
        }
      );
    } else {
      this.message = 'Please select a file first!';
    }
  }
}
