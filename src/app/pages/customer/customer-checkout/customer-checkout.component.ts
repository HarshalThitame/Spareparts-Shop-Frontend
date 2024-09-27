import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-customer-checkout',
  templateUrl: './customer-checkout.component.html',
  styleUrl: './customer-checkout.component.css'
})
export class CustomerCheckoutComponent implements OnInit {
  shippingForm: FormGroup|any;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.shippingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
    });

  }

  onSubmitShipping() {
    if (this.shippingForm.valid) {
      console.log('Shipping Information:', this.shippingForm.value);
    }
  }


}
