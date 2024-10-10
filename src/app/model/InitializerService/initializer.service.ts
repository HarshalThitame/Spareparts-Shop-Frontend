import {Injectable} from '@angular/core';
import {User} from "../User.model";
import {Cart} from "../Cart.model";
import {CartItem} from "../CartItem.model";
import {Product} from "../Product.model";
import {Category} from "../Category.model";
import {SubCategory} from "../SubCategory.model";
import {BrandModel} from "../BrandModel.model";
import {Brand} from "../Brand.model";
import {ShippingAddress} from "../ShippingAddress.model";
import {Order} from "../Order.model";
import {OrderStatus} from "../OrderStatus.model";
import {OrderItem} from "../OrderItem.model";
import {Offer} from "../Offer.model";

@Injectable({
  providedIn: 'root'
})
export class InitializerService {

  constructor() {
  }

  initializeUser(): User {
    return {
      id: 0,
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      userRole: 'CUSTOMER',
      isActive: false,
      createdAt: '',
      updatedAt: ''
    };
  }

  initializeCart(): Cart {
    return {
      user: {id: 0},
      items: [],
      totalAmount: 0
    };
  }

  initializeProduct(): Product {
    return {
      blocked: false,
      isPublishedForCustomer: false,
      isPublishedForMechanic: false,
      isPublishedForRetailer: false,
      brandModels: [], brands: [],
      moq: 1,
      categories: [],
      subCategories: [],
      subSubCategories: [],
      discountOnPurchase: 0,
      discountToCounter: 0,
      discountToMechanics: 0,
      discountToRetailer: 0,
      id: 0,
      name: '',
      description: '',
      price: 0,
      partNumber: '',
      stockQuantity: 0,
      weight: 0,
      createdAt: '',
      updatedAt: ''
    }
  }

  initializeCartItems(): CartItem {
    return {
      product: this.initializeProduct(), quantity: 0, totalPrice: 0, unitPrice: 0
    }
  }

  initializeCategory(): Category {

    return {
      subCategories: [],
      categoryImage: "",
      description: "",
      id: 0,
      name: ""
    }
  }

  initializeSubCategory(): SubCategory {
    return {
      category: this.initializeCategory(),
      description: "",
      id: 0,
      name: "",
      products: [],
      subCategoryImage: "",
      subSubCategories: []

    }
  }

  initializeBrandModels(): BrandModel {
    return {
      name: ""

    }
  }

  initializeBrand(): Brand {
    return {
      brandModels: [],
      name: ""

    }
  }

  initializeShippingAddress(): ShippingAddress {
    return {
      email: "", mobile: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      id: 0,
      postalCode: "",
      recipientName: "",
      state: "",
      user: this.initializeUser()

    };
  }

  initializeOrder(): Order {
    return {
      discountAmount: 0,
      orderItems: [],
      shippingAddress: this.initializeShippingAddress(),
      shippingCost: 0,
      status: OrderStatus.PENDING,
      totalAmount: 0,
      user: this.initializeUser(),
      isVor: false,
      isViewed: false
    };
  }

  initializeOrderItems(): OrderItem {
    return {
      discountOnPurchase: 0, discountToMechanics: 0, discountToRetailer: 0, gst: 0,
      discountAmount: 0,
      price: 0,
      product: this.initializeProduct(),
      quantity: 0,
      subtotal: 0,
      taxAmount: 0,
      totalPrice: 0


    }
  }

  initializeOffer(): Offer {
    return {description: "", discount: 0, endDate: "", id: 0, imageUrl: "", products: [], startDate: "", title: ""};
  }
}
