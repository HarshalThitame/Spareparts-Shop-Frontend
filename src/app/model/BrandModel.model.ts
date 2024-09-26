import {Brand} from "./Brand.model";

export interface BrandModel {
  id?: number; // Optional if not provided during creation
  name: string; // Model name
  brand?: Brand; // Optional reference back to Brand
}
