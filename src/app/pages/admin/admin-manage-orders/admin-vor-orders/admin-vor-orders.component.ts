import { Component, OnInit } from '@angular/core';
import { Order } from "../../../../model/Order.model";
import { MatTableDataSource } from "@angular/material/table";
import { LoginService } from "../../../../service/login.service";
import { Router } from "@angular/router";
import { AdminOrderService } from "../../../../service/AdminService/admin-order.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InitializerService } from "../../../../model/InitializerService/initializer.service";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-admin-vor-orders',
  templateUrl: './admin-vor-orders.component.html',
  styleUrls: ['./admin-vor-orders.component.css']
})
export class AdminVorOrdersComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['id', 'customerType', 'customerName', 'orderDate', 'status', 'orderItems', 'totalAmount', 'actions'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);

  // Pagination properties
  totalOrders: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _adminOrderService: AdminOrderService,
    private _snackBar: MatSnackBar,
    private _initializeService: InitializerService
  ) {}

  ngOnInit(): void {
    this.loadVorOrders(this.currentPage, this.pageSize);
  }

  loadVorOrders(page: number, size: number): void {
    this._adminOrderService.getVorOrders(page, size).subscribe((data:any) => {
      console.log(data)
      this.orders = data.content; // Assuming the response contains a 'content' property for the orders
      this.totalOrders = data.totalElements; // Get the total number of orders
      this.dataSource.data = this.orders;
    }, error => {
      this._snackBar.open("Failed to load VOR orders");
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex; // Update current page
    this.pageSize = event.pageSize; // Update page size
    this.loadVorOrders(this.currentPage, this.pageSize); // Reload orders with new page settings
  }
}
