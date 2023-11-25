import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatewalletPageRoutingModule } from './createwallet-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreatewalletPage } from './createwallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatewalletPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CreatewalletPage]
})
export class CreatewalletPageModule { }
