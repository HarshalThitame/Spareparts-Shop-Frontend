import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {HomeDashboardComponent} from "./pages/home-dashboard/home-dashboard.component";
import {SignupComponent} from "./components/signup/signup.component";
import {adminGuard} from "./guards/admin.guard"
import {AdminDashboardComponent} from "./pages/admin/admin-dashboard/admin-dashboard.component";
import {AddProductComponent} from "./pages/admin/add-product/add-product.component";
import {ManageProductComponent} from "./pages/admin/manage-product/manage-product.component";
import {ProductDetailsComponent} from "./pages/admin/manage-product/product-details/product-details.component";
import {
  CustomerProductDetailsComponent
} from "./pages/customer/customer-product-details/customer-product-details.component";
import {CustomerCartComponent} from "./pages/customer/customer-cart/customer-cart.component";
import {customerGuard} from "./guards/customer.guard";
import {AuthGuard} from "./guards/auth.guard";
import {RetailerDashboardComponent} from "./pages/retailer/retailer-dashboard/retailer-dashboard.component";
import {retailerGuard} from "./guards/retailer.guard";
import {MechanicDashboardComponent} from "./pages/mecahnic/mechanic-dashboard/mechanic-dashboard.component";
import {mechanicGuard} from "./guards/mechanic.guard";
import {
  RetailerProductDetailsComponent
} from "./pages/retailer/retailer-product-details/retailer-product-details.component";
import {
  MechanicProductDetailsComponent
} from "./pages/mecahnic/mechanic-product-details/mechanic-product-details.component";
import {RetailerCartComponent} from "./pages/retailer/retailer-cart/retailer-cart.component";
import {MechanicCartComponent} from "./pages/mecahnic/mechanic-cart/mechanic-cart.component";
import {AdminManageCategoriesComponent} from "./pages/admin/admin-manage-categories/admin-manage-categories.component";
import {AdminManageBrandsComponent} from "./pages/admin/admin-manage-brands/admin-manage-brands.component";
import {
  SharedSubCategoriesComponent
} from "./pages/SharedComponent/shared-sub-categories/shared-sub-categories.component";
import {CustomerAllProductsComponent} from "./pages/customer/customer-all-products/customer-all-products.component";
import {RetailerAllProductsComponent} from "./pages/retailer/retailer-all-products/retailer-all-products.component";
import {MechanicAllProductsComponent} from "./pages/mecahnic/mechanic-all-products/mechanic-all-products.component";
import {GeneralCartComponent} from "./components/general-cart/general-cart.component";
import {CheckoutComponent} from "./pages/SharedComponent/checkout/checkout.component";
import {MyOrdersComponent} from "./pages/SharedComponent/my-orders/my-orders.component";
import {MyOrderDetailsComponent} from "./pages/SharedComponent/my-orders/my-order-details/my-order-details.component";
import {AdminManageOrdersComponent} from "./pages/admin/admin-manage-orders/admin-manage-orders.component";
import {
  AdminViewOrderDetailsComponent
} from "./pages/admin/admin-manage-orders/admin-view-order-details/admin-view-order-details.component";
import {
  AdminEditOrderDetailsComponent
} from "./pages/admin/admin-manage-orders/admin-edit-order-details/admin-edit-order-details.component";
import {AdminEditProductComponent} from "./pages/admin/manage-product/admin-edit-product/admin-edit-product.component";
import {PRINT_SCREEN} from "@angular/cdk/keycodes";
import {OrderInvoiceComponent} from "./pages/SharedComponent/order-invoice/order-invoice.component";
import {AdminDiscountComponent} from "./pages/admin/promotion/admin-discount/admin-discount.component";
import {AdminOffersComponent} from "./pages/admin/promotion/admin-offers/admin-offers.component";
import {AdminManageCustomersComponent} from "./pages/admin/admin-manage-customers/admin-manage-customers.component";
import { AdminAlertComponent } from './pages/admin/admin-alert/admin-alert.component';
import {ProductOfferComponent} from "./pages/SharedComponent/offer/product-offer/product-offer.component";
import {ErrorComponent} from "./components/error/error.component";
import {ProfileComponent} from "./pages/SharedComponent/profile/profile.component";
import {AboutComponent} from "./components/about/about.component";
import {ContactComponent} from "./components/contact/contact.component";
import {AdminNewOrdersComponent} from "./pages/admin/admin-manage-orders/admin-new-orders/admin-new-orders.component";
import {AdminVorOrdersComponent} from "./pages/admin/admin-manage-orders/admin-vor-orders/admin-vor-orders.component";
import {
  AdminCancelledOrdersComponent
} from "./pages/admin/admin-manage-orders/admin-cancelled-orders/admin-cancelled-orders.component";
import {
  AdminUnpaidOrdersComponent
} from "./pages/admin/admin-manage-orders/admin-unpaid-orders/admin-unpaid-orders.component";
import {
  AdminCustomerDetailsComponent
} from "./pages/admin/admin-manage-customers/admin-customer-details/admin-customer-details.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {PrivacyPolicyComponent} from "./components/privacy-policy/privacy-policy.component";

