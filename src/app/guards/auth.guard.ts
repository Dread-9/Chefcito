import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private auth: AuthService, private alertCtrl: AlertController) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.auth.isAuthenticatedUser()) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
