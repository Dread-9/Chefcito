import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { take, map, switchMap } from 'rxjs/operators';
// import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
// import { BehaviorSubject, Observable, from, of } from 'rxjs';
import * as serverEndpoint from '../utils/url'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = serverEndpoint;
  private isAuthenticated = false;
  private tokenKey = 'authToken';
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router) {
  }
  login(response: any) {
    const token = response.token;
    const expirationDate = new Date(new Date().getTime() + 300000);
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    this.isAuthenticated = true;
  }
  signup(response: any) {

  }
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    const expirationDate = localStorage.getItem('tokenExpiration');
    if (!token || !expirationDate) {
      return false;
    }
    return new Date() < new Date(expirationDate);
  }

  logout() {
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('tokenExpiration');
    return this.isAuthenticated;
  }
}
