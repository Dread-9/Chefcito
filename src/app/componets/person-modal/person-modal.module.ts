import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonModalPageRoutingModule } from './person-modal-routing.module';

import { PersonModalPage } from './person-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonModalPageRoutingModule
  ],
  declarations: [PersonModalPage]
})
export class PersonModalPageModule {}
