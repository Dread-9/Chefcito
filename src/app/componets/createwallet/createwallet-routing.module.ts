import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatewalletPage } from './createwallet.page';

const routes: Routes = [
  {
    path: '',
    component: CreatewalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatewalletPageRoutingModule {}
