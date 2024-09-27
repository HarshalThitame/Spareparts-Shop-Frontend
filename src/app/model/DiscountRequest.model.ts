// discount-request.model.ts
export interface DiscountRequest {
  product: any;  // Change 'any' to the appropriate type for your product
  retailerDiscount?: number | null;
  mechanicDiscount?: number | null;
  customerDiscount?: number | null;
}
