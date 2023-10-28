import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodmodalPageRoutingModule } from './foodmodal-routing.module';

import { FoodmodalPage } from './foodmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodmodalPageRoutingModule
  ],
  declarations: [FoodmodalPage]
})
export class FoodmodalPageModule {}
