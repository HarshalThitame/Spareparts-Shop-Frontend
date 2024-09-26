import {Product} from "./Product.model";

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
  unitPrice: number;
}
