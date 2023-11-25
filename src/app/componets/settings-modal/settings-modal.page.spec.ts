import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsModalPage } from './settings-modal.page';

describe('SettingsModalPage', () => {
  let component: SettingsModalPage;
  let fixture: ComponentFixture<SettingsModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SettingsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
