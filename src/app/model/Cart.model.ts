import {CartItem} from "./CartItem.model";

export interface Cart {
  user: {
    id: number; // User ID
  };
  items: CartItem[];
  totalAmount: number;
}
