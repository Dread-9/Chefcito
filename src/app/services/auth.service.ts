import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as serverEndpoint from '../utils/url';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = serverEndpoint;
  private isAuthenticated = false;
  private tokenExpiration: number = 0;

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router,
    private toastService: ToastService,
    private alertController: AlertController
  ) { }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
    this.tokenExpiration = Date.now() + 43200000;
    // this.tokenExpiration = Date.now() + 60000; // 1 minuto en milisegundos
    localStorage.setItem('authTokenExpiration', this.tokenExpiration.toString());

    setTimeout(() => {
      // console.log('¡El token ha expirado localmente!');
      this.showTokenExpiredAlert();
    }, 43200000);
  }

  async showTokenExpiredAlert() {
    const alert = await this.alertController.create({
      header: 'Sesión Expirada',
      message: 'Tu sesión ha expirado. Serás redirigido a la página principal.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // console.log('Redirigiendo a la página principal');
            this.router.navigate(['/']);
            this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  getToken(): string {
    const expiration = localStorage.getItem('authTokenExpiration');
    if (!expiration) return '';
    const expirationTime = parseInt(expiration, 10);
    const currentTime = Date.now();
    if (currentTime < expirationTime) {
      return localStorage.getItem('authToken') || '';
    }
    this.logout();
    return '';
  }

  login(response: any) {
    this.isAuthenticated = true;
  }

  signup(response: any) {
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
