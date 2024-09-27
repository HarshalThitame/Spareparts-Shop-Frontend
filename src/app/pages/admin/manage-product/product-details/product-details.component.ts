import {Component, OnInit} from '@angular/core';
import {LoginService} from "../../../../service/login.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../../service/product.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  id: any;
  user: any;
  product: any;
  newReview: any;

  compatibilityData = [
    { model: 'CIAZ 1ST GEN 1.3L VDI', year: '07.2014 - 07.2015', engine: '1.3 L', power: '88 h.p.', fuelType: 'Diesel', engineType: 'D13A' },
    { model: 'CIAZ 1ST GEN 1.4L VXI', year: '07.2014 - 07.2018', engine: '1.4 L', power: '91 h.p.', fuelType: 'Petrol', engineType: 'K14B' },
    { model: 'CIAZ 1ST GEN 1.4L VXI AT', year: '07.2014 - 07.2018', engine: '1.4 L', power: '91 h.p.', fuelType: 'Petrol', engineType: 'K14B' },
  ];


  constructor(private _loginService: LoginService,
              private _router: Router,
              private _productService: ProductService,
              private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');

    this.loadUser();
    this.loadProduct(this.id)
  }

  loadUser() {
    this._loginService.getCurrentUser().subscribe(data => {
      this.user = data;
    })
  }

  loadProduct(id: any) {
    this._productService.getProductById(id).subscribe(data=>{
      this.product = data;
      console.log(this.product)
    })
  }

  submitReview() {

  }
}
