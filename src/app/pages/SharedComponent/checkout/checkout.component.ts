import {Component, NgIterable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ShippingAddress} from "../../../model/ShippingAddress.model";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../model/User.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {CustomerCartService} from "../../../service/customerService/customer-cart.service";
import {RetailerCartService} from "../../../service/retailerService/retailer-cart.service";
import {MechanicCartService} from "../../../service/mecahnicService/mechanic-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SharedDataService} from "../../../service/SharedData/shared-data.service";
import {CustomerShippingAddressService} from "../../../service/customerService/customer-shipping-address.service";
import {RetailerShippingAddressService} from "../../../service/retailerService/retailer-shipping-address.service";
import {MechanicShippingAddressService} from "../../../service/mecahnicService/mechanic-shipping-address.service";
import {Cart} from "../../../model/Cart.model";
import {Order} from "../../../model/Order.model";
import {OrderItem} from "../../../model/OrderItem.model";
import {CustomerOrderService} from "../../../service/customerService/customer-order.service";
import {RetailerOrderService} from "../../../service/retailerService/retailer-order.service";
import {MechanicOrderService} from "../../../service/mecahnicService/mechanic-order.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  shippingForm: FormGroup | any;
  savedAddresses: ShippingAddress[] = []; // Array to hold saved addresses
  selectedAddress: any;
  shippingAddress: ShippingAddress;
  private isLoggedIn = false;
  user: User;
  cart: Cart;
  order: Order;
  orderItems: OrderItem;
  cartServiceTemp: any = null;
  _orderServiceTemp: any = null;
  isVor = false



  constructor(private fb: FormBuilder, private http: HttpClient,
              private _loginService: LoginService,
              private _router: Router,
              private _customerCartService: CustomerCartService,
              private _retailerCartService: RetailerCartService,
              private _customerShippingAddressService: CustomerShippingAddressService,
              private _retailerShippingAddressService: RetailerShippingAddressService,
              private _mechanicShippingAddressService: MechanicShippingAddressService,
              private _customerOrderService: CustomerOrderService,
              private _retailerOrderService: RetailerOrderService,
              private _mechanicOrderService: MechanicOrderService,
              private _mechanicCartService: MechanicCartService,
              private _snackBar: MatSnackBar,
              private _initializerService: InitializerService,
              private _sharedDataService: SharedDataService) {
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Adjust regex for mobile validation as needed
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // Example for US Zip Code
      country: ['', Validators.required],
    });
    this.shippingAddress = _initializerService.initializeShippingAddress()
    this.user = _initializerService.initializeUser();
    this.cart = _initializerService.initializeCart()
    this.order = _initializerService.initializeOrder();
    this.orderItems = this._initializerService.initializeOrderItems()


  }

  ngOnInit() {
    this.loadUser();


  }

  private loadUser(): void {
    this.isLoggedIn = this._loginService.isLoggedIn();
    this._loginService.getCurrentUser().subscribe(
      (data: User) => {
        this.user = data;
        if (this.user.userRole === "CUSTOMER") {
          this.cartServiceTemp = this._customerCartService;
          this._orderServiceTemp = this._customerOrderService
        } else if (this.user.userRole === "RETAILER") {
          this.cartServiceTemp = this._retailerCartService
          this._orderServiceTemp = this._retailerOrderService
        } else if (this.user.userRole === "MECHANIC") {
          this.cartServiceTemp = this._mechanicCartService
          this._orderServiceTemp = this._mechanicOrderService;
        }

        this.isLoggedIn = true;
        this.getSavedAddresses();
        this.getCartByUser();
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }

  getCartByUser() {
    this.cartServiceTemp.getCartByUser(this.user.id).subscribe((data: Cart) => {
      this.cart = data;
      console.log(this.cart)
    })
  }

  getSavedAddresses() {
    this._customerShippingAddressService.getAddressByUser(this.user.id).subscribe(data => {
      this.savedAddresses = data;
      console.log(this.savedAddresses)
    })
  }


  onSubmitShipping() {
    if (this.shippingForm.valid) {
      this.shippingForm.value.user = this.user;
      console.log('Shipping Information:', this.shippingForm.value);
      if (this.user.userRole === "CUSTOMER") {
        this._customerShippingAddressService.saveCustomerAddress(this.shippingForm.value).subscribe(data => {
          console.log(data)
          this._snackBar.open("Address saved successfully...")
        }, error => {
          console.log(error)
          this._snackBar.open("Error while saving address")

        })
      }
    } else {
      console.log("Invalid")
    }
  }


  selectAddress(address: any) {
    this.selectedAddress = address
  }

  calculateDiscountedPrice(mrp: number, discount: number): number {
    return mrp - (mrp * discount / 100);
  }
  onVorChange(event: any) {
    this.isVor = event.target.checked; // Update isVor based on checkbox state
  }

  placeOrder() {
    const OI: OrderItem[] = []; // Create an array to hold OrderItem objects
    let TD = 0;

    // Iterate through the items in the cart
    for (let i = 0; i < this.cart.items.length; i++) {
      // Create a new OrderItem for each item in the cart
      const orderItem: OrderItem = {
        discountAmount: 0, subtotal: 0, taxAmount: 0, totalPrice: 0,
        id: Date.now(),
        product: this.cart.items[i].product,
        quantity: this.cart.items[i].quantity,
        price: this.cart.items[i].unitPrice,
        gst: this.cart.items[i].product.gst,
        discountOnPurchase: this.cart.items[i].product.discountOnPurchase,
        discountToMechanics: this.cart.items[i].product.discountToMechanics,
        discountToRetailer: this.cart.items[i].product.discountToRetailer
      };

      OI.push(orderItem); // Add the OrderItem to the array
    }

    // Prepare the order object
    this.order.id = Date.now() + Date.now();
    this.order.orderItems = OI; // Assign the OrderItem array to the order
    this.order.user = this.user; // Assign the user
    this.order.discountAmount = TD; // Set total discount
    this.order.shippingAddress = this.selectedAddress; // Set shipping address
    this.order.shippingCost = 0; // Assuming no shipping cost; update as necessary
    this.order.totalAmount = this.cart.totalAmount; // Set total amount
    this.order.isVor = this.isVor;

    console.log(this.order); // Log the order for debugging

    // Call the service to create the order
    this._orderServiceTemp.createOrder(this.order).subscribe((data: any) => {
      console.log(data);
      this._router.navigate(['/'])
      Swal.fire({
        title: 'Order Successfully Placed!',
        text: 'Your order has been placed. You can view your order details.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'My Order',
        cancelButtonText: 'Continue Shopping'
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to the My Orders page if the "My Order" button is clicked
          if(this.user.userRole==="CUSTOMER"){
            this._router.navigateByUrl(this._router.url+'/customer/my-order');
          }else
          this._router.navigateByUrl(this._router.url+'/my-order');
        }
      });
      this.cartServiceTemp.deleteCart(this.user.id).subscribe(() => {
      }, (error: any) => {
        console.log(error)
      })
    }, (error: any) => {
      console.log(error);
      this._snackBar.open("Error while placing order", "", {duration: 3000});
    });
  }

}
