import {Component, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../../../model/Order.model";
import {User} from "../../../../model/User.model";
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import NoImage from "../../../../service/helper/noImage";
import {OrderInvoiceComponent} from "../../../SharedComponent/order-invoice/order-invoice.component";
import {OrderStatus} from "../../../../model/OrderStatus.model";
import Swal from "sweetalert2";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Product} from "../../../../model/Product.model";
import {EmailData} from "../../../../model/EmailData.model";

@Component({
  selector: 'app-admin-view-order-details',
  templateUrl: './admin-view-order-details.component.html',
  styleUrl: './admin-view-order-details.component.css'
})
export class AdminViewOrderDetailsComponent implements OnInit {
  @ViewChild(OrderInvoiceComponent) orderInvoiceComponent!: OrderInvoiceComponent; // Reference to the child component

  searchTerm: string = '';
  order: Order; // Replace with your order data model
  user: User;
  id: any;

  statuses = Object.values(OrderStatus); // Get enum values as an array


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _initializerService: InitializerService,
              private _snackBar: MatSnackBar,
              private _route: ActivatedRoute) {
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
      console.log(error)
    })
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
    this._adminOrderService.getOrderByOrderId(this.id).subscribe(data => {
      this.order = data;
      this.markAsViewed(this.id)
    })
  }

  protected readonly NoImage = NoImage;

  printOrder() {
    this.orderInvoiceComponent.printInvoice(); // Call the printInvoice method from the child component
  }

  markAsUnread() {
    this._adminOrderService.markedAsUnViewed(this.id).subscribe(()=>{
      this._router.navigate(['/admin/manage-orders'])
    },error=>{
      console.log(error)
    })
  }

  onStatusChange(event: any) {
    this.order.status = event.target.value;
    this._adminOrderService.updateOrder(this.order).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Order Status Updated',
          text: `Order status has been updated to: ${this.order.status}`,
          confirmButtonText: 'OK',
        });

        // Send email based on the new status
        if (this.order.status === OrderStatus.CONFIRMED) {
          this.sendEmailConfirmation();
        } else if (this.order.status === OrderStatus.REJECTED) {
          this.sendEmailRejection();
        }
      },
      error => {
        this._snackBar.open("Something went wrong !!!", "", { duration: 3000 });
      });
  }

  sendEmailConfirmation() {
    const emailData: EmailData = {
      to: this.order.user.email,
      subject: "Order Confirmation",
      body: this.createOrderConfirmationEmailBody() // Implement this method to create email body
    };

    this._adminOrderService.sendEmail(emailData).subscribe(response => {
      console.log('Order confirmation email sent:', response);
    }, error => {
      console.error('Error sending email:', error);
    });
  }

  sendEmailRejection() {
    const emailData: EmailData = {
      to: this.order.user.email,
      subject: "Order Rejection",
      body: this.createOrderRejectionEmailBody() // Implement this method to create email body
    };

    this._adminOrderService.sendEmail(emailData).subscribe(response => {
      console.log('Order rejection email sent:', response);
    }, error => {
      console.error('Error sending email:', error);
    });
  }

  // Implement the methods to create the email body for confirmation and rejection
  createOrderConfirmationEmailBody(): string {
    return `
      <h1>Your Order has been Confirmed</h1>
      <p>Dear ${this.order.user.firstName} ${this.order.user.lastName},</p>
      <p>Your order with ID: ${this.order.id} has been confirmed. Thank you for shopping with us!</p>

    `;
  }

  createOrderRejectionEmailBody(): string {
    return `
    <h1>Your Order has been Rejected</h1>
    <p>Dear ${this.order.user.firstName} ${this.order.user.lastName},</p>
    <p>We regret to inform you that your order with ID: ${this.order.id} has been rejected by the seller.</p>
    <p>If you have any questions or need assistance, please feel free to contact us.</p>
  `;
  }


  addNoteToOrder() {
    console.log(this.order.notes)
    this._adminOrderService.updateOrder(this.order).subscribe(data => {
      console.log(data)
    }, error => {
      console.log(error)
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
  getDiscount(product: Product): number {
    return product.discountOnPurchase;
  }
  getDiscountedPrice(product: Product): number {
    return product.price - (product.price * this.getDiscount(product) / 100);
  }

  getTotalSavings(): number {
    return this.order.orderItems.reduce((totalSavings, item) => {
      const originalPrice = item.product.price * item.quantity;
      const discountedPrice = this.getDiscountedPrice(item.product) * item.quantity;
      return totalSavings + (originalPrice - discountedPrice);
    }, 0);
  }

  getTotalPriceAfterDiscounts(): number {
    return this.getSubtotal() - this.getTotalSavings()
  }

  getGst() {
    return this.order.orderItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  }

  getSubtotal() {
    return this.order.orderItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }
}
