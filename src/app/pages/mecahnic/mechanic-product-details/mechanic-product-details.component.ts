import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User.model";
import {Product} from "../../../model/Product.model";
import {Cart} from "../../../model/Cart.model";
import {LoginService} from "../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../service/product.service";
import {CategoryService} from "../../../service/category.service";
import {CustomerCartService} from "../../../service/customerService/customer-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import Swal from 'sweetalert2';
import {MechanicCartService} from "../../../service/mecahnicService/mechanic-cart.service";
import {SharedDataService} from "../../../service/SharedData/shared-data.service";

@Component({
  selector: 'app-mechanic-product-details',
  templateUrl: './mechanic-product-details.component.html',
  styleUrl: './mechanic-product-details.component.css'
})
export class MechanicProductDetailsComponent implements OnInit{

  user: User;
  id:any;
  product: Product;
  isLoggedIn = false;
  cart:Cart;
  quantity = 1;
  selectedImageUrl: any;


  stock = 10;


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _categoryService:CategoryService,
              private _route:ActivatedRoute,
              private _mechanicCartService:MechanicCartService,
              private _snackBar:MatSnackBar,
              private _initializerService:InitializerService,
              private _sharedDataService:SharedDataService) {
    this.user = this._initializerService.initializeUser();
    this.product= this._initializerService.initializeProduct();
    this.cart = this._initializerService.initializeCart()
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');

    this.loadUser();
    this.loadProduct(this.id)

  }

  private loadUser() {
    this.isLoggedIn = this._loginService.isLoggedIn();
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    });
  }

  loadProduct(id: any) {
    this._productService.getProductByIdByGeneral(id).subscribe(data=>{
      this.product = data;
      this.selectedImageUrl = this.product.mainImage
      console.log(this.product)
    })
  }


  // Increase Quantity
  increaseQuantity(): void {
    if(this.quantity >= this.stock){
      this.quantity = this.stock
    }
    else {
      this.quantity++;
    }
  }

  // Decrease Quantity
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: any) {
    const result = this._sharedDataService.checkLoginAndAddToCart(this.user, product, this.quantity);

    if (result) {
      console.log("Product successfully added to the cart.");

      Swal.fire({
        title: 'Success!',
        text: 'The product has been successfully added to your cart. You can proceed to checkout or continue shopping to explore more items.',
        icon: 'success',
        timer: 4000, // 2 seconds
        showConfirmButton: false,
        footer: '<a href="/mechanic/cart" class="swal2-footer-link btn btn-success border-0">Go to Cart</a>',
        willClose: () => {
          // Optional: do something when alert closes
        }
      })
    }
  }
  calculateDiscountedPrice(mrp: number, discount: number): number {
    return mrp - (mrp * discount / 100);
  }

  onImageHover(url: string) {
    this.selectedImageUrl = url;
  }
}
