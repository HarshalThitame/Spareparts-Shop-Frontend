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
import {SavedAddressService} from "../../../service/saved-address.service";
import {EmailData} from "../../../model/EmailData.model";

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
              private _sharedDataService: SharedDataService,
              private _savedAddressService:SavedAddressService) {
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]], // Adjust regex for mobile validation as needed
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['Maharashtra', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // Example for US Zip Code

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
    this._savedAddressService.getAddressesByUserId(this.user.id).subscribe(data => {
      this.savedAddresses = data;
      console.log(this.savedAddresses)
    })
  }


  onSubmitShipping() {
    console.log(this.shippingForm.value)
    if (this.shippingForm.valid) {
      this.shippingForm.value.user = this.user;
      const shippingAddress:ShippingAddress = {
        recipientName: this.shippingForm.value.recipientName,
        addressLine1: this.shippingForm.value.addressLine1,
        addressLine2:this.shippingForm.value.addressLine2,
        email:this.shippingForm.value.email,
        mobile: this.shippingForm.value.mobile,
        city: this.shippingForm.value.city,
        state: this.shippingForm.value.state,
        postalCode: this.shippingForm.value.postalCode,
        user:this.user,
      }
      this._savedAddressService.createSavedAddress(shippingAddress).subscribe(data=>{
        this._snackBar.open("New Address Saved.","",{duration:3000})
        this.ngOnInit()
        this.shippingForm.reset();
      },error => {
        console.log(error)
        this._snackBar.open("Error while saving address.","",{duration:3000})
      })
    }
  }


  selectAddress(address: any) {
    this.selectedAddress = address
    console.log(this.selectedAddress)
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

    this.selectedAddress.id = null;
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
    const emailBody = this.createEmailBody();

    // Call the service to create the order
    this._orderServiceTemp.createOrder(this.order).subscribe((data: any) => {

      console.log(data);
      const emailData:EmailData={
        to:this.order.user.email,
        subject:"Order Placed Successfully",
        body:emailBody
      }
      this._orderServiceTemp.sendEmailOfOrder(emailData).subscribe((data: any) => {

      },(error: any) => {
        console.log(error);
      })

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


  createEmailBody(): string {
    const orderItemsHTML = this.cart.items.map(item => {
      const totalPrice = item.quantity * item.unitPrice;
      const discount = item.product.discountOnPurchase || 0; // Discount percentage

      // Calculate discounted price and total after discount
      const discountAmount = totalPrice * (discount / 100);
      const discountedPrice = totalPrice - discountAmount;

      // Assume a GST percentage (if applicable) or set to 0
      const gst = item.product.gst || 0;
      const gstAmount = discountedPrice * (gst / 100);
      const totalWithGST = discountedPrice + gstAmount; // Total after discount and including GST

      return `
            <tr>
                <td style="border: 1px solid #dddddd; padding: 8px; word-wrap: break-word;">${item.product.name}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">${item.quantity}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: right;">${item.unitPrice.toFixed(2)}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: right;">${totalPrice.toFixed(2)}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: right;">${discountAmount.toFixed(2)}</td>
                <td style="border: 1px solid #dddddd; padding: 8px; text-align: right;">${totalWithGST.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    // Calculate total amounts including GST
    const grandTotal = this.cart.items.reduce((acc, item) => {
      const totalPrice = item.quantity * item.unitPrice;
      const discount = item.product.discountOnPurchase || 0;
      const discountAmount = totalPrice * (discount / 100);
      const discountedPrice = totalPrice - discountAmount;
      const gst = item.product.gst || 0;
      const gstAmount = discountedPrice * (gst / 100);
      return acc + discountedPrice + gstAmount; // Sum discounted prices plus GST
    }, 0);

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    padding: 20px;
                }
                .header {
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                }
                .content {
                    padding: 20px;
                }
                .content h2 {
                    color: #333;
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .total {
                    font-weight: bold;
                    font-size: 18px;
                    color: #007bff;
                }
                .footer {
                    background-color: #f4f4f4;
                    color: #666666;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Order Confirmation</h1>
                </div>
                <div class="content">
                    <h2>Dear ${this.user.firstName} ${this.user.lastName},</h2>
                    <p>Thank you for your order! We are processing it and will notify you once it has been shipped.</p>
                    <h3>Order Details:</h3>
                    <table class="table" style="border-collapse: collapse; width: 100%; max-width: 100%;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #dddddd; padding: 8px;">Product</th>
                                <th style="border: 1px solid #dddddd; padding: 8px; text-align: center;">Quantity</th>
                                <th style="border: 1px solid #dddddd; padding: 8px; text-align: right;">Unit Price</th>
                                <th style="border: 1px solid #dddddd; padding: 8px; text-align: right;">Total Price</th>
                                <th style="border: 1px solid #dddddd; padding: 8px; text-align: right;">Discount Amount</th>
                                <th style="border: 1px solid #dddddd; padding: 8px; text-align: right;">Total After Discount & GST</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItemsHTML}
                            <tr>
                                <td colspan="5" style="text-align: right; border: 1px solid #dddddd; padding: 8px;">Grand Total:</td>
                                <td class="total" style="border: 1px solid #dddddd; padding: 8px;">${grandTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="footer">
                    <p>If you have any questions, feel free to contact us.</p>
                    <p>Thank you for shopping with us!</p>
                </div>
            </div>
        </body>
        </html>
    `;
  }




}
