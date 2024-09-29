import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../../model/User.model";
import {Product} from "../../../../model/Product.model";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {Order} from "../../../../model/Order.model";
import {OrderStatus} from "../../../../model/OrderStatus.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  id: any;
  user: User;
  product: Product;
  productMetrics = {
    totalSales: 0,
    totalPaidOrders: 0,
    totalRevenue: 0,
    orderStatusCounts: {} as Record<string, number>, // To hold counts for each order status
    totalDiscountGiven: 0,
    totalGSTCollected: 0
  };

  orderStatusKeys = Object.values(OrderStatus); // Get an array of order status keys
  productOrders: Order[] = [];
  displayedColumns: string[] = ['id', 'status', 'totalPrice', 'quantity', 'orderDate','details'];
  dataSource = new MatTableDataSource<Order>(); // Use MatTableDataSource for the orders


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminProductService: AdminProductService,
              private _adminOrderService: AdminOrderService,
              private _route: ActivatedRoute,
              private _snackBar:MatSnackBar,
              private _initializerService: InitializerService) {
    this.user = _initializerService.initializeUser();
    this.product = this._initializerService.initializeProduct()
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');

    this.loadUser();
    this.loadProduct(this.id)
  }


  loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    })
  }

  loadProduct(id: any) {
    this._adminProductService.getProductDetails(id).subscribe(data => {
      this.product = data;
      this.loadOrders()
      console.log(this.product)
    })
  }
  loadOrders() {
    this._adminOrderService.getAllOrders().subscribe(orders => {
      this.productMetrics = this.calculateProductMetrics(this.product, orders);
      this.productOrders = this.getProductOrders(orders); // Populate the productOrders array
      this.dataSource.data = this.productOrders; // Set the data source for the table

    });
  }

  getProductOrders(orders: Order[]): Order[] {
    return orders.filter(order =>
      order.orderItems.some(item => item.product.id === this.product.id)
    );
  }
  getTotalPrice(order: Order): number {
    return order.orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }

  // Method to get the total quantity of the product in the order
  getProductQuantity(order: Order): number {
    return order.orderItems
      .filter(item => item.product.id === this.product.id)
      .reduce((acc, item) => acc + item.quantity, 0);
  }


  calculateProductMetrics(product: Product, orders: Order[]): any {
    let totalSales = 0;
    let totalPaidOrders = 0;
    let totalRevenue = 0;
    let totalDiscountGiven = 0;
    let totalGSTCollected = 0;

    // Initialize counts for each order status
    const orderStatusCounts = {
      PENDING: 0,
      CONFIRMED: 0,
      UNPAID: 0,
      PAID: 0,
      CANCELLED: 0,
      REJECTED: 0,
      RETURNED: 0
    };

    orders.forEach(order => {
      let hasProduct = false;

      order.orderItems.forEach(item => {
        if (item.product.id === product.id) {
          totalSales += item.quantity;
          totalRevenue += item.totalPrice;
          totalDiscountGiven += item.discountAmount;
          totalGSTCollected += item.taxAmount ? item.taxAmount : 0;
          hasProduct = true;
        }
      });

      // If the order has the product, count the order status
      if (hasProduct) {
        orderStatusCounts[order.status]++;
        if (order.status === 'PAID') {
          totalPaidOrders++;
        }
        else if(order.status === OrderStatus.PENDING){
          orderStatusCounts["PENDING"]++;
        }else if(order.status === OrderStatus.CONFIRMED){
          orderStatusCounts["CONFIRMED"]++;
        }else if(order.status === OrderStatus.UNPAID){
          orderStatusCounts["UNPAID"]++;
        }else if(order.status === OrderStatus.CANCELLED){
          orderStatusCounts["CANCELLED"]++;
        }else if(order.status === OrderStatus.RETURNED){
          orderStatusCounts["RETURNED"]++;
        }else if(order.status === OrderStatus.REJECTED){
          orderStatusCounts["REJECTED"]++;
        }
      }
    });

    return {
      totalSales,
      totalPaidOrders,
      totalRevenue,
      totalDiscountGiven,
      totalGSTCollected,
      orderStatusCounts // Return the counts of each status
    };
  }



  calculateDiscountedPrice(mrp: number, discount: number): number {
    return mrp - (mrp * discount / 100);
  }

  applyDiscount() {
    if(this.product.discountOnPurchase >= 0 && this.product.discountOnPurchase <=100 ||
      this.product.discountToRetailer >= 0 && this.product.discountToRetailer <=100 ||
      this.product.discountToMechanics >= 0 && this.product.discountToMechanics <=100 )
    {
      this._adminProductService.addOrUpdateProduct(this.product).subscribe(()=>{
        this._snackBar.open(`Discount Applied`,"",{duration:3000})
      },
        error => {
        this._snackBar.open("Error while applying discount.","",{duration:3000})
        })
    }
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return '#FF9800'; // Orange
      case 'CONFIRMED':
        return '#2196F3'; // Blue
      case 'UNPAID':
        return '#F44336'; // Red
      case 'PAID':
        return '#4CAF50'; // Green
      case 'CANCELLED':
        return '#9E9E9E'; // Grey
      case 'REJECTED':
        return '#F44336'; // Red
      case 'RETURNED':
        return '#FFEB3B'; // Yellow
      default:
        return '#FFFFFF'; // Default color
    }
  }

}
