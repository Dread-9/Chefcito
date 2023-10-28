import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodmodalPage } from './foodmodal.page';

describe('FoodmodalPage', () => {
  let component: FoodmodalPage;
  let fixture: ComponentFixture<FoodmodalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FoodmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
