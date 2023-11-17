import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any;


  setUser(user: any) {
    this.user = user;
    localStorage.setItem('userData', JSON.stringify(user));
    sessionStorage.setItem('userData', JSON.stringify(user));
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('userData') || '{}');
    }
    return this.user;
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
  }
}
