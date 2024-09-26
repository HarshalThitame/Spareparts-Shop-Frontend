import { Product } from "./Product.model";
import {User} from "./User.model";

export interface Wishlist {
  id: number;                       // Corresponds to Long in Java
  user: User;                       // Reference to the User interface
  products: Product[];              // Assuming Product is another interface
}
