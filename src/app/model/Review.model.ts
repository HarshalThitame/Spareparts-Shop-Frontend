import {User} from "./User.model";
import {Product} from "./Product.model";

export interface Review {
  id: number;                     // Corresponds to Long in Java
  product: Product;               // Reference to the Product interface
  user: User;                     // Reference to the User interface
  rating: number;                 // Rating from 1 to 5
  comment?: string;               // Optional comment
  reviewDate: string;             // Use string for ISO date string representation
}
