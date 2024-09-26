import { User } from "./User.model";              // Assuming you have a User interface
import { ShippingAddress } from "./ShippingAddress.model"; // Assuming you have a ShippingAddress interface
import { OrderItem } from "./OrderItem.model";    // Assuming you have an OrderItem interface
import { OrderStatus } from "./OrderStatus.model"; // Assuming you have an OrderStatus enum

export interface Order {
  id?: number;                                        // Corresponds to Long in Java
  user: User;                                       // Reference to the User entity
  status: OrderStatus;                              // Enum for order status (e.g., PENDING, PAID, SHIPPED, etc.)
  totalAmount: number;                              // Total amount for the order
  shippingAddress: ShippingAddress;                 // Shipping address for the order
  orderItems: OrderItem[];                          // List of order items
  discountAmount: number;                            // Total discount applied
  shippingCost: number;                             // Cost of shipping
  createdAt?: string;                                // Creation timestamp in ISO string format
  updatedAt?: string;                                // Update timestamp in ISO string format
  cancellationReason?: string;                      // Reason for cancellation (if applicable)
  notes?: string;                                   // Additional notes/comments
  isVor?:boolean;
  isViewed?:boolean;
}
