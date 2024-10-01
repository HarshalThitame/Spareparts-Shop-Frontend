import {Cart} from "./Cart.model";
import {Wishlist} from "./Wishlist.model";
import {Review} from "./Review.model";
import {ShippingAddress} from "./ShippingAddress.model";

export interface User {
  id: number;                       // Corresponds to Long in Java
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;                 // Consider omitting this in a public interface for security
  userRole: 'ADMIN' | 'CUSTOMER' | 'RETAILER' | 'MECHANIC'; // Enum equivalent
  phoneNumber?: string;             // Optional fields
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  isActive: boolean;
  createdAt: string;                // Use string if you're working with ISO date strings
  updatedAt: string;                // Same as above
  // status?:string;
  cart?: Cart;                      // Assuming Cart is another interface
  wishlist?: Wishlist;              // Assuming Wishlist is another interface
  reviews?: Review[];               // Assuming Review is another interface
  savedAddresses?:ShippingAddress[]
}
