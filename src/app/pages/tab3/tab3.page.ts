import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Preferences } from '@capacitor/preferences';
import * as global from '../../global'
import { ModalController } from '@ionic/angular';
import { PersonComponent } from 'src/app/componets/person/person.component';
import { WalletModalComponent } from 'src/app/componets/wallet-modal/wallet-modal.component';
import { SettingsModalComponent } from 'src/app/componets/settings-modal/settings-modal.component';
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
    private toastService: ToastService,
    private modalController: ModalController
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
      sessionStorage.clear();
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
            this.auth.logout();
          }
        }
      ]
    });
    await alert.present();
  }
  async onLogoutClick() {
    this.checkAppMode();
    await this.showLogoutConfirmationAlert();
  }

  async verify() {
    const userId = this.user._id;
    console.log(userId);
    this.auth.verify(userId).subscribe({
      next: async (result) => {
        const alert = await this.alertController.create({
          header: 'Correo enviado',
          message: 'Se ha enviado un correo para validar tu usuario.',
          buttons: ['OK']
        });

        await alert.present();

        this.toastService.showToast(result.msg, 'danger', 3000);
        console.log('User verification result:', result);
      },
      error: (error) => {
        const errorData = error.error;
        this.toastService.showToast(errorData.msg, 'danger', 3000);
        console.error('Error occurred during user verification:', error);
      }
    });
  }
  async checkAppMode() {
    const checkIsDarkMode = await Preferences.get({ key: 'darkModeActivated' });
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

  async person() {
    const modal = await this.modalController.create({
      component: PersonComponent,
    });
    return await modal.present();
  }

  async wallet() {
    const modal = await this.modalController.create({
      component: WalletModalComponent,
    });
    return await modal.present();
  }

  async settings() {
    const modal = await this.modalController.create({
      component: SettingsModalComponent,
    });
    return await modal.present();
  }
}
