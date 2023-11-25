import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletModalPage } from './wallet-modal.page';
import { ReactiveFormsModule } from '@angular/forms'; // Asegúrate de importar ReactiveFormsModule


const routes: Routes = [
  {
    path: '',
    component: WalletModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletModalPageRoutingModule { }
