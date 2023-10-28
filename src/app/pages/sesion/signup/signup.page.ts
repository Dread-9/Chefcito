import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as global from '../../../global'
import * as serverEndpoint from '../../../utils/url'
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild('form', { static: true }) form!: NgForm;
  mensajesGlobal = global
  url = serverEndpoint;
  SignUpFormulario = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastService: ToastService,
    private loadingController: LoadingController
  ) {
    this.SignUpFormulario;
  }

  ngOnInit() {

  }
  limpiarCampos() {
    this.SignUpFormulario.email = '';
    this.SignUpFormulario.password = '';
    this.SignUpFormulario.nombre = '';
    this.SignUpFormulario.apellido = '';
  }
  isValidForm(form: NgForm | null): boolean {
    return !!form && form.valid === true;
  }
  async signUp() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
    if (this.isValidForm(this.form)) {
      try {
        const requestData = {
          mail: this.SignUpFormulario.email,
          password: this.SignUpFormulario.password,
          name: this.SignUpFormulario.nombre,
          lastName: this.SignUpFormulario.apellido,
        };
        const response = await fetch(serverEndpoint.url.urlSesion.sesion.signup, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        if (response.ok) {
          this.auth.signup(requestData);
          this.limpiarCampos();
          this.toastService.showToast(this.mensajesGlobal.SOLICITUD_SESION.MSJ_SESION_EXITOS.signup, 'success', 3000);
          this.router.navigate(['/']);
        } else {
          const errorData = await response.json();
          this.toastService.showToast(errorData.msg, 'danger', 3000);
        }
      } catch (error) {
        console.error('Ocurrió un error inesperado:', error);
        this.toastService.showToast('Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.', 'danger', 3000);
      }
      finally {
        await loading.dismiss();
      }
    }

  }

}
