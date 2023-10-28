import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }
  async showToast(message: string, color: string, duration: number) {
    const toast = await this.toastController.create({
      position: 'top',
      message: message,
      color: color,
      duration: duration
    });
    await toast.present();
  }
}
