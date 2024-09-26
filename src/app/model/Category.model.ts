import {Product} from "./Product.model";
import {SubCategory} from "./SubCategory.model";

export interface Category {
  id: number;                     // Corresponds to Long in Java
  name: string;                  // Category name
  description: string;          // Optional description
  categoryImage: string;        // Optional image URL for the category
  products?: Product[];          // Optional list of products associated with this category
  subCategories: SubCategory[];  // Optional list of subcategories
}
