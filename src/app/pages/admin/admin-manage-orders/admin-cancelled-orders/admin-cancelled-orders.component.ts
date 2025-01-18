import { Component, OnInit } from '@angular/core';
import { Order } from "../../../../model/Order.model";
import { MatTableDataSource } from "@angular/material/table";
import { LoginService } from "../../../../service/login.service";
import { Router } from "@angular/router";
import { AdminOrderService } from "../../../../service/AdminService/admin-order.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InitializerService } from "../../../../model/InitializerService/initializer.service";
import { PageEvent } from '@angular/material/paginator'; // Import PageEvent

@Component({
  selector: 'app-admin-cancelled-orders',
  templateUrl: './admin-cancelled-orders.component.html',
  styleUrls: ['./admin-cancelled-orders.component.css'] // Corrected from styleUrl to styleUrls
})
export class AdminCancelledOrdersComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['id', 'customerType', 'customerName', 'orderDate', 'orderItems', 'totalAmount', 'actions'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);
  pageSize = 10; // Set default page size
  pageIndex = 0; // Set default page index
  length = 0; // Total number of orders

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _snackBar: MatSnackBar,
              private _initializeService: InitializerService) {}

  ngOnInit(): void {
    this.loadCancelledOrders(); // Load initial data
  }

  loadCancelledOrders(): void {
    this._adminOrderService.getCancelledOrders(this.pageIndex, this.pageSize).subscribe(data => {
      this.orders = data.content; // Assuming the response structure is Page<Order>
      this.length = data.totalElements; // Update total length for pagination
      this.dataSource.data = this.orders;
    }, error => {
      console.log(error)
      this._snackBar.open("Failed to load cancelled orders", "", { duration: 3000 });
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex; // Update pageIndex
    this.pageSize = event.pageSize; // Update pageSize
    this.loadCancelledOrders(); // Load data for new page
  }
}
