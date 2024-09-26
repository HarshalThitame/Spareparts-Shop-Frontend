import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {HttpClientModule, provideHttpClient} from '@angular/common/http'; // Import HttpClientModule

import { AppComponent } from './app.component';
import {LoginComponent} from "./components/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app.routes";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {HomeDashboardComponent} from "./pages/home-dashboard/home-dashboard.component";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {authInterceptorProviders} from "./guards/auth.interceptor";
import {SignupComponent} from "./components/signup/signup.component";
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import {AdminDashboardComponent} from "./pages/admin/admin-dashboard/admin-dashboard.component";
import { AdminSidebarComponent } from './pages/admin/admin-sidebar/admin-sidebar.component';
import { AddProductComponent } from './pages/admin/add-product/add-product.component';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import { ManageProductComponent } from './pages/admin/manage-product/manage-product.component';
import { ProductDetailsComponent } from './pages/admin/manage-product/product-details/product-details.component';
import {MaskPartNumberPipe} from "./pipe/mask-part-number.pipe";
import {OfferComponent} from "./pages/SharedComponent/offer/offer.component";
import { CustomerProductDetailsComponent } from './pages/customer/customer-product-details/customer-product-details.component';
import { CustomerCartComponent } from './pages/customer/customer-cart/customer-cart.component';
import { RetailerDashboardComponent } from './pages/retailer/retailer-dashboard/retailer-dashboard.component';
import { RetailerNavbarComponent } from './components/navbar/retailer-navbar/retailer-navbar.component';
import { MechanicNavbarComponent } from './components/navbar/mechanic-navbar/mechanic-navbar.component';
import { AdminNavbarComponent } from './components/navbar/admin-navbar/admin-navbar.component';
import { MechanicDashboardComponent } from './pages/mecahnic/mechanic-dashboard/mechanic-dashboard.component';
import { SharedCategoriesComponent } from './pages/SharedComponent/shared-categories/shared-categories.component';
import { SharedSubCategoriesComponent } from './pages/SharedComponent/shared-sub-categories/shared-sub-categories.component';
import { RetailerProductDetailsComponent } from './pages/retailer/retailer-product-details/retailer-product-details.component';
import { MechanicProductDetailsComponent } from './pages/mecahnic/mechanic-product-details/mechanic-product-details.component';
import { CartComponent } from './pages/SharedComponent/cart/cart.component';
import { RetailerCartComponent } from './pages/retailer/retailer-cart/retailer-cart.component';
import { MechanicCartComponent } from './pages/mecahnic/mechanic-cart/mechanic-cart.component';
import { AdminManageCategoriesComponent } from './pages/admin/admin-manage-categories/admin-manage-categories.component';
import { AdminManageBrandsComponent } from './pages/admin/admin-manage-brands/admin-manage-brands.component';
import { CustomerAllProductsComponent } from './pages/customer/customer-all-products/customer-all-products.component';
import { MechanicAllProductsComponent } from './pages/mecahnic/mechanic-all-products/mechanic-all-products.component';
import { RetailerAllProductsComponent } from './pages/retailer/retailer-all-products/retailer-all-products.component';
import { FooterComponent } from './components/footer/footer.component';
import {MatCard, MatCardActions, MatCardFooter, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import { GeneralCartComponent } from './components/general-cart/general-cart.component';
import { DropdownSearchComponent } from './pages/SharedComponent/dropdown-search/dropdown-search.component';
import { CustomerCheckoutComponent } from './pages/customer/customer-checkout/customer-checkout.component';
import { CheckoutComponent } from './pages/SharedComponent/checkout/checkout.component';
import { MyOrdersComponent } from './pages/SharedComponent/my-orders/my-orders.component';
import { MyOrderDetailsComponent } from './pages/SharedComponent/my-orders/my-order-details/my-order-details.component';
import { AdminManageOrdersComponent } from './pages/admin/admin-manage-orders/admin-manage-orders.component';
import { AdminViewOrderDetailsComponent } from './pages/admin/admin-manage-orders/admin-view-order-details/admin-view-order-details.component';
import { AdminEditOrderDetailsComponent } from './pages/admin/admin-manage-orders/admin-edit-order-details/admin-edit-order-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeDashboardComponent,
    SignupComponent,
    ForgotPasswordComponent,
    AdminDashboardComponent,
    AdminSidebarComponent,
    AddProductComponent,
    ManageProductComponent,
    ProductDetailsComponent,
    MaskPartNumberPipe,
    OfferComponent,
    CustomerProductDetailsComponent,
    CustomerCartComponent,
    RetailerDashboardComponent,
    RetailerNavbarComponent,
    MechanicNavbarComponent,
    AdminNavbarComponent,
    MechanicDashboardComponent,
    SharedCategoriesComponent,
    SharedSubCategoriesComponent,
    RetailerProductDetailsComponent,
    MechanicProductDetailsComponent,
    CartComponent,
    RetailerCartComponent,
    MechanicCartComponent,
    AdminManageCategoriesComponent,
    AdminManageBrandsComponent,
    CustomerAllProductsComponent,
    MechanicAllProductsComponent,
    RetailerAllProductsComponent,
    FooterComponent,
    GeneralCartComponent,
    DropdownSearchComponent,
    CustomerCheckoutComponent,
    CheckoutComponent,
    MyOrdersComponent,
    MyOrderDetailsComponent,
    AdminManageOrdersComponent,
    AdminViewOrderDetailsComponent,
    AdminEditOrderDetailsComponent,
  ],
  imports: [
    AppRoutingModule, // Ensure your routing module is included here
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButton,
    MatInput,
    MatLabel,
    MatFormField,
    FormsModule,
    MatCardTitle,
    MatCardSubtitle,
    MatCard,
    MatCardActions,
    MatCardFooter,
    // Include HttpClientModule here
    // Add other modules here
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
  providers: [provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    authInterceptorProviders],
  exports: [
    NavbarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
