import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../service/login.service";
import {Router} from "@angular/router";
import {ProductService} from "../../../service/product.service";
import {User} from "../../../model/User.model";
import {Product} from "../../../model/Product.model";
import {InitializerService} from "../../../model/InitializerService/initializer.service";

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css'] // Corrected to 'styleUrls'
})
export class ManageProductComponent implements OnInit {
  user: User;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _initializerService:InitializerService) {
    this.user = _initializerService.initializeUser();
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadAllProducts();
  }

  private loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
      if (this.user.userRole === "ADMIN") {
        // Additional logic for admin user if needed
      }
    });
  }

  loadAllProducts() {
    this._productService.getAllProducts().subscribe(data => {
      console.log('All Products:', data); // Check if products are fetched correctly
      this.products = data;  // Assign the data to `products`
      this.filteredProducts = data;  // Initialize filtered products
      console.log('Filtered Products:', this.filteredProducts);  // Log filtered products for debugging
    }, error => {
      console.error('Error fetching products:', error);  // Log any error from the backend
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
      this.filteredProducts = this.products; // Reset to all products if search term is empty
    }
  }



  deleteProduct(id: any) {
    // Implement delete logic here
  }
}
