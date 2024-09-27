import { Injectable } from '@angular/core';
import { Cart } from '../model/Cart.model'; // Adjust the import path as necessary
import { CartItem } from '../model/CartItem.model'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = { user: { id: 0 }, items: [], totalAmount: 0 };

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('temporaryCart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  addToTemporaryCart(item: CartItem): void {
    // Check if the item already exists in the cart
    const existingItem = this.cart.items.find(cartItem => cartItem.product.id === item.product.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.totalPrice += item.totalPrice;
    } else {
      this.cart.items.push(item);
    }

    this.cart.totalAmount = this.calculateTotalAmount();
    this.saveCartToLocalStorage();
  }

  private calculateTotalAmount(): number {
    return this.cart.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('temporaryCart', JSON.stringify(this.cart));
  }

  getTemporaryCart(): Cart {
    return this.cart;
  }

  clearTemporaryCart(): void {
    this.cart = { user: { id: 0 }, items: [], totalAmount: 0 };
    localStorage.removeItem('temporaryCart');
  }

  // Optional: remove item from temporary cart
  removeFromTemporaryCart(productId: number): void {
    this.cart.items = this.cart.items.filter(item => item.product.id !== productId);
    this.cart.totalAmount = this.calculateTotalAmount();
    this.saveCartToLocalStorage();
  }
}
