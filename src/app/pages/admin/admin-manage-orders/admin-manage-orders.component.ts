import {Component, OnInit} from '@angular/core';
import {Order} from "../../../model/Order.model";
import {User} from "../../../model/User.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {AdminOrderService} from "../../../service/AdminService/admin-order.service";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import NoImage from "../../../service/helper/noImage";
import Swal from "sweetalert2";
import {OrderStatus} from "../../../model/OrderStatus.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-manage-orders',
  templateUrl: './admin-manage-orders.component.html',
  styleUrls: ['./admin-manage-orders.component.css'] // Fix typo 'styleUrl' to 'styleUrls'
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


  customerTypes: string[] = ['RETAILER', 'CUSTOMER', 'MECHANIC'];
  orderStatuses = Object.values(OrderStatus);
  originalOrders: Order[] = [];

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _snackBar: MatSnackBar,
              private _initializerService: InitializerService) {
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
    this._adminOrderService.getAllOrders().subscribe(data => {
      this.orders = data;

      // Sort orders by createdAt (newest first), handling undefined values
      this.orders.sort((a: Order, b: Order) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      this.filteredOrders = [...this.orders]; // Initialize filtered orders
      this.originalOrders = [...this.orders]; // Keep a copy for resetting filters
      this.onFilterChange()
    });
  }

  // Method to filter orders based on selected filters
  onFilterChange() {
    this.filteredOrders = this.originalOrders.filter(order => {
      // Ensure order.createdAt is defined before creating a Date
      const orderDate = order.createdAt ? new Date(order.createdAt) : null;

      const isAfterStartDate = this.startDate ? orderDate && new Date(this.startDate) <= orderDate : true;
      const isBeforeEndDate = this.endDate ? orderDate && new Date(this.endDate) >= orderDate : true;

      return (
        (this.selectedCustomerType ? order.user.userRole === this.selectedCustomerType : true) &&
        (this.selectedStatus ? order.status === this.selectedStatus : true) &&
        (this.startDate ? isAfterStartDate : true) && // Use isAfterStartDate directly
        (this.endDate ? isBeforeEndDate : true) && // Use isBeforeEndDate directly
        (this.searchTerm ?
          (order.user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            order.user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) : true) &&
        (this.showViewedOrders ? order.isVor : true) // Check if only viewed orders should be shown
      );
    });

    // Save the checkbox state in localStorage
    localStorage.setItem('showViewedOrders', JSON.stringify(this.showViewedOrders));
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
        return 'text-info'; // Red text for UNPAID
      case OrderStatus.PAID:
        return 'text-success'; // Green text for PAID
      case OrderStatus.CANCELLED:
        return 'text-danger'; // Grey text for CANCELLED
      case OrderStatus.REJECTED:
        return 'text-danger'; // Red text for REJECTED
      case OrderStatus.RETURNED:
        return 'text-danger'; // Light blue text for RETURNED
      default:
        return ''; // Default class if none matches
    }
  }

  onStatusChange(event: any, order: Order) {
    const newStatus = event.target.value;
    console.log(newStatus)
    console.log(order.status)
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
            Swal.fire({
              icon: 'success',
              title: 'Order Status Updated',
              text: `Order status has been updated to: ${order.status}`,
              confirmButtonText: 'OK',
            });
          },
          error => {
            this._snackBar.open("Something went Wrong !!!", "", {duration: 3000})
          })

      }
    });
  }

}
