import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicProductDetailsComponent } from './mechanic-product-details.component';

describe('MechanicProductDetailsComponent', () => {
  let component: MechanicProductDetailsComponent;
  let fixture: ComponentFixture<MechanicProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicProductDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
