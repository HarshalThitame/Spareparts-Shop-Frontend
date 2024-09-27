import {Product} from "./Product.model";

export interface Offer {
  id?: number;
  title: string;
  description: string;
  discount: number;
  startDate: string;  // Or LocalDateTime if you're handling date formatting
  endDate: string;
  imageUrl: string;  // URL of the offer's image
  products:Product[]
}
