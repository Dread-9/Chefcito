import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverpasswordPage } from './recoverpassword.page';

describe('RecoverpasswordPage', () => {
  let component: RecoverpasswordPage;
  let fixture: ComponentFixture<RecoverpasswordPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecoverpasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
