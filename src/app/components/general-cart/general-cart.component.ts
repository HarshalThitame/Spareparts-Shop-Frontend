import {Component, OnInit} from '@angular/core';
import {Cart} from "../../model/Cart.model";
import {CartItem} from "../../model/CartItem.model";
import {Product} from "../../model/Product.model";

@Component({
  selector: 'app-general-cart',
  templateUrl: './general-cart.component.html',
  styleUrl: './general-cart.component.css'
})
export class GeneralCartComponent implements OnInit {
  cart: Cart = {user: {id: 0}, items: [], totalAmount: 0};

  ngOnInit(): void {
    this.loadCartFromLocalStorage(); // Load from local storage
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('temporaryCart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.updateCartTotal(); // Update the total after loading
    }
  }

  private updateCartTotal(): void {
    this.cart.totalAmount = this.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  protected increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.updateCart(item);
  }

  protected decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart(item);
    }
  }

  protected removeItem(item: CartItem): void {
    this.cart.items = this.cart.items.filter(i => i !== item);
    this.updateCartTotal();
    this.updateCart(item); // Update the cart in local storage
  }

  private updateCart(item: CartItem): void {
    localStorage.setItem('temporaryCart', JSON.stringify(this.cart)); // Update local storage
  }

  getTotalItems(): number {
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPriceAfterDiscounts(): number {
    return this.cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getDiscountedPrice(product: Product): number {
    return product.price - (product.price * this.getDiscount(product) / 100);
  }

  getDiscount(product: Product): number {
    return product.discountOnPurchase + product.discountToMechanics;
  }
  getTotalSavings(): number {
    return this.cart.items.reduce((totalSavings, item) => {
      const originalPrice = item.product.price * item.quantity;
      const discountedPrice = this.getDiscountedPrice(item.product) * item.quantity;
      return totalSavings + (originalPrice - discountedPrice);
    }, 0);
  }
}
