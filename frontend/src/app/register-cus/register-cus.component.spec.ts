import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCusComponent } from './register-cus.component';

describe('RegisterCusComponent', () => {
  let component: RegisterCusComponent;
  let fixture: ComponentFixture<RegisterCusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCusComponent]
    });
    fixture = TestBed.createComponent(RegisterCusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
