import {Component, OnInit} from '@angular/core';
import {Order} from "../../../model/Order.model";
import {Product} from "../../../model/Product.model";
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {ProductService} from "../../../service/product.service";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {User} from "../../../model/User.model";
import {AdminOrderService} from "../../../service/AdminService/admin-order.service";
import NoImage from "../../../service/helper/noImage";
import Swal from "sweetalert2";

@Component({
  selector: 'app-admin-manage-orders',
  templateUrl: './admin-manage-orders.component.html',
  styleUrl: './admin-manage-orders.component.css'
})
export class AdminManageOrdersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'customerType', 'customerName', 'orderDate', 'status','orderItems', 'totalAmount', 'actions'];

  searchTerm: string = '';
  orders: Order[] = []; // Replace with your order data model
  filteredOrders: Order[] = [];
  user: User;

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _initializerService: InitializerService) {
    this.user = _initializerService.initializeUser();
  }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
      this.loadOrders();
      if (this.user.userRole === "ADMIN") {
        // Additional logic for admin user if needed
      }
    });
  }

  loadOrders() {
    this._adminOrderService.getAllOrders().subscribe(data => {
      this.orders = data;

      // Sort orders by createdAt (newest first), handling undefined values
      this.orders.sort((a: Order, b: Order) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0; // Use 0 as fallback for undefined
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      console.log(this.orders);
      this.filteredOrders = this.orders; // Initialize filtered orders
    });
  }


  onSearchChange() {
    this.filteredOrders = this.orders.filter(order =>
       order.user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) // Adjust based on date format
    );
  }

  deleteOrder(orderId: number | undefined) {
    if (!orderId) {
      // Handle case where orderId is undefined
      return;
    }

    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this order? This action cannot be reversed, and the order will be permanently removed from your records.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Logic to delete the order
        this._adminOrderService.deleteOrder(orderId).subscribe(
          () => {
            this.loadOrders(); // Reload orders after deletion
            this.filteredOrders = this.filteredOrders.filter(order => order.id !== orderId);
            Swal.fire(
              'Deleted!',
              'Your order has been deleted.',
              'success'
            );
          },
          error => {
            console.log(error)
            Swal.fire(
              'Error!',
              'There was an error deleting the order.',
              'error'
            );
          }
        );
      }
    });
  }


  protected readonly NoImage = NoImage;
}
