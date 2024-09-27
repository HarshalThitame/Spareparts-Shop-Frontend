import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {OfferService} from "../../../../service/AdminService/offer.service";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {User} from "../../../../model/User.model";
import {Product} from "../../../../model/Product.model";
import {Offer} from "../../../../model/Offer.model";
import {MatOptionSelectionChange} from "@angular/material/core";

@Component({
  selector: 'app-admin-offers',
  templateUrl: './admin-offers.component.html',
  styleUrl: './admin-offers.component.css'
})
export class AdminOffersComponent implements OnInit {
user:User;
products:Product[]=[]
offerForm: FormGroup|any;  // Form group for managing the offer form
  selectedProducts:Product[] = [];
  searchControl: FormControl;
  filteredProducts: Product[] = [];
  productsForm = new FormControl([]);
  activatedOffers: Offer[] = [];


  constructor(private _fb: FormBuilder,
              private _offerService: OfferService,
              private _adminProductService:AdminProductService,
              private _initializerService:InitializerService) {
    this.user = _initializerService.initializeUser()

    this.searchControl = new FormControl(''); // Create a FormControl for search input
    this.offerForm = this._fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      discount: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      imageUrl: ['', Validators.required],
      products: [[], this.atLeastOneProductSelected()]

    });

    this.searchControl = new FormControl(''); // Create a FormControl for search input

  }

  filtered(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchValue)
    );
  }
  atLeastOneProductSelected(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = control.value && control.value.length > 0;
      return valid ? null : { atLeastOneRequired: true };
    };
  }


  ngOnInit(): void {
    this.loadProducts();
    this.loadActivatedOffer()

    // Listen for search input changes and filter products
    this.searchControl.valueChanges.subscribe((searchQuery) => {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  loadActivatedOffer() {
        this._offerService.getActiveOffers().subscribe(data=>{
          this.activatedOffers = data;
          console.log(this.activatedOffers)
        })
    }



  private loadProducts() {
    this._adminProductService.getAllProductDetails().subscribe(data => {
      this.products = data;
      this.filteredProducts = this.products;
    })
  }

  onChangeProduct(event: any): void {
    const product = event.source.value;
    const productsControl = this.offerForm.get('products');

    if (event.isUserInput) {
      if (event.source.selected) {
        this.selectedProducts.push(product);
      } else {
        const index = this.selectedProducts.indexOf(product);
        if (index >= 0) {
          this.selectedProducts.splice(index, 1);
        }
      }
      productsControl.setValue(this.selectedProducts);
    }
  }
  /**
   * Submits the offer to the backend via the offer service.
   */
  onSubmit(): void {
    if (this.offerForm.valid && this.selectedProducts != null) {

      const offer:Offer = {
        title: this.offerForm.value.title,
        description: this.offerForm.value.description,
        discount: this.offerForm.value.discount,
        startDate: this.offerForm.value.startDate,
        endDate: this.offerForm.value.endDate,
        imageUrl: this.offerForm.value.imageUrl,
        products: this.selectedProducts
      }
      console.log(offer)

      this._offerService.createOffer(offer).subscribe({
        next: (response) => {
          console.log('Offer created successfully!', response);
          console.log(response)
        },
        error: (error) => {
          console.error('Error creating offer', error);
        }
      });
    }
  }


}
