import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from "../../../service/login.service";
import { Router } from "@angular/router";
import { ProductService } from "../../../service/product.service";
import { User } from "../../../model/User.model";
import { Product } from "../../../model/Product.model";
import { InitializerService } from "../../../model/InitializerService/initializer.service";

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  user: User;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = []; // Store paginated products
  searchTerm: string = '';
  pageSize: number = 10;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Using non-null assertion operator

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _initializerService: InitializerService) {
    this.user = _initializerService.initializeUser();
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadAllProducts();
  }

  private loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    });
  }

  loadAllProducts() {
    this._productService.getAllProducts().subscribe(data => {
      console.log('All Products:', data); // Check if products are fetched correctly
      // Ensure data is an array
      this.products = Array.isArray(data) ? data : [];
      this.filteredProducts = [...this.products]; // Initialize filtered products
      this.updatePaginatedProducts();  // Initial pagination update
    }, error => {
      console.error('Error fetching products:', error); // Log any error from the backend
    });
  }

  onSearchChange() {
    console.log('Current search term:', this.searchTerm);
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter((product) => {
        return (product.name && product.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (product.brands && product.brands.some(brand => brand.name.toLowerCase().includes(this.searchTerm.toLowerCase()))) ||
          (product.brandModels && product.brandModels.some(model => model.name.toLowerCase().includes(this.searchTerm.toLowerCase()))) ||
          (product.partNumber && product.partNumber.toLowerCase().includes(this.searchTerm.toLowerCase()));
      });
    } else {
      this.filteredProducts = [...this.products]; // Reset to all products if search term is empty
    }
    this.updatePaginatedProducts();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  deleteProduct(id: any) {
    // Implement delete logic here
  }
}
