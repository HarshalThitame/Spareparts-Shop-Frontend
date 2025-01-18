import {Component, OnInit} from '@angular/core';
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {ActivatedRoute} from "@angular/router";
import {OfferService} from "../../../../service/AdminService/offer.service";
import {LoginService} from "../../../../service/login.service";
import {AdminCustomerService} from "../../../../service/AdminService/admin-customer.service";
import {User} from "../../../../model/User.model";
import NoImage from "../../../../service/helper/noImage";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Redemption {
  date: string;
  points: number;
}

@Component({
  selector: 'app-admin-customer-details',
  templateUrl: './admin-customer-details.component.html',
  styleUrl: './admin-customer-details.component.css'
})
export class AdminCustomerDetailsComponent implements OnInit {
  customer: User;

  totalOrders: number = 0;
  totalSpent: number = 0; // In currency
  averageOrderValue: number = 0;
  timeSpent: number = 0; // Time spent in minutes
  pagesVisited: number = 15;
  averageRating: number = 4.5; // Average rating out of 5
  reviewCount: number = 10; // Number of reviews submitted
  pointsAccumulated: number = 250; // Points accumulated for loyalty
  mostPurchasedItems: OrderItem[] =[]
  viewedProducts: { name: string }[] = [
    {name: 'Air Filter'},
    {name: 'Windshield Wipers'},
    {name: 'Battery'},
  ];
  redemptions: Redemption[] = [
    {date: '2024-01-15', points: 50},
    {date: '2024-03-20', points: 100},
    {date: '2024-05-10', points: 75},
  ];
  supportTicketsRaised: number = 3;
  averageResponseTime: number = 15; // In minutes
  emailEngagementRate: number = 75; // Percentage
  returnedOrders: number = 2; // Number of returned orders
  cancellationTrends: string = 'Stable'; // Description of cancellation trends
  recommendations: { name: string }[] = [
    {name: 'Premium Brake Pads'},
    {name: 'Synthetic Oil'},
    {name: 'LED Headlights'},
  ];
  private id: any;

  constructor(private _initializerService: InitializerService,
              private _route: ActivatedRoute,
              private _adminCustomerService: AdminCustomerService,
              private _loginService: LoginService) {
    this.customer = _initializerService.initializeUser();
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    this.loadUser();
  }

  loadUser() {
    this._adminCustomerService.getUserById(this.id).subscribe(data => {
      this.customer = data;
      this.timeSpent = this.customer.totalTimeSpent||0;
      this.loadOrderHistory()
      this.loadMostPurchasedProducts();
    })
  }

  loadMostPurchasedProducts() {
    this._adminCustomerService.getMostPurchasedProducts(this.customer.id).subscribe(data => {
      console.log(data)
      for (let i = 0; i < data.length; i++) {

        const mostPurchasedProduct:OrderItem = {name:data[i][1],quantity:data[i][2]}
        this.mostPurchasedItems.push(mostPurchasedProduct)
      }
    });
    }

  loadOrderHistory() {
    this._adminCustomerService.getOrderHistory(this.customer.id).subscribe(data => {
      console.log(data)
      // Check if data is available
      if (data && data.length > 0) {
        this.totalOrders = data[0][0];
        this.totalSpent = data[0][1]
        this.averageOrderValue = this.totalSpent/this.totalOrders;

      } else {
        // Handle case where there are no orders
        this.totalOrders = 0;
        this.totalSpent = 0;
      }
    });
  }

  protected readonly NoImage = NoImage;
}
