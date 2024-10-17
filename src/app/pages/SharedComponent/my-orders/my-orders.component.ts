import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/User.model';
import {SharedDataService} from '../../../service/SharedData/shared-data.service';
import {InitializerService} from '../../../model/InitializerService/initializer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder} from '@angular/forms';
import {LoginService} from '../../../service/login.service';
import {Router} from '@angular/router';
import {CustomerCartService} from '../../../service/customerService/customer-cart.service';
import {HttpClient} from '@angular/common/http';
import {RetailerCartService} from '../../../service/retailerService/retailer-cart.service';
import {CustomerShippingAddressService} from '../../../service/customerService/customer-shipping-address.service';
import {RetailerShippingAddressService} from '../../../service/retailerService/retailer-shipping-address.service';
import {MechanicShippingAddressService} from '../../../service/mecahnicService/mechanic-shipping-address.service';
import {CustomerOrderService} from '../../../service/customerService/customer-order.service';
import {MechanicOrderService} from '../../../service/mecahnicService/mechanic-order.service';
import {MechanicCartService} from '../../../service/mecahnicService/mechanic-cart.service';
import {RetailerOrderService} from '../../../service/retailerService/retailer-order.service';
import {Order} from '../../../model/Order.model';
import NoImage from '../../../service/helper/noImage';
import {Cart} from "../../../model/Cart.model";
import {CartItem} from "../../../model/CartItem.model";
import Swal from "sweetalert2";
import {OrderStatus} from "../../../model/OrderStatus.model";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  user: User;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isSearchActive: boolean = false;
  searchTerm: string = '';
  private cartServiceTemp: any;
  private _orderServiceTemp: any;
  private isLoggedIn: boolean = false;
  cart:Cart;
  cartItems:CartItem[]=[]

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
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
    private _sharedDataService: SharedDataService
  ) {
    this.user = _initializerService.initializeUser();
    this.cart = _initializerService.initializeCart();
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.isLoggedIn = this._loginService.isLoggedIn();
    if (this.isLoggedIn){
      this._loginService.getCurrentUser().subscribe(
        (data: User) => {
          this.user = data;
          this.setServicesBasedOnUserRole();
          this.getAllOrders();
          this.isLoggedIn = true;
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }else{
      this._router.navigate(['/'])
    }
  }

  private setServicesBasedOnUserRole() {
    if (this.user.userRole === 'CUSTOMER') {
      this.cartServiceTemp = this._customerCartService;
      this._orderServiceTemp = this._customerOrderService;
    } else if (this.user.userRole === 'RETAILER') {
      this.cartServiceTemp = this._retailerCartService;
      this._orderServiceTemp = this._retailerOrderService;
    } else if (this.user.userRole === 'MECHANIC') {
      this.cartServiceTemp = this._mechanicCartService;
      this._orderServiceTemp = this._mechanicOrderService;
    }
  }



  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    if (!this.isSearchActive) {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredOrders = this.orders;
  }

  searchOrders() {
    const term = this.searchTerm?.trim().toLowerCase() || '';
    if (term === '') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order =>
        order.orderItems.some(item => {
          const productNameMatches = item.product.name.toLowerCase().includes(term);
          const brandNameMatches = item.product.brands?.some(brand =>
            brand.name.toLowerCase().includes(term)
          );
          const brandModelNameMatches = item.product.brandModels?.some(model =>
            model.name.toLowerCase().includes(term)
          );
          return productNameMatches || brandNameMatches || brandModelNameMatches;
        })
      );
    }
  }

  getAllOrders() {
    this._orderServiceTemp.getAllOrderByUser(this.user.id).subscribe((data: Order[]) => {
      // Sorting orders by 'createdAt' in descending order (newest first)
      this.orders = data.sort((a: Order, b: Order) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0; // Fallback to 0 if undefined
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0; // Fallback to 0 if undefined
        return dateB - dateA;
      });
      this.filteredOrders = this.orders; // Initialize filtered orders with all orders
    });
  }

  filterOrdersByDateRange(range: any) {

    const now = new Date();
    const timeRanges: { [key: string]: number } = {
      '1 month': 30 * 24 * 60 * 60 * 1000, // 1 month in milliseconds
      '3 months': 3 * 30 * 24 * 60 * 60 * 1000,
      '6 months': 6 * 30 * 24 * 60 * 60 * 1000,
      '1 year': 365 * 24 * 60 * 60 * 1000,
      '3 years': 3 * 365 * 24 * 60 * 60 * 1000,
      '5 years': 5 * 365 * 24 * 60 * 60 * 1000,
    };

    const threshold = timeRanges[range.target.value];

    if (threshold) {
      this.filteredOrders = this.orders.filter(order => {
        if (!order.createdAt) return false; // Skip if createdAt is undefined
        const orderDate = new Date(order.createdAt).getTime();
        return now.getTime() - orderDate <= threshold;
      });
    } else {
      this.filteredOrders = this.orders; // Reset to all orders if no valid range is selected
    }
  }

  viewDetails(id: any) {
    this._router.navigateByUrl(this._router.url+'/order-details/'+id)
  }

  reorder(order: Order) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reorder this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reorder it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cart.user = this.user;
        let totalAmount = 0;
        this.cartItems = []; // Reset cartItems to avoid duplicating items in the cart

        for (let i = 0; i < order.orderItems.length; i++) {
          const cartItem: CartItem = {
            product: order.orderItems[i].product,
            quantity: order.orderItems[i].quantity,
            totalPrice: order.orderItems[i].totalPrice * order.orderItems[i].quantity,
            unitPrice: order.orderItems[i].price
          };
          totalAmount += cartItem.unitPrice; // Accumulate total amount
          this.cartItems.push(cartItem); // Add to cartItems
        }

        this.cart.items = this.cartItems;
        this.cart.totalAmount = totalAmount;

        console.log(this.cart);
        this.cartServiceTemp.addOrUpdateToCart(this.cart).subscribe(() => {
          Swal.fire({
            title: 'Success!',
            text: 'The product has been successfully added to your cart. You can proceed to checkout or continue shopping to explore more items.',
            icon: 'success',
            timer: 4000, // 4 seconds
            showConfirmButton: false,
            footer: '<a href="/customer/cart" class="swal2-footer-link btn btn-success border-0">Go to Cart</a>',
          });
        }, (error: any) => {
          console.log(error);
          this._snackBar.open("Error while adding product to cart again!", "", { duration: 3000 });
        });
      }
    });
  }


  protected readonly NoImage = NoImage;

  gotoProduct(id: number) {
    if(this.user.userRole == "CUSTOMER"){
      this._router.navigate(['/category/sub-category/sub-sub-category/product-details/',id]);
    }
    else if(this.user.userRole=="RETAILER"){
      this._router.navigate(['/retailer/category/sub-category/sub-sub-category/product-details/',id])
    }
    else if(this.user.userRole=="MECHANIC"){
      this._router.navigate(['/mechanic/category/sub-category/sub-sub-category/product-details/',id])
    }
  }

  cancelOrder(order: Order) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {

        this._orderServiceTemp.cancelOrder(order.id).subscribe(()=>{

          this._snackBar.open('Order Cancelled!','',{duration:5000})
          const orderIndex = this.orders.findIndex(o => o.id === order.id);
          const filteredIndex = this.filteredOrders.findIndex(o => o.id === order.id);

          if (orderIndex !== -1) {
            this.orders[orderIndex].status =OrderStatus.CANCELLED;  // Update the status in orders
          }

          if (filteredIndex !== -1) {
            this.filteredOrders[filteredIndex].status =OrderStatus.CANCELLED;  // Update the status in filteredOrders
          }
        })

        // Show success alert
        Swal.fire(
          'Cancelled!',
          'Your order has been canceled.',
          'success'
        );
      }
    });
  }

  getStatusClass(status: OrderStatus) {
    if (status=='CANCELLED' || status == 'REJECTED')
    return 'bg-cancel';
    else
      return ''
  }
}
