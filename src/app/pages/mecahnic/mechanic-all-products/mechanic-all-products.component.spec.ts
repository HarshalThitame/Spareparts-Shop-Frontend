import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicAllProductsComponent } from './mechanic-all-products.component';

describe('MechanicAllProductsComponent', () => {
  let component: MechanicAllProductsComponent;
  let fixture: ComponentFixture<MechanicAllProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicAllProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicAllProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
