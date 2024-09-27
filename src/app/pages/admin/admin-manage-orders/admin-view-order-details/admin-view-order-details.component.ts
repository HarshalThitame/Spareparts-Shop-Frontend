import {Component, OnInit} from '@angular/core';
import {Order} from "../../../../model/Order.model";
import {User} from "../../../../model/User.model";
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import NoImage from "../../../../service/helper/noImage";

@Component({
  selector: 'app-admin-view-order-details',
  templateUrl: './admin-view-order-details.component.html',
  styleUrl: './admin-view-order-details.component.css'
})
export class AdminViewOrderDetailsComponent implements OnInit {
  searchTerm: string = '';
  order: Order; // Replace with your order data model
  user: User;
  id: any;

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _initializerService: InitializerService,
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
}
