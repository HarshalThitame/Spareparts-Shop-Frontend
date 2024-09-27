import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent implements OnInit{
  currentIndex = 0;
  slideshowInterval: any;

  ngOnInit(): void {
    this.startSlideshow();
  }
  products = [
    {
      id: 1,
      name: 'Special Brake Pad',
      description: 'High-quality brake pad on offer!',
      price: 49.99,
      image: 'https://via.placeholder.com/300',
      type: 'offer'
    },
    {
      id: 2,
      name: 'Engine Oil',
      description: 'Premium quality engine oil',
      price: 29.99,
      image: 'https://via.placeholder.com/300',
      type: 'product'
    },
    {
      id: 3,
      name: 'Winter Tires',
      description: 'Durable winter tires for harsh conditions',
      price: 99.99,
      image: 'https://via.placeholder.com/300',
      type: 'product'
    }
  ];

  startSlideshow() {
    this.slideshowInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.products.length;
    }, 2000); // Change slide every 2 seconds
  }

  get currentProduct() {
    return this.products[this.currentIndex];
  }
}
