import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {AdminOrderService} from "../../../service/AdminService/admin-order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InitializerService} from "../../../model/InitializerService/initializer.service";
import {Order} from "../../../model/Order.model";
import {Product} from "../../../model/Product.model";
import {AdminProductService} from "../../../service/AdminService/admin-product.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-admin-alert',
  templateUrl: './admin-alert.component.html',
  styleUrl: './admin-alert.component.css'
})
export class AdminAlertComponent implements OnInit{
  orders: Order[] = [];
product:Product[] = []
  orderUpdates: Order[] = [];
  lowStockProducts: Product[] = [];
  deadProducts: Product[] = [];
  recentlyUpdatedProducts: Product[] = [];


  constructor(
    private _loginService: LoginService,
    private _router: Router,
    private _adminOrderService: AdminOrderService,
    private _adminProductService: AdminProductService,
    private _snackBar: MatSnackBar,
    private _initializerService: InitializerService
  ){}

  ngOnInit(): void {
    this.loadLowStockProducts();
    this.loadDeadProducts();
    this.loadRecentlyUpdatedProducts();
  }



  loadLowStockProducts() {
    this._adminProductService.getLowStockProducts().subscribe(data => {
      this.lowStockProducts = data;
    });
  }

  loadDeadProducts() {
    this._adminProductService.getDeadProducts().subscribe(data => {
      this.deadProducts = data;
    });
  }

  loadRecentlyUpdatedProducts() {
    this._adminProductService.getRecentlyUpdatedProducts().subscribe(data => {
      this.recentlyUpdatedProducts = data;
    });
  }
  getCategoryNames(product: Product): string {
    return product.categories && product.categories.length > 0
      ? product.categories.slice(0, 3).map(c => c.name).join(', ') + (product.categories.length > 3 ? '...' : '')
      : 'N/A';
  }


  updateStock(product:Product) {
    this._adminProductService.updateProductStock(product).subscribe(()=>{
      this._snackBar.open("Stock Updated.","",{duration:3000})
    },error => {
      this._snackBar.open("Error while updating.","",{duration:3000})
    })
  }

  toggleBlocked(product: Product) {
    const actionText = product.blocked ? 'unblock' : 'block';

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${actionText} this product.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed to toggle the blocked status
        this._adminProductService.updateProductBlockedStatus(product).subscribe(
          response => {
            product.blocked = !product.blocked;
            this._snackBar.open(`Product ${actionText}ed successfully!`, 'Close', { duration: 2000 });
          },
          error => {
            this._snackBar.open('Failed to update product status!', 'Close', { duration: 2000 });
            product.blocked = !product.blocked;
          }
        );
      } else {
        // Revert the switch toggle if canceled
        product.blocked = !product.blocked;
      }
    });
  }

  navigateToProduct(id:any) {

  }
}
