import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCartComponent } from './general-cart.component';

describe('GeneralCartComponent', () => {
  let component: GeneralCartComponent;
  let fixture: ComponentFixture<GeneralCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
