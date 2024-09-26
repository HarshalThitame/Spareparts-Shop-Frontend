import {Product} from "./Product.model";
import {Category} from "./Category.model";
import {SubSubCategory} from "./SubSubCategory.model";

export interface SubCategory {
  id: number;                          // Corresponds to Long in Java
  name: string;                        // Subcategory name
  description?: string;                // Optional description
  subCategoryImage?: string;           // Optional image URL for the subcategory
  category: Category;                  // Reference to the Category interface
  subSubCategories?: SubSubCategory[]; // Optional list of sub-subcategories
  products?: Product[];                // Optional list of products associated with this subcategory
}
