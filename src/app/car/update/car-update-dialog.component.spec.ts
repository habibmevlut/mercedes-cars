import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarUpdateDialogComponent } from './car-update-dialog.component';

describe('CarUpdateDialogComponent', () => {
  let component: CarUpdateDialogComponent;
  let fixture: ComponentFixture<CarUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(CarUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
