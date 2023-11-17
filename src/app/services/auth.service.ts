import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as serverEndpoint from '../utils/url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = serverEndpoint;
  private isAuthenticated = false;
  private tokenExpiration: number = 0;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private http: HttpClient
  ) {
    this.checkTokenValidity();
  }

  checkTokenValidity() {
    const token = this.getToken();
    if (token) {
      this.isAuthenticated = true;
    }
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
    sessionStorage.setItem('authToken', token);
    this.tokenExpiration = Date.now() + 43200000;
    // this.tokenExpiration = Date.now() + 60000; // 1 minuto en milisegundos
    localStorage.setItem('authTokenExpiration', this.tokenExpiration.toString());
    sessionStorage.setItem('authTokenExpiration', this.tokenExpiration.toString());
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
  getTokensesion(): string {
    const expiration = sessionStorage.getItem('authTokenExpiration');
    if (!expiration) return '';
    const expirationTime = parseInt(expiration, 10);
    const currentTime = Date.now();
    if (currentTime < expirationTime) {
      return sessionStorage.getItem('authToken') || '';
    }
    this.logout();
    return '';
  }

  login(response: any) {
    this.isAuthenticated = true;
  }

  signup(response: any) {
  }

  verify(id: string): Observable<any> {
    const url = `${serverEndpoint.url.urlSesion.sesion.verify}/${id}`;
    return this.http.get(url);
  }

  logout() {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authTokenExpiration');
    localStorage.removeItem('authTokenExpiration');
    this.isAuthenticated = false;
  }


  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
