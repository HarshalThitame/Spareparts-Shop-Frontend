import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../service/product.service";
import {CategoryService} from "../../../service/category.service";
import {Cart} from "../../../model/Cart.model";
import {CustomerCartService} from "../../../service/customerService/customer-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from 'sweetalert2';
import {SharedDataService} from "../../../service/SharedData/shared-data.service";
import {User} from "../../../model/User.model";
import {Product} from "../../../model/Product.model";
import {InitializerService} from "../../../model/InitializerService/initializer.service";

@Component({
  selector: 'app-customer-product-details',
  templateUrl: './customer-product-details.component.html',
  styleUrl: './customer-product-details.component.css'
})
export class CustomerProductDetailsComponent implements OnInit {
  user: User;
  id: string | null ='';
  product: Product;
  isLoggedIn = false;
  cart: Cart;
  quantity = 1;
  selectedImageUrl: any;


  stock = 0;

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _categoryService: CategoryService,
              private _route: ActivatedRoute,
              private _customerCartService: CustomerCartService,
              private _snackBar: MatSnackBar,
              private _sharedDataService: SharedDataService,
              private _initializeService:InitializerService) {

    this.product = _initializeService.initializeProduct();
    this.user = this._initializeService.initializeUser();
    this.cart = _initializeService.initializeCart();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.id = this._route.snapshot.paramMap.get('id');
    this.loadUser();
    this.loadProduct(this.id)

  }

  private loadUser() {
    this.isLoggedIn = this._loginService.isLoggedIn();
    if(this.isLoggedIn)
    {
      this._loginService.getCurrentUser().subscribe(data => {
        this.user = data;
        if(this.user.userRole ==="RETAILER"){
          this._router.navigate(['/retailer/category/sub-category/sub-sub-category/product-details/',this.id])
        }else if(this.user.userRole ==="MECHANIC"){
          this._router.navigate(['/mechanic/category/sub-category/sub-sub-category/product-details/',this.id])
        }
        this.isLoggedIn =true
      });
    }
  }

  loadProduct(id: any) {
    this._productService.getProductByIdByGeneral(id).subscribe(data => {
      this.product = data;
      this.selectedImageUrl = this.product.mainImage
      this.quantity = this.product.moq
      this.stock = this.product.stockQuantity;
      console.log(this.product)
    })
  }


  // Increase Quantity
  increaseQuantity(): void {
    if (this.quantity >= this.stock) {
      this.quantity = this.stock
      this._snackBar.open("Insufficient stock!",'',{duration:3000})
    } else {
      this.quantity++;
    }
  }

  // Decrease Quantity
  decreaseQuantity(): void {
    if (this.quantity > 1 && this.quantity > this.product.moq) {
      this.quantity--;
    }
  }

  addToCart(product: any) {
    if (!this.isLoggedIn) {
      // If the user is not logged in, add the product to local storage
      const storedCart = localStorage.getItem('temporaryCart');
      let tempCart: Cart = { user: { id: 0 }, items: [], totalAmount: 0 };

      if (storedCart) {
        tempCart = JSON.parse(storedCart);
      }

      // Check if the product already exists in the temporary cart
      const existingItemIndex = tempCart.items.findIndex(item => item.product.id === product.id);

      if (existingItemIndex !== -1) {
        // If the product exists, increase its quantity and update totalPrice
        tempCart.items[existingItemIndex].quantity += this.quantity;
        tempCart.items[existingItemIndex].totalPrice =
          tempCart.items[existingItemIndex].product.price * tempCart.items[existingItemIndex].quantity;
      } else {
        // If the product does not exist, add it with totalPrice
        const totalPrice = product.price * this.quantity; // Calculate totalPrice
        tempCart.items.push({unitPrice: product.price, product: product, quantity: this.quantity, totalPrice: totalPrice });
      }

      // Update total amount
      this.updateTemporaryCartTotal(tempCart);

      // Save the updated cart to local storage
      localStorage.setItem('temporaryCart', JSON.stringify(tempCart));

      Swal.fire({
        title: 'Success!',
        text: 'The product has been successfully added to your temporary cart.',
        icon: 'success',
        timer: 4000, // 4 seconds
        showConfirmButton: false,
        footer: '<a href="/cart" class="swal2-footer-link btn btn-success border-0">Go to Cart</a>',
      });
    } else {
      // User is logged in, add product to the main cart
      const result = this._sharedDataService.checkLoginAndAddToCart(this.user, product, this.quantity);

      if (result) {
        console.log("Product successfully added to the cart.");

        Swal.fire({
          title: 'Success!',
          text: 'The product has been successfully added to your cart. You can proceed to checkout or continue shopping to explore more items.',
          icon: 'success',
          timer: 4000, // 4 seconds
          showConfirmButton: false,
          footer: '<a href="/customer/cart" class="swal2-footer-link btn btn-success border-0">Go to Cart</a>',
        });
      }
    }
  }

  private updateTemporaryCartTotal(cart: Cart): void {
    cart.totalAmount = cart.items.reduce((total, item) =>
      total + (item.product.price * item.quantity), 0);
  }


  calculateDiscountedPrice(mrp: number, discount: number): number {
    return mrp - (mrp * discount / 100);
  }

  onImageHover(url: any) {
    this.selectedImageUrl = url
  }

  isOutOfStock(product: Product) {
    return product.stockQuantity==0;
  }
}
