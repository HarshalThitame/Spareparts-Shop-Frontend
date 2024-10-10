import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import {AdminOrderService} from "../../../../service/AdminService/admin-order.service";
import {OrderItem} from "../../../../model/OrderItem.model";
import {AdminProductService} from "../../../../service/AdminService/admin-product.service";
import {Product} from "../../../../model/Product.model";
import Swal from "sweetalert2";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-admin-inventory-management',
  templateUrl: './admin-inventory-management.component.html',
  styleUrl: './admin-inventory-management.component.css'
})
export class AdminInventoryManagementComponent implements OnInit {
  products: Product[] = [];
  orderItems: OrderItem[] = [];
  mostSellingProducts: { product: Product; salesQuantity: number }[] = [];
  deadProducts: Product[]=[];


  constructor(
    private _adminProductService: AdminProductService,
    private _adminOrderService: AdminOrderService,
    private _snackBar:MatSnackBar

  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getAllProducts();
    this.getAllOrderedItems();
  }

  getAllProducts() {
    this._adminProductService.getAllProductDetails().subscribe(data => {
      this.products = data;
    });
  }

  getAllOrderedItems() {
    this._adminOrderService.getAllOrderItems().subscribe(data => {
      this.orderItems = data;
      console.log('Order Items:', this.orderItems); // Log the fetched order items

      if (this.orderItems && this.orderItems.length > 0) {
        this.calculateMostSellingProducts(); // Calculate most selling after getting order items
        this.calculateDeadProducts(); // Calculate dead products
      } else {
        console.warn('No order items found, skipping calculations.');
      }
    }, error => {
      console.error('Failed to fetch order items:', error);
    });
  }


  calculateMostSellingProducts() {
    const salesMap: { [key: string]: number } = {}; // key: product ID (as string), value: total sales quantity

    // Aggregate sales quantities from orderItems
    this.orderItems.forEach(orderItem => {
      const productId = orderItem.product.id.toString(); // Convert product ID to string
      const quantity = orderItem.quantity;

      if (salesMap[productId]) {
        salesMap[productId] += quantity; // Increment quantity for existing product
      } else {
        salesMap[productId] = quantity; // Initialize quantity for new product
      }
    });

    // Create an array of most selling products with their sales quantities
    this.mostSellingProducts = Object.keys(salesMap)
      .map(productId => {
        const product = this.products.find(p => p.id === +productId); // Find product details

        // Ensure that the product exists to avoid null errors
        if (product) {
          return {
            product,
            salesQuantity: salesMap[productId] // Access the sales quantity
          };
        }
        return null; // Return null for non-existing products
      })
      .filter((item): item is { product: Product; salesQuantity: number } => item !== null) // Filter out null values
      .sort((a, b) => b.salesQuantity - a.salesQuantity) // Sort by sales quantity descending
      .slice(0, 10); // Get top 10 most selling products
  }

  calculateDeadProducts() {
    const now = new Date(); // Get current date

    // Get a cutoff date for sales
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - 300); // Set to 30 days ago

    // Collect sold product IDs within the last 30 days
    const soldProductIds = new Set<number>(); // Use Set for uniqueness

    this.orderItems.forEach(orderItem => {
      if (orderItem.createdAt) { // Check if createdAt is defined
        const orderDate = new Date(orderItem.createdAt); // Create Date object

        if (orderDate >= cutoffDate) {
          soldProductIds.add(orderItem.product.id); // Add sold product ID
        }
      }
    });

    // Identify dead products
    this.products.forEach(product => {
      if (!soldProductIds.has(product.id)) {
        this.deadProducts.push(product); // Add to dead products if not sold in timeframe
      }
    });

    return this.deadProducts; // Return or set this value to a class variable as needed
  }

  calculateTotalInventoryValue(): number {
    let totalValue = 0; // Initialize total inventory value

    // Iterate through products to calculate total value
    this.products.forEach(product => {
      totalValue += product.price * product.stockQuantity; // Add product value to total
    });

    return totalValue; // Return total inventory value
  }


  viewDetails(product: Product) {

  }

  manageStock(product: Product) {

  }

  refreshTopSellingAndDeadProducts() {
    this.calculateMostSellingProducts()
    this.calculateDeadProducts()
  }

  toggleBlocked(product: Product) {
    const actionText = product.blocked ? 'block' : 'unblock';

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
        // product.blocked = !product.blocked
        this._adminProductService.updateProductBlockedStatus(product).subscribe(
          response => {
            // product.blocked = !product.blocked;
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
}
