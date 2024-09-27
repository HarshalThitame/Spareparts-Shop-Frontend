import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAllProductsComponent } from './customer-all-products.component';

describe('CustomerAllProductsComponent', () => {
  let component: CustomerAllProductsComponent;
  let fixture: ComponentFixture<CustomerAllProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerAllProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAllProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
