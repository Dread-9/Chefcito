import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecoverpasswordPage } from './recoverpassword.page';

const routes: Routes = [
  {
    path: '',
    component: RecoverpasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoverpasswordPageRoutingModule {}
