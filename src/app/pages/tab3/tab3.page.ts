import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Preferences } from '@capacitor/preferences';
import * as global from '../../global'
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  darkMode = false;
  mensajesGlobal = global
  user: any;
  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,
    private auth: AuthService,
    private toastService: ToastService
  ) { }
  ngOnInit() {
    this.user = this.userService.getUser();
  }
  async handleLogout() {
    const loading = await this.loadingController.create({
      message: 'Cerrando sesión...',
      duration: 3000
    });
    loading.present();
    try {
      localStorage.clear();
      this.router.navigateByUrl('/');
      this.toastService.showToast(this.mensajesGlobal.SOLICITUD_SESION.MSJ_SESION_EXITOS.logout, 'success', 3000);
    } catch (error) {
      this.toastService.showToast(this.mensajesGlobal.SOLICITUD_ERROR_SESION.MSJ_SESION_ERROR.logout, 'danger', 3000);
    } finally {
      loading.dismiss();
    }
  }
  async showLogoutConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.handleLogout();
          }
        }
      ]
    });
    await alert.present();
  }
  async onLogoutClick() {
    this.checkAppMode();
    this.auth.logout();
    await this.showLogoutConfirmationAlert();
  }

  async checkAppMode() {
    const checkIsDarkMode = await Preferences.get({ key: 'darkModeActivated' });
    console.log(checkIsDarkMode);
    checkIsDarkMode?.value == 'true'
      ? (this.darkMode = true)
      : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      Preferences.set({ key: 'darkModeActivated', value: 'true' });
    } else {
      Preferences.set({ key: 'darkModeActivated', value: 'false' });
    }
  }
}
