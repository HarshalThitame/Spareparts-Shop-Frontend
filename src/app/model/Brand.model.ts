import { BrandModel } from "./BrandModel.model";

export interface Brand {
  id?: number; // Optional if not provided during creation
  name: string; // Brand name
  brandModels: BrandModel[]; // List of BrandModels associated with this Brand
}
