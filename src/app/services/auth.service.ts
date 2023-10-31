import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as serverEndpoint from '../utils/url'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = serverEndpoint;
  private isAuthenticated = false;
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router) {
  }
  login(response: any) {

    this.isAuthenticated = true;
  }
  signup(response: any) {

  }
  logout() {
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
