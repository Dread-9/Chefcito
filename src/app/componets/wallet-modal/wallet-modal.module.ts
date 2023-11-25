import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletModalPageRoutingModule } from './wallet-modal-routing.module';
import { WalletModalPage } from './wallet-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletModalPageRoutingModule,
  ],
  declarations: [WalletModalPage]
})
export class WalletModalPageModule { }
