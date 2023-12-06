import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import * as global from '../../../global'
import * as serverEndpoint from '../../../utils/url'
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { LocalNotificationsService } from '../../../services/local-notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  mensajesGlobal = global
  url = serverEndpoint;
  responseData: any;
  LoginFormulario = {
    email: '',
    password: ''
  };
  constructor(
    private auth: AuthService,
    private user: UserService,
    private loadingController: LoadingController,
    private router: Router,
    private toastService: ToastService,
    private localNotificationsService: LocalNotificationsService
  ) {
    this.LoginFormulario;
  }
  ngOnInit() {
  }
  limpiarCampos() {
    this.LoginFormulario.email = '';
    this.LoginFormulario.password = '';
  }
  isValidForm(form: NgForm | null): boolean {
    return !!form && form.valid === true;
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
    if (this.isValidForm(this.form)) {
      try {
        const requestData = {
          mail: this.LoginFormulario.email,
          password: this.LoginFormulario.password,
        };
        const response = await fetch(serverEndpoint.url.urlSesion.sesion.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        if (response.ok) {
          const responseData = await response.json();
          this.auth.login(responseData);
          this.auth.setToken(responseData.token);
          this.limpiarCampos();
          const token = this.auth.getToken();
          if (token) {
            this.user.setUser(responseData.user);
            this.toastService.showToast(
              this.mensajesGlobal.SOLICITUD_SESION.MSJ_SESION_EXITOS.login,
              'success',
              3000
            );
            this.localNotificationsService.scheduleNotification(
              'Inicio de Sesion',
              this.mensajesGlobal.SOLICITUD_SESION.MSJ_SESION_EXITOS.login,
              new Date(new Date().getTime() + 3000)
            );
            this.router.navigate(['/clientes', responseData.token, 'tab1']);
          } else {
            this.router.navigate(['/']);
            this.toastService.showToast(
              'La sesión ha expirado. Por favor, inicia sesión nuevamente.',
              'danger',
              3000
            );
          }
        } else {
          const errorData = await response.json();
          this.toastService.showToast(errorData.msg, 'danger', 3000);
        }
      } catch (error) {
        console.error('Ocurrió un error inesperado:', error);
        this.toastService.showToast(
          'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.',
          'danger',
          3000
        );
      } finally {
        await loading.dismiss();
      }
    }
  }
}
