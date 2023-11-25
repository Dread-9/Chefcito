import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CreatewalletPage } from './createwallet.page';

describe('CreatewalletPage', () => {
  let component: CreatewalletPage;
  let fixture: ComponentFixture<CreatewalletPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreatewalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
