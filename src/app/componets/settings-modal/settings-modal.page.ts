import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.page.html',
  styleUrls: ['./settings-modal.page.scss'],
})
export class SettingsModalPage implements OnInit {
  darkMode = false;
  user: any;

  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private auth: AuthService,
    private toastService: ToastService,
    private modalController: ModalController,) { }

  ngOnInit() {
  }
  cerrarModal() {
    this.modalController.dismiss({
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

}
