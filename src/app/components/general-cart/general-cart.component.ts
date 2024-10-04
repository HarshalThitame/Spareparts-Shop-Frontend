import {Component, OnInit} from '@angular/core';
import {Cart} from "../../model/Cart.model";
import {CartItem} from "../../model/CartItem.model";
import {Product} from "../../model/Product.model";
import NoImage from "../../service/helper/noImage";

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
    console.log(this.cart)
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
    return this.getSubtotal() - this.getTotalSavings()
  }

  getDiscountedPrice(product: Product): number {
    return product.price - (product.price * this.getDiscount(product) / 100);
  }

  getDiscount(product: Product): number {
    return product.discountOnPurchase;
  }
  getTotalSavings(): number {
    return this.cart.items.reduce((totalSavings, item) => {
      const originalPrice = item.product.price * item.quantity;
      const discountedPrice = this.getDiscountedPrice(item.product) * item.quantity;
      return totalSavings + (originalPrice - discountedPrice);
    }, 0);
  }


  calculateGst(product: Product, qty: number): number {
    // Ensure product.gst has a default value if undefined
    const gstRate = product.gst || 0; // Use 0 if product.gst is undefined
    // Calculate the discounted price first
    const discountedPrice = this.getDiscountedPrice(product);
    // Calculate the GST amount for the specified quantity
    const gstAmountPerItem = discountedPrice * (gstRate / 100);
    // Total GST for the specified quantity
    return gstAmountPerItem * qty; // Return the total GST
  }


  getGst() {
    return this.cart.items.reduce((sum, item) => sum + (this.calculateGst(item.product, item.quantity) || 0), 0);
  }

  getTotal() {
    return this.getTotalPriceAfterDiscounts()+this.getGst();
  }

  getSubtotal() {
    return this.cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }

  protected readonly NoImage = NoImage;
}
