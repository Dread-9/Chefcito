import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalNotificationsService } from '../../services/local-notifications.service';
import { ToastService } from '../../services/toast.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
  token: any;

  constructor(
    private toastService: ToastService,
    private auth: AuthService,
    private router: Router,
    private localNotificationsService: LocalNotificationsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.token = this.auth.getToken();
  }

  async pago() {
    const loading = await this.loadingController.create({
      message: 'Generando Pago...',
      duration: 3000
    });
    const alert = await this.alertController.create({
      header: 'Generar Pago',
      message: '¿Estás seguro de realizar este pago?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Pagar',
          handler: async () => {
            loading.present();
            this.router.navigate(['clientes', this.token, 'tab1']);
            this.toastService.showToast('Se ha realizado el pago de manera exitosa', 'success', 3000);
            this.localNotificationsService.scheduleNotification(
              'Pago de orden',
              `Se ha realizado el pago de manera exitosa`,
              new Date(new Date().getTime() + 3000)
            );
          }
        }
      ]
    });
    await alert.present();
  }
}
