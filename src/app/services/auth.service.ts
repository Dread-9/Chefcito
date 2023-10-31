import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as serverEndpoint from '../utils/url'
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = serverEndpoint;
  private isAuthenticated = false;
  private tokenExpirationTimer: any;
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router,
    private alertController: AlertController) {
  }
  login(response: any) {
    this.isAuthenticated = true;
    const token = response.token;
    const user = response.user;
    this.storage.set('token', token);
    this.storage.set('loginTime', new Date().getTime());
    const tokenExpirationTime = 60 * 60 * 1000;
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.showSessionExtensionAlert();
    }, tokenExpirationTime);
  }

  signup(response: any) {

  }

  async logout() {
    await this.storage.remove('token');
    await this.storage.remove('loginTime');
    this.isAuthenticated = false;
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  async showSessionExtensionAlert() {
    const alert = await this.alertController.create({
      header: 'Extender Sesión',
      message: 'Su sesión está a punto de expirar. ¿Desea extenderla por otra hora?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.extendSession();
          }
        },
        {
          text: 'No',
          handler: () => {
            this.showSessionExpirationAlert();
          }
        }
      ]
    });

    await alert.present();
  }

  async extendSession() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.showSessionExpirationAlert();
    }, 55 * 60 * 1000);
  }

  async showSessionExpirationAlert() {
    const alert = await this.alertController.create({
      header: 'Sesión Expirando',
      message: 'Su sesión está a punto de expirar. Por favor, vuelva a iniciar sesión.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
