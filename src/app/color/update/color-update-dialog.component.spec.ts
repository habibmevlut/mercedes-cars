import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorUpdateDialogComponent } from './color-update-dialog.component';

describe('ColorUpdateDialogComponent', () => {
  let component: ColorUpdateDialogComponent;
  let fixture: ComponentFixture<ColorUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColorUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(ColorUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
