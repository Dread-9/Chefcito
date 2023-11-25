import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'clientes/:user',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./pages/sesion/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/sesion/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'recoverpassword',
    loadChildren: () => import('./pages/sesion/recoverpassword/recoverpassword.module').then(m => m.RecoverpasswordPageModule)
  },
  {
    path: 'wallet-modal',
    loadChildren: () => import('./componets/wallet-modal/wallet-modal.module').then( m => m.WalletModalPageModule)
  },
  {
    path: 'settings-modal',
    loadChildren: () => import('./componets/settings-modal/settings-modal.module').then( m => m.SettingsModalPageModule)
  },
  {
    path: 'person-modal',
    loadChildren: () => import('./componets/person-modal/person-modal.module').then( m => m.PersonModalPageModule)
  },
  {
    path: 'createwallet',
    loadChildren: () => import('./componets/createwallet/createwallet.module').then( m => m.CreatewalletPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
