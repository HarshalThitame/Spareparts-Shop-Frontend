import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerAllProductsComponent } from './retailer-all-products.component';

describe('RetailerAllProductsComponent', () => {
  let component: RetailerAllProductsComponent;
  let fixture: ComponentFixture<RetailerAllProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetailerAllProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerAllProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
