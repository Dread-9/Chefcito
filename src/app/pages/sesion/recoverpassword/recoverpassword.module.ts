import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoverpasswordPageRoutingModule } from './recoverpassword-routing.module';

import { RecoverpasswordPage } from './recoverpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecoverpasswordPageRoutingModule
  ],
  declarations: [RecoverpasswordPage]
})
export class RecoverpasswordPageModule {}
