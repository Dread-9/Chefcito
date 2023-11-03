import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/clientes/:user/tab1',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          }
        ]
      },
      {
        path: 'pay',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pay/pay.module').then(m => m.PayPageModule)
          }
        ]
      },
      {
        path: 'qr',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../qr/qr.module').then(m => m.QrPageModule)
          }
        ]
      },
      {
        path: 'foodmodal',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../foodmodal/foodmodal.module').then(m => m.FoodmodalPageModule)
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