const routes: Routes = [
  {path: '', component: HomeDashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'signup', component: SignupComponent},
  {path :'cart', component:GeneralCartComponent},
  {path :'profile',component:ProfileComponent},
  {path : 'about', component : AboutComponent},
  {path : 'contact', component : ContactComponent},
  {path : 'privacy-policy', component : PrivacyPolicyComponent},
  {
    path: 'category/sub-category/:id',
    component: SharedSubCategoriesComponent
  },
  {
    path:'category/sub-category/all-products/:id',
    component: CustomerAllProductsComponent
  },
  {
    path: 'category/sub-category/sub-sub-category/product-details/:id',
    component: CustomerProductDetailsComponent
  },
  {
    path:'product-offer/:id',
    component:ProductOfferComponent
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        // pathMatch:'full'
      },
      {
        path: 'add-product',
        component: AddProductComponent
      },
      {
        path: 'manage-products',
        component: ManageProductComponent
      },
      {
        path: 'manage-products/product-details/:id',
        component: ProductDetailsComponent
      },
      {
        path: 'manage-categories',
        component: AdminManageCategoriesComponent
      },
      {
        path: 'manage-customers',
        component: AdminManageCustomersComponent
      },
      {
        path: 'manage-customers/customer-details/:id',
        component: AdminCustomerDetailsComponent
      },
      {
        path: 'manage-brands',
        component: AdminManageBrandsComponent
      },
      {
        path: 'manage-orders',
        component: AdminManageOrdersComponent,
      },
      {
        path: 'manage-new-orders',
        component: AdminNewOrdersComponent
      },
      {
        path: 'manage-cancelled-orders',
        component: AdminCancelledOrdersComponent
      },
      {
        path: 'manage-unpaid-orders',
        component: AdminUnpaidOrdersComponent
      },
      {
        path: 'manage-vor-orders',
        component: AdminVorOrdersComponent
      },
      {
        path: 'manage-orders/view-order-details/:id',
        component: AdminViewOrderDetailsComponent
      },
      {
        path: 'manage-orders/edit-order-details/:id',
        component: AdminEditOrderDetailsComponent
      },
      {
        path: 'promotion-discount',
        component: AdminDiscountComponent
      },
      {
        path: 'promotion-offers',
        component: AdminOffersComponent
      },
      {
        path: 'edit-product/:id',
        component: AdminEditProductComponent
      },
      {
        path:'print-invoice',
        component: OrderInvoiceComponent
      },
      {
        path: 'alert',
        component:AdminAlertComponent
      }
    ]
  }, {
    path: 'customer',
    children: [
      {
        path: 'cart',
        component: CustomerCartComponent,
        canActivate: [AuthGuard, customerGuard]
      },
      {
        path :'my-order',
        component:MyOrdersComponent
      },
      {
        path :'my-order/order-details/:id',
        component:MyOrderDetailsComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      }
    ]
  },
  {
    path: 'retailer',
    canActivate: [retailerGuard],
    children:[
      {
        path: '',
        component: RetailerDashboardComponent
      },
      {
        path:'category/sub-category/all-products/:id',
        component: RetailerAllProductsComponent
      },
      {
        path: 'cart',
        component: RetailerCartComponent
      },
      {
        path :'my-order',
        component:MyOrdersComponent
      },
      {
        path :'my-order/order-details/:id',
        component:MyOrderDetailsComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      }
      ,
      {
        path: 'category/sub-category/sub-sub-category/product-details/:id',
        component: RetailerProductDetailsComponent
      }
    ]
  },
  {
    path:'mechanic',
    canActivate:[mechanicGuard],
    children:[
      {
        path: '',
        component: MechanicDashboardComponent
      },
      {
        path:'category/sub-category/all-products/:id',
        component: MechanicAllProductsComponent
      },
      {
        path: 'cart',
        component: MechanicCartComponent
      },
      {
        path :'my-order',
        component:MyOrdersComponent
      },
      {
        path :'my-order/order-details/:id',
        component:MyOrderDetailsComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'category/sub-category/sub-sub-category/product-details/:id',
        component: MechanicProductDetailsComponent
      }
    ]
  },
  {path : '**', component:ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
