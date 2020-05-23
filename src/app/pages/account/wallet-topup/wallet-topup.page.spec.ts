import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletTopupPage } from './wallet-topup.page';

describe('WalletTopupPage', () => {
  let component: WalletTopupPage;
  let fixture: ComponentFixture<WalletTopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletTopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
