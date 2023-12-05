import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import * as global from '../../global'
import { ModalController } from '@ionic/angular';
import { WalletModalPage } from 'src/app/componets/wallet-modal/wallet-modal.page';
import { SettingsModalPage } from 'src/app/componets/settings-modal/settings-modal.page';
import { PersonModalPage } from 'src/app/componets/person-modal/person-modal.page';
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

  async onLogoutClick() {
    await this.showLogoutConfirmationAlert();
  }
  async person() {
    const modal = await this.modalController.create({
      component: PersonModalPage,
    });
    return await modal.present();
  }

  async wallet() {
    const modal = await this.modalController.create({
      component: WalletModalPage,
    });
    return await modal.present();
  }

  async settings() {
    const modal = await this.modalController.create({
      component: SettingsModalPage,
    });
    return await modal.present();
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
        this.auth.verify(userId);
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
}
