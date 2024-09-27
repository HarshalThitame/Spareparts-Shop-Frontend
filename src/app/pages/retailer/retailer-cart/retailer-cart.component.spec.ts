import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerCartComponent } from './retailer-cart.component';

describe('RetailerCartComponent', () => {
  let component: RetailerCartComponent;
  let fixture: ComponentFixture<RetailerCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RetailerCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailerCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
