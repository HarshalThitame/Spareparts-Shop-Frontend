import {Component, OnInit} from '@angular/core';
import {Order} from "../../../../model/Order.model";
import {User} from "../../../../model/User.model";
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {OrderItem} from "../../../../model/OrderItem.model";
import {Product} from "../../../../model/Product.model";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import {OrderStatus} from "../../../../model/OrderStatus.model";

@Component({
  selector: 'app-admin-edit-order-details',
  templateUrl: './admin-edit-order-details.component.html',
  styleUrls: ['./admin-edit-order-details.component.css']
})
export class AdminEditOrderDetailsComponent implements OnInit {
  searchTerm: string = '';
  order: Order;
  user: User;
  id: any;
  statuses = Object.values(OrderStatus); // Get enum values as an array


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _adminProductService: AdminProductService,
              private _initializerService: InitializerService,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this.user = _initializerService.initializeUser();
    this.order = _initializerService.initializeOrder();
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.loadUser();
  }

  markAsViewed(id: any) {
    this._adminOrderService.markedAsViewed(id).subscribe(() => {

    }, error => {
      console.log(error);
    });
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
    this._adminOrderService.getOrderByOrderId(this.id).subscribe(
      data => {
        this.order = data; // Order and its notes are retrieved from backend
        this.markAsViewed(this.id);
      },
      error => {
        console.log("Error loading order details", error);
      }
    );
  }


  calculateDiscountedPrice(mrp: number, discount: number): number {
    return mrp - (mrp * discount / 100);
  }

  calculateDiscount(mrp: any, discount: any) {
    return (mrp * discount) / 100
  }

  updateSubtotal(item: OrderItem) {

    if (item.quantity > item.product.stockQuantity) {
      this._snackBar.open('Quantity exceeds stock quantity!', 'Close', {duration: 3000});
      item.quantity = item.product.stockQuantity; // Reset quantity to stock quantity
    } else {

      if (item.quantity == 0 || item.quantity == null) {
        item.quantity = 1;
      }

      // Update the subtotal based on the new quantity
      this._adminProductService.getProductDetails(item.product.id).subscribe(
        data => {
          // Set the product details to the order item if needed
          item.product = data; // Assign the product to the order item


          console.log(this.order)
          // Update the order
          this._adminOrderService.updateOrder(this.order).subscribe(
            data => {
              this._snackBar.open("Update success", "", {duration: 3000});
            },
            error => {
              console.error("Error updating order:", error);
              this._snackBar.open("Update failed", "", {duration: 3000});
            }
          );
        },
        error => {
          console.error("Error fetching product details:", error);
          this._snackBar.open("Failed to fetch product details", "", {duration: 3000});
        }
      );
    }
  }

  protected readonly NoImage = Image;

  addNoteToOrder() {
    console.log(this.order.notes)
    this._adminOrderService.updateOrder(this.order).subscribe(data => {
      console.log(data)
    }, error => {
      console.log(error)
    })
  }

  onStatusChange(event: any) {
    this.order.status = event.target.value
    this._adminOrderService.updateOrder(this.order).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Order Status Updated',
          text: `Order status has been updated to: ${this.order.status}`,
          confirmButtonText: 'OK',
        });
      },
      error => {
        this._snackBar.open("Something went Wrong !!!", "", {duration: 3000})
      })

  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'alert-warning'; // Yellow
      case OrderStatus.CONFIRMED:
        return 'alert-info'; // Light blue
      case OrderStatus.UNPAID:
        return 'alert-primary'; // Blue
      case OrderStatus.PAID:
        return 'alert-success'; // Green
      case OrderStatus.REJECTED:
        return 'alert-danger'; // Red
      case OrderStatus.RETURNED:
        return 'alert-danger'; // Red
      case OrderStatus.CANCELLED:
        return 'alert-danger'; // Red
      default:
        return '';
    }
  }
}
