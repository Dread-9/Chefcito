import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonModalPage } from './person-modal.page';

describe('PersonModalPage', () => {
  let component: PersonModalPage;
  let fixture: ComponentFixture<PersonModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
