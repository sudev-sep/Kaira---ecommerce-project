import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerHComponent } from './seller-h.component';

describe('SellerHComponent', () => {
  let component: SellerHComponent;
  let fixture: ComponentFixture<SellerHComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerHComponent]
    });
    fixture = TestBed.createComponent(SellerHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
