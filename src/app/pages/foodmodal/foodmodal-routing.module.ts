import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodmodalPage } from './foodmodal.page';

const routes: Routes = [
  {
    path: '',
    component: FoodmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodmodalPageRoutingModule {}
