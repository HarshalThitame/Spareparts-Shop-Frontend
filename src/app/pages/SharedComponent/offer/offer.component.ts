import {Component, OnInit} from '@angular/core';
import {Offer} from "../../../model/Offer.model";
import {OfferService} from "../../../service/AdminService/offer.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent implements OnInit{
  currentIndex = 0;
  slideshowInterval: any;
  activatedOffers:Offer[]=[];
constructor(private _offerService:OfferService,
            private _router:Router) {
}

  ngOnInit(): void {
    this.loadActivatedOffers();
    this.startSlideshow();
  }


  startSlideshow() {
    this.slideshowInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.activatedOffers.length;
    }, 2000); // Change slide every 2 seconds
  }

  get currentProduct() {
    return this.activatedOffers[this.currentIndex];
  }

  loadActivatedOffers() {
      this._offerService.getActiveOffersForUsers().subscribe(data=>{
        this.activatedOffers = data;
        console.log(data)
      })
  }

  selectOffer(offer: Offer) {
    this._router.navigate(['/product-offer/'+offer.id])
  }
}
