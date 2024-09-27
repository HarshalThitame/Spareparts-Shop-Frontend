import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicCartComponent } from './mechanic-cart.component';

describe('MechanicCartComponent', () => {
  let component: MechanicCartComponent;
  let fixture: ComponentFixture<MechanicCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
