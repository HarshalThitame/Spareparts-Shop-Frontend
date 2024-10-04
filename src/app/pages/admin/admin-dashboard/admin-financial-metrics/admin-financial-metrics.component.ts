import {Component, OnInit} from '@angular/core';
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {Order} from "../../../../model/Order.model";
import {Product} from "../../../../model/Product.model";
import {OrderItem} from "../../../../model/OrderItem.model";

@Component({
  selector: 'app-admin-financial-metrics',
  templateUrl: './admin-financial-metrics.component.html',
  styleUrl: './admin-financial-metrics.component.css'
})
export class AdminFinancialMetricsComponent implements OnInit {
  totalRevenue: number = 0;
  totalExpenses: number = 0;
  netProfit: number = 0;
  pendingPayments: number = 0;
  totalOrders: number = 0;
  totalCustomers: number = 0;
  orders: Order[] = [];
  orderItems: OrderItem[] = [];
  products: Product[] = [];

  constructor(private _adminOrderService: AdminOrderService,
              private _adminProductService: AdminProductService) {}

  ngOnInit(): void {
    this.loadAllOrders();
    this.loadAllOrderItems();
    this.loadAllProducts();
    this.fetchFinancialData();
  }

  loadAllProducts() {
    this._adminProductService.getAllProductDetails().subscribe(data => {
      this.products = data;
    });
  }

  loadAllOrderItems() {
    this._adminOrderService.getAllOrderItems().subscribe(data => {
      this.orderItems = data;
    });
  }

  loadAllOrders() {
    this._adminOrderService.getAllOrders().subscribe(data => {
      this.orders = data;
      this.calculateMetrics();
    });
  }

  fetchFinancialData() {
    // This function could fetch other financial data if needed
  }

  calculateMetrics() {
    this.totalRevenue = this.orders.reduce((acc, order) => {
      if (order.status === 'PAID') { // Check if the order is paid
        const orderRevenue = order.orderItems.reduce((itemAcc, item) => itemAcc + (item.price * item.quantity), 0);
        return acc + orderRevenue;
      }
      return acc;
    }, 0);

    this.totalExpenses = this.orders.reduce((acc, order) => {
      if (order.status === 'PAID') { // Check if the order is paid
        const totalItemTax = order.orderItems.reduce((itemAcc, item) => itemAcc + item.taxAmount, 0);
        return acc + order.discountAmount + totalItemTax;
      }
      return acc;
    }, 0);

    this.netProfit = this.totalRevenue - this.totalExpenses;
    this.pendingPayments = this.orders.filter(order => order.status === 'PENDING').reduce((acc, order) => acc + order.totalAmount, 0);
    this.totalOrders = this.orders.length;
    this.totalCustomers = new Set(this.orders.map(order => order.user.id)).size; // Assuming user has an id
  }
}
