import {Component, OnInit} from '@angular/core';
import {User} from "../../../model/User.model";
import {Cart} from "../../../model/Cart.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {CustomerCartService} from "../../../service/customerService/customer-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {CartItem} from "../../../model/CartItem.model";
import {SharedDataService} from "../../../service/SharedData/shared-data.service";
import {RetailerCartService} from "../../../service/retailerService/retailer-cart.service";
import {MechanicCartService} from "../../../service/mecahnicService/mechanic-cart.service";
import {Product} from "../../../model/Product.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  user: User;
  isLoggedIn = false;
  cart: Cart = {user: {id: 0}, items: [], totalAmount: 0};
  isCheckoutOpen = false;
  private cartServiceTemp: any;
  stock = 1;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _customerCartService: CustomerCartService,
    private _retailerCartService: RetailerCartService,
    private _mechanicCartService: MechanicCartService,
    private _snackBar: MatSnackBar,
    private _initializerService: InitializerService,
    private _sharedDataService: SharedDataService
  ) {
    this.user = _initializerService.initializeUser();
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.isLoggedIn = this._loginService.isLoggedIn();
    if (this.isLoggedIn) {
      this._loginService.getCurrentUser().subscribe(
        (data: User) => {
          this.user = data;
          // Fetch the cart from the backend based on user role
          switch (this.user.userRole) {
            case "CUSTOMER":
              this.cartServiceTemp = this._customerCartService;
              break;
            case "MECHANIC":
              this.cartServiceTemp = this._mechanicCartService;
              break;
            case "RETAILER":
              this.cartServiceTemp = this._retailerCartService;
              break;
            default:
              return;
          }
          this.handleCart(); // Handle the cart process
        },
        error => {
          console.error('Error fetching user:', error);
          this.logoutAndRedirect();
        }
      );
    } else {
      this.loadCartFromLocalStorage(); // Load from local storage if not logged in
    }
  }

  private handleCart(): void {
    const storedCart = localStorage.getItem('temporaryCart');
    if (storedCart) {
      // If there's a temporary cart, save it to the backend first
      const tempCart: Cart = JSON.parse(storedCart);
      this.saveTempCartToBackend(tempCart);
    } else {
      // If no temporary cart, just load the backend cart
      this.loadCartFromBackend();
    }
  }

  private saveTempCartToBackend(tempCart: Cart): void {


    // Save or update the temporary cart to the backend
    tempCart.user = this.user;
    this.cartServiceTemp.addOrUpdateToCart(tempCart).subscribe(
      (response: any) => {
        // Clear the local storage after successfully saving
        localStorage.removeItem('temporaryCart');
        this._snackBar.open('Cart saved successfully!', 'Close', {duration: 3000});

        // Load the updated cart from the backend
        this.loadCartFromBackend();
      },
      (error: any) => {
        console.error('Error saving temporary cart to backend:', error);
        this._snackBar.open('Error saving cart', 'Close', {duration: 3000});
        this.loadCartFromBackend(); // Even if saving fails, load the backend cart
      }
    );
  }

  private loadCartFromBackend(): void {
    if (this.user.id) { // Ensure user ID is set before fetching the cart


      this.cartServiceTemp.getCartByUser(this.user.id).subscribe(
        (data: Cart) => {
          this.cart = data;
          this.updateCartTotal(); // Update the cart total after loading
        },
        (error: any) => {
          console.error('Error fetching cart from backend:', error);
          this._snackBar.open('Error loading cart', 'Close', {duration: 3000});
        }
      );
    }
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('temporaryCart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.updateCartTotal(); // Update the total after loading
    }
  }

  protected increaseQuantity(item: CartItem): void {
    if (item.quantity >= item.product.stockQuantity) {
      item.quantity = item.product.stockQuantity;
      this._snackBar.open("Insufficient stock!", '', {duration: 3000})
    } else {
      item.quantity++;
      this.updateCart(item);
    }
  }

  checkQuantity(item:CartItem){
    if (item.quantity > item.product.stockQuantity) {
      item.quantity = item.product.stockQuantity;
      this._snackBar.open("Insufficient stock!", '', {duration: 3000})
    }
  }

  protected decreaseQuantity(item: CartItem): void {
    if (item.quantity <= item.product.moq) {
      this._snackBar.open(`Minimum order quantity is ${item.product.moq}`, '', {duration: 3000});
      return
    }
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart(item);
    }
  }

  protected removeItem(item: CartItem): void {
    this.cart.items = this.cart.items.filter(i => i !== item);
    this.updateCartTotal();
    this.updateCart(item); // Update the cart in local storage or backend
    if (this.isLoggedIn) {
      this.cartServiceTemp.removeItem(this.user.id, item.product.id).subscribe(() => {
          this._snackBar.open("Product from cart has been removed.", "", {duration: 3000})
        },
        (error: any) => {
          console.log(error)
          this._snackBar.open("Error while removing...!", "", {duration: 3000})
        })
    }

  }

  private updateCartTotal(): void {
    this.cart.totalAmount = this.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  private updateCart(item: CartItem): void {
    localStorage.setItem('temporaryCart', JSON.stringify(this.cart)); // Update local storage
  }

  private logoutAndRedirect(): void {
    this._loginService.logout();
    this._router.navigate(['/']);
  }

  getTotalItems(): number {
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalSavings(): number {
    return this.cart.items.reduce((totalSavings, item) => {
      const originalPrice = item.product.price * item.quantity;
      const discountedPrice = this.getDiscountedPrice(item.product) * item.quantity;
      return totalSavings + (originalPrice - discountedPrice);
    }, 0);
  }

  getTotalPriceAfterDiscounts(): number {
    return this.cart.items.reduce((total, item) => {
      return total + (this.getDiscountedPrice(item.product) * item.quantity);
    }, 0);
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
        return 0;
    }
  }

  protected readonly Number = Number;

  openCheckOut() {
    this.ngOnInit();
    if (this.user.userRole === "CUSTOMER") {
      this._router.navigate(['/customer/checkout'])
    } else if (this.user.userRole === "RETAILER") {
      this._router.navigate(['/retailer/checkout'])
    } else if (this.user.userRole === "MECHANIC") {
      this._router.navigate(['/mechanic/checkout'])
    }
  }

  calculateGst(product: Product, qty: number): number {
    // Ensure product.gst has a default value if undefined
    const gstRate = product.gst || 0; // Use 0 if product.gst is undefined
    // Calculate the discounted price first
    const discountedPrice = this.getDiscountedPrice(product);
    // Calculate the GST amount for the specified quantity
    const gstAmountPerItem = discountedPrice * (gstRate / 100);
    // Total GST for the specified quantity
    return gstAmountPerItem * qty; // Return the total GST
  }


  getGst() {
    return this.cart.items.reduce((sum, item) => sum + (this.calculateGst(item.product, item.quantity) || 0), 0);
  }

  getTotal() {
    return this.getTotalPriceAfterDiscounts() + this.getGst();
  }

  getTotalAmount() {
    return this.cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity || 0), 0);
  }
}
