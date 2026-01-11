import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHComponent } from './customer-h.component';

describe('CustomerHComponent', () => {
  let component: CustomerHComponent;
  let fixture: ComponentFixture<CustomerHComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerHComponent]
    });
    fixture = TestBed.createComponent(CustomerHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
