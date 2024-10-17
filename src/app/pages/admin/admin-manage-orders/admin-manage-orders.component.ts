import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from "../../../model/Order.model";
import { User } from "../../../model/User.model";
import { LoginService } from "../../../service/login.service";
import { Router } from "@angular/router";
import { AdminOrderService } from "../../../service/AdminService/admin-order.service";
import { InitializerService } from "../../../model/InitializerService/initializer.service";
import NoImage from "../../../service/helper/noImage";
import Swal from "sweetalert2";
import { OrderStatus } from "../../../model/OrderStatus.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-admin-manage-orders',
  templateUrl: './admin-manage-orders.component.html',
  styleUrls: ['./admin-manage-orders.component.css']
})
export class AdminManageOrdersComponent implements OnInit {
  searchTerm: string = '';
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  user: User;
  selectedCustomerType: string = '';
  selectedStatus: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  showViewedOrders: boolean = false;

  displayedColumns: string[] = ['id', 'customerType', 'customerName', 'orderDate', 'status', 'orderItems', 'totalAmount', 'actions'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  customerTypes: string[] = ['RETAILER', 'CUSTOMER', 'MECHANIC'];
  orderStatuses = Object.values(OrderStatus);
  originalOrders: Order[] = [];

  // Pagination Variables
  totalOrders: number = 0; // Total number of orders
  pageSize: number = 50; // Number of orders per page
  currentPage: number = 0; // Current page index

  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _adminOrderService: AdminOrderService,
    private _snackBar: MatSnackBar,
    private _initializerService: InitializerService
  ) {
    this.user = _initializerService.initializeUser();

    const savedShowViewedOrders = localStorage.getItem('showViewedOrders');
    if (savedShowViewedOrders) {
      this.showViewedOrders = JSON.parse(savedShowViewedOrders);
    }
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
      this.loadOrders();
    });
  }


  loadOrders() {
    this._adminOrderService.getAllOrdersByPagination(this.currentPage, this.pageSize).subscribe(data => {
      console.log(data)
      this.orders = data.content;
      this.totalOrders = data.totalElements;

      this.originalOrders = [...this.orders];

      this.filteredOrders = [...this.orders];
      this.dataSource = new MatTableDataSource<Order>(this.filteredOrders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // Method to filter orders based on selected filters
  onFilterChange() {
    this.filteredOrders = this.originalOrders.filter(order => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : null;

      const isAfterStartDate = this.startDate ? orderDate && new Date(this.startDate) <= orderDate : true;
      const isBeforeEndDate = this.endDate ? orderDate && new Date(this.endDate) >= orderDate : true;

      return (
        (this.selectedCustomerType ? order.user.userRole === this.selectedCustomerType : true) &&
        (this.selectedStatus ? order.status === this.selectedStatus : true) &&
        (this.startDate ? isAfterStartDate : true) &&
        (this.endDate ? isBeforeEndDate : true) &&
        (this.searchTerm ?
          (order.user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            order.user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) : true) &&
        (this.showViewedOrders ? order.isVor : true)
      );
    });

    this.dataSource.data = this.filteredOrders; // Update data source with filtered orders
    this.dataSource.paginator = this.paginator; // Rebind paginator to data source
    this.dataSource.sort = this.sort; // Rebind sort to data source
  }


  deleteOrder(orderId: number | undefined) {
    if (!orderId) return;

    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be reversed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._adminOrderService.deleteOrder(orderId).subscribe(
          () => {
            this.loadOrders(); // Reload orders after deletion
            Swal.fire('Deleted!', 'Your order has been deleted.', 'success');
          },
          error => {
            console.log(error);
            Swal.fire('Error!', 'There was an error deleting the order.', 'error');
          }
        );
      }
    });
  }

  protected readonly NoImage = NoImage;

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'text-warning'; // Yellow text for PENDING
      case OrderStatus.CONFIRMED:
        return 'text-primary'; // Blue text for CONFIRMED
      case OrderStatus.UNPAID:
        return 'text-danger'; // Red text for UNPAID
      case OrderStatus.PAID:
        return 'text-success'; // Green text for PAID
      case OrderStatus.CANCELLED:
        return 'text-grey'; // Grey text for CANCELLED
      case OrderStatus.REJECTED:
        return 'text-danger'; // Red text for REJECTED
      case OrderStatus.RETURNED:
        return 'text-danger'; // Light blue text for RETURNED
      default:
        return ''; // Default class if none matches
    }
  }

  onStatusChange(event: any, order: Order) {
    const newStatus = event.value;
    console.log(newStatus);
    console.log(order.status);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Changing the status of the order may impact its processing workflow. Please confirm you want to proceed with this change.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        order.status = newStatus;

        this._adminOrderService.updateOrder(order).subscribe(() => {
          Swal.fire('Success!', 'Order status updated successfully.', 'success');
          this.loadOrders(); // Reload orders after status change
        }, error => {
          console.error('Error updating order status:', error);
          Swal.fire('Error!', 'There was an error updating the order status.', 'error');
        });
      }
    });
  }

  // Handle paginator changes
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex; // Update current page index
    this.pageSize = event.pageSize; // Update page size
    this.loadOrders(); // Reload orders for the new page
  }

  refreshPage() {
    this.ngOnInit()
  }
}
