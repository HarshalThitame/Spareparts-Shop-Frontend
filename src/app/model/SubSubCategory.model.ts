import {Product} from "./Product.model";
import {SubCategory} from "./SubCategory.model";

export interface SubSubCategory {
  id: number;                          // Corresponds to Long in Java
  name: string;                        // Sub-subcategory name
  description?: string;                // Optional description
  subSubCategoryImage?: string;        // Optional image URL for the sub-subcategory
  subCategory: SubCategory;            // Reference to the SubCategory interface
  products?: Product[];                // Optional list of products associated with this sub-subcategory
}
