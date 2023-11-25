import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { WalletModalPage } from './wallet-modal.page';

describe('WalletModalPage', () => {
  let component: WalletModalPage;
  let fixture: ComponentFixture<WalletModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WalletModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
