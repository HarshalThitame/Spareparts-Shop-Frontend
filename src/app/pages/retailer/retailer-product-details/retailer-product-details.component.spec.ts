import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerProductDetailsComponent } from './retailer-product-details.component';

describe('RetailerProductDetailsComponent', () => {
  let component: RetailerProductDetailsComponent;
  let fixture: ComponentFixture<RetailerProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetailerProductDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
