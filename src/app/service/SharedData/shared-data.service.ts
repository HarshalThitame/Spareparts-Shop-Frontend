import {Injectable} from '@angular/core';
import {Cart} from "../../model/Cart.model";
import {User} from "../../model/User.model";
import {Product} from "../../model/Product.model";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {CustomerCartService} from "../customerService/customer-cart.service";
import {RetailerCartService} from "../retailerService/retailer-cart.service";
import {MechanicCartService} from "../mecahnicService/mechanic-cart.service";
import {Subject} from "rxjs";
import {ProductService} from "../product.service";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private filteredProductsSubject = new Subject<any[]>();
  filteredProducts$ = this.filteredProductsSubject.asObservable();


  constructor(private _loginService: LoginService,
              private _customerCartService:CustomerCartService,
              private _RetailerCartService:RetailerCartService,
              private _mechanicCartService:MechanicCartService,
              private _productService: ProductService,
              private _router: Router) {}

  checkLoginAndAddToCart(user: User, product: Product, quantity: number): boolean {
    const isLoggedIn = this._loginService.isLoggedIn();


    if (!isLoggedIn) {
      const returnUrl = this._router.url;
      this._router.navigate(['login'], { queryParams: { returnUrl } });
      return false
    }
      const cart = this.addToCart(user, product, quantity);  // Use the CartService to create a cart
    if(user.userRole === 'CUSTOMER') {
      this._customerCartService.addOrUpdateToCart(cart).subscribe(()=>{},error => {return false})
    }
    else if(user.userRole === 'MECHANIC') {
      this._mechanicCartService.addOrUpdateToCart(cart).subscribe(()=>{},error => {return false})
    }
    else if(user.userRole === 'RETAILER') {
      this._RetailerCartService.addOrUpdateToCart(cart).subscribe(()=>{},error => {return false})
    }
    return true;

  }

  private addToCart(user: User, product: Product, quantity: number): Cart {
    const totalPrice = product.price * quantity;

    return {
      user: {id: user.id},
      items: [{
        product: product,
        quantity: quantity,
        unitPrice: product.price,
        totalPrice: totalPrice
      }],
      totalAmount: totalPrice
    }; // Return the cart object
  }

  /**
   * Load products based on the search dropdown ID.
   * @param id - The ID string containing brand, model, and category IDs.
   */
  loadProductBySearchDropdown(id: string): void {
    const allId: string[] = id.split('-');

    // Ensure there are exactly 3 parts
    if (allId.length !== 3) {
      return;
    }

    const SB = parseInt(allId[0], 10);  // Convert to integer
    const SM = parseInt(allId[1], 10);  // Convert to integer
    const SC = parseInt(allId[2], 10);  // Convert to integer

    // Check for different combinations of selections
    if (SB !== 0 && SM !== 0 && SC !== 0) {
      this._productService.searchByBrandsAndBrandModelAndCategory(SB, SM, SC)
        .subscribe(data => {
          this.filteredProductsSubject.next(data);
        }, error => {
          console.error(error);
        });
    } else if (SB !== 0 && SM !== 0) {
      this._productService.searchByBrandAndModel(SB, SM)
        .subscribe(data => {
          this.filteredProductsSubject.next(data);
        }, error => {
          console.error(error);
        });
    } else if (SB !== 0 && SC !== 0) {
      this._productService.searchByBrandAndCategory(SB, SC)
        .subscribe(data => {
          this.filteredProductsSubject.next(data);
        }, error => {
          console.error(error);
        });
    } else if (SM !== 0 && SC !== 0) {
      this._productService.searchByModelAndCategory(SM, SC)
        .subscribe(data => {
          this.filteredProductsSubject.next(data);
        }, error => {
          console.error(error);
        });
    } else if (SB !== 0) {
      this._productService.searchByBrand(SB)
        .subscribe(data => {
          this.filteredProductsSubject.next(data);
        }, error => {
          console.error(error);
        });
    } else if (SM !== 0) {
      this._productService.searchByModel(SM)
        .subscribe(data => {
          this.filteredProductsSubject.next(data);
        }, error => {
          console.error(error);
        });
    } else if (SC !== 0) {
      this._productService.searchByCategory(SC)
        .subscribe(data => {
          this.filteredProductsSubject.next(data);
        }, error => {
          console.error(error);
        });
    }
  }
}
