import {Component, OnInit} from '@angular/core';
import {User} from "../../../../model/User.model";
import {Order} from "../../../../model/Order.model";
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerCartService} from "../../../../service/customerService/customer-cart.service";
import {RetailerCartService} from "../../../../service/retailerService/retailer-cart.service";
import {CustomerShippingAddressService} from "../../../../service/customerService/customer-shipping-address.service";
import {RetailerShippingAddressService} from "../../../../service/retailerService/retailer-shipping-address.service";
import {MechanicShippingAddressService} from "../../../../service/mecahnicService/mechanic-shipping-address.service";
import {CustomerOrderService} from "../../../../service/customerService/customer-order.service";
import {RetailerOrderService} from "../../../../service/retailerService/retailer-order.service";
import {MechanicOrderService} from "../../../../service/mecahnicService/mechanic-order.service";
import {MechanicCartService} from "../../../../service/mecahnicService/mechanic-cart.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {SharedDataService} from "../../../../service/SharedData/shared-data.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-my-order-details',
  templateUrl: './my-order-details.component.html',
  styleUrl: './my-order-details.component.css'
})
export class MyOrderDetailsComponent implements OnInit{
  user: User;
  order: Order;
  filteredOrders: Order[] = [];
  isSearchActive: boolean = false;
  searchTerm: string = '';
  private cartServiceTemp: any;
  private _orderServiceTemp: any;
  private isLoggedIn: boolean = false;
  id: any;

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
    private _sharedDataService: SharedDataService,
    private _route:ActivatedRoute
  ) {
    this.user = _initializerService.initializeUser();
    this.order = _initializerService.initializeOrder()
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.loadUser();
  }

  private loadUser(): void {
    this.isLoggedIn = this._loginService.isLoggedIn();
    this._loginService.getCurrentUser().subscribe(
      (data: User) => {
        this.user = data;
        this.setServicesBasedOnUserRole();
        this.getOrderDetailsByOrderId()
        this.isLoggedIn = true;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
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

  getOrderDetailsByOrderId() {
        this._orderServiceTemp.getOrderByOrderId(this.id).subscribe((data: Order)=>{
          this.order = data;
          console.log(this.order)
        })
    }

  goBack() {

  }

  printInvoice() {
    const DATA: any = document.getElementById('order-details-section');

    // Temporarily add a class to prevent responsive behavior
    DATA.classList.add('print-mode');

    html2canvas(DATA, { scale: 2 }).then(canvas => {
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 in portrait mode
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first image (first page)
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Check if more pages are needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF using the order ID
      const orderId = this.order?.id || 'invoice';
      pdf.save(`${orderId}-order-invoice.pdf`);
    }).finally(() => {
      // Remove the class after PDF is generated
      DATA.classList.remove('print-mode');
    });
  }



  getDiscount(price: number, discountOnPurchase: number, quantity: number) {
    return ((price*discountOnPurchase)/100)*quantity;
  }

  getOrderSubtotal(): number {
    return this.order.orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  getOrderGst() {

    return this.order.orderItems.reduce((sum,item)=>sum + item.taxAmount,0)
  }

  getOrderDiscount() {
    for (let i = 0; i < this.order.orderItems.length; i++) {
      // console.log(this.order.orderItems[i].discountAmount)

    }
    return this.order.orderItems.reduce((sum,item)=>sum+item.discountAmount,0);
  }

  getGstPercentage(): number {
    // Assuming all products have the same GST percentage, return the GST of the first item
    return this.order.orderItems[0]?.gst || 0;
  }


  protected readonly Date = Date;
}
