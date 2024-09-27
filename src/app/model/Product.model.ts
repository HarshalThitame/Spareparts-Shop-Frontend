import { Image } from "./Image.model";
import { Category } from "./Category.model";
import { SubCategory } from "./SubCategory.model";
import { SubSubCategory } from "./SubSubCategory.model";
import { Review } from "./Review.model";
import { Brand } from "./Brand.model";
import { BrandModel } from "./BrandModel.model";

export interface Product {
  id: number;                             // Corresponds to Long in Java
  name: string;                           // Name of the product
  description: string;                    // Description of the product
  price: number;                          // Price of the product
  partNumber: string;                     // Unique identifier for spare parts
  moq: number;                            // Minimum order quantity
  binLocation?: string;                   // Optional field for storage location
  discountOnPurchase: number;             // Discount on purchase
  discountToCounter: number;              // Discount for counter sales
  discountToMechanics: number;            // Discount for mechanics
  discountToRetailer: number;             // Discount for retailers
  stockQuantity: number;                  // Quantity in stock
  mainImage?: string;                     // Optional field for the main image URL
  weight: number;                         // Weight of the product
  dimensions?: string;                    // Optional field for dimensions
  material?: string;                      // Optional field for material
  isPublishedForCustomer: boolean;        // Indicates if published for customer
  isPublishedForRetailer: boolean;        // Indicates if published for retailer
  isPublishedForMechanic: boolean;        // Indicates if published for mechanic
  isBlocked: boolean;                     // Indicates if the product is blocked
  images?: Image[];                       // Array of images associated with the product
  brands: Brand[];                        // Associated brands
  brandModels: BrandModel[];              // Compatible vehicle models
  categories?: Category[];                // Associated categories
  subCategories?: SubCategory[];          // Associated subcategories
  subSubCategories?: SubSubCategory[];    // Associated sub-subcategories
  createdAt: string;                      // Creation timestamp in ISO string format
  updatedAt: string;                      // Update timestamp in ISO string format
  reviews?: Review[];                     // Array of reviews for the product
  gst?:number
}
