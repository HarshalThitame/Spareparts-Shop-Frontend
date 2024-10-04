import {Component, OnInit} from '@angular/core';
import { Order } from '../../../../model/Order.model';
import {LoginService} from "../../../../service/login.service";
import {Router} from "@angular/router";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-admin-new-orders',
  templateUrl: './admin-new-orders.component.html',
  styleUrl: './admin-new-orders.component.css'
})
export class AdminNewOrdersComponent implements OnInit{
  orders:Order[]=[];
  displayedColumns: string[] = ['id', 'customerType', 'customerName', 'orderDate', 'status', 'orderItems', 'totalAmount', 'actions'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]); // Ensure type is specified


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _adminOrderService: AdminOrderService,
              private _snackBar: MatSnackBar,
              private _initializeService: InitializerService) {
  }

    ngOnInit(): void {
        this._adminOrderService.getNewOrders().subscribe(data=>{
        this.orders = data;
          this.dataSource.data = this.orders;
        },error => {
          this._snackBar.open("Failed to load new order")
          })
    }


}
