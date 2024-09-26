import {Product} from "./Product.model";

export interface OrderItem {
  id?: number;                           // Corresponds to Long in Java
  // order: Order;                         // Link to the associated Order.model.ts
  product: Product;                     // Link to the associated Product
  quantity: number;                     // Number of units ordered
  price: number;                        // Price of the product at the time of the order
  subtotal: number;                     // Total cost before any discounts
  discountAmount: number;               // Discount applied to this item
  totalPrice: number;                   // Final price after discount
  taxAmount: number;                    // Tax applied to this item
  }
