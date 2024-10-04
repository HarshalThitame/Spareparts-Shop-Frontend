import {Component, OnInit} from '@angular/core';
import {OfferComponent} from "../offer.component";
import {Offer} from "../../../../model/Offer.model";
import {InitializerService} from "../../../../model/InitializerService/initializer.service";
import {Product} from "../../../../model/Product.model";
import {ActivatedRoute} from "@angular/router";
import {OfferService} from "../../../../service/AdminService/offer.service";
import {LoginService} from "../../../../service/login.service";
import {User} from "../../../../model/User.model";

@Component({
  selector: 'app-product-offer',
  templateUrl: './product-offer.component.html',
  styleUrl: './product-offer.component.css'
})
export class ProductOfferComponent implements OnInit{

  id:any;
  offer:Offer;
  products:Product[]=[]
  user: User;

  constructor(private _initializerService:InitializerService,
              private _route:ActivatedRoute,
              private _offerService:OfferService,
              private _loginService:LoginService) {
    this.offer = this._initializerService.initializeOffer();
    this.user = _initializerService.initializeUser();
  }

    ngOnInit(): void {
      this.id = this._route.snapshot.paramMap.get('id');
      this.loadUser()
      this.loadOfferProducts();
    }

  loadUser() {
        this._loginService.getCurrentUser().subscribe(data=>{
          this.user = data;
        })
    }

  loadOfferProducts() {
        this._offerService.getActiveOffer(this.id).subscribe(data=>{
          this.offer = data;
          this.products = this.offer.products;
          console.log(data)
        },error => {
          console.log(error)
        })
    }

  getDiscountedPrice(product: Product) {
    return product.price - (product.price * this.offer.discount / 100);
  }


  getDiscount(product: Product) {
    return "";
  }
}
