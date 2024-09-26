import {Product} from "./Product.model";

export interface Image {
  id: number;                  // Corresponds to Long in Java
  url: string;                // URL of the image
  product: Product;           // Reference to the Product interface
  createdAt: string;          // Use string for ISO date string representation
}
