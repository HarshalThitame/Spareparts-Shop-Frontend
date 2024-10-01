import { User } from "./User.model"; // Assuming you have a User interface

export interface ShippingAddress {
  id?: number;                          // Corresponds to Long in Java
  recipientName: string;               // Name of the recipient
  addressLine1: string;                // Primary address line
  addressLine2?: string;               // Optional secondary address line
  email?:string;
  mobile:string;
  city: string;                        // City of the recipient
  state: string;                       // State of the recipient
  postalCode: string;                  // Postal code
  user?: User;                        // Link to the associated User (optional)
  createdAt?: string;                   // Creation timestamp in ISO string format
  updatedAt?: string;                   // Update timestamp in ISO string format
}
