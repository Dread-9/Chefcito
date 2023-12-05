import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { CardService } from 'src/app/services/card.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Card } from '../../models/card';
@Component({
  selector: 'app-createwallet',
  templateUrl: './createwallet.page.html',
  styleUrls: ['./createwallet.page.scss'],
})
export class CreatewalletPage implements OnInit {
  paymentForm!: FormGroup;
  showErrorMessage: boolean = false;
  cardSubscription!: Subscription;
  token: any;
  card!: Card;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastService: ToastService,
    private cardservice: CardService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.token = this.auth.getToken();
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cardHolder: ['', Validators.required],
      expirationMonth: ['', Validators.required],
      expirationYear: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
    this.paymentForm.valueChanges.subscribe(() => {
      this.updateCardDetails();
    });
  }
  cerrarModal() {
    this.modalController.dismiss({});
  }
  ngAfterViewInit() {
    const cardNumberInput = document.querySelector('.card-number-input') as HTMLInputElement;
    const cardHolderInput = document.querySelector('.card-holder-input') as HTMLInputElement;
    const monthInput = document.querySelector('.month-input') as HTMLSelectElement;
    const yearInput = document.querySelector('.year-input') as HTMLSelectElement;
    const cvvInput = document.querySelector('.cvv-input') as HTMLInputElement;

    cardNumberInput.addEventListener('input', () => {
      const cardNumberBox = document.querySelector('.card-number-box') as HTMLElement;
      cardNumberBox.innerText = cardNumberInput.value;
    });

    cardHolderInput.addEventListener('input', () => {
      const cardHolderName = document.querySelector('.card-holder-name') as HTMLElement;
      cardHolderName.innerText = cardHolderInput.value;
    });

    monthInput.addEventListener('input', () => {
      const expMonth = document.querySelector('.exp-month') as HTMLElement;
      expMonth.innerText = monthInput.value;
    });

    yearInput.addEventListener('input', () => {
      const expYear = document.querySelector('.exp-year') as HTMLElement;
      expYear.innerText = yearInput.value;
    });

    cvvInput.addEventListener('mouseenter', () => {
      this.renderer.setStyle(document.querySelector('.front') as HTMLElement, 'transform', 'perspective(1000px) rotateY(-180deg)');
      this.renderer.setStyle(document.querySelector('.back') as HTMLElement, 'transform', 'perspective(1000px) rotateY(0deg)');
    });

    cvvInput.addEventListener('mouseleave', () => {
      this.renderer.setStyle(document.querySelector('.front') as HTMLElement, 'transform', 'perspective(1000px) rotateY(0deg)');
      this.renderer.setStyle(document.querySelector('.back') as HTMLElement, 'transform', 'perspective(1000px) rotateY(180deg)');
    });

    cvvInput.addEventListener('input', () => {
      const cvvBox = document.querySelector('.cvv-box') as HTMLElement;
      cvvBox.innerText = cvvInput.value;
    });
  }
  flipCard() {
    const cardContainer = document.querySelector('.card-container') as HTMLElement;
    cardContainer.classList.toggle('flipped');
  }
  updateCardDetails() {
    const formValues = this.paymentForm.value;
    const cardNumberBox = document.querySelector('.card-number-box') as HTMLElement;
    cardNumberBox.innerText = formValues.cardNumber;
  }

  crearTarjeta() {
    const fechaParts = '11/11/2022'.split('/');
    const fechaDate = new Date(parseInt(fechaParts[2]), parseInt(fechaParts[1]) - 1, parseInt(fechaParts[0]));
    if (this.paymentForm.valid) {
      const formData = this.paymentForm.value;
      console.log('Datos del formulario:', formData);
      const datosMapeados = {
        name: formData.cardHolder,
        pan: formData.cardNumber,
        fecha: fechaDate,
        triple: formData.cvv
      };
      console.log('Datos mapeados:', datosMapeados);
      const datosJSON = JSON.stringify(datosMapeados);
      console.log('Datos mapeados:', datosJSON);
      const token = this.token;
      console.log('Datos mapeados:', token);
      this.cardSubscription = this.cardservice.postCard(token, datosJSON).subscribe({
        next: (response: any) => {
          console.log('Datos mapeados:', response);
          this.toastService.showToast('Tarjeta creada de manera exitosa', 'danger', 3000);
        },
        error: (error) => {
          const errorData = error.error;
          this.toastService.showToast(errorData.msg, 'danger', 3000);
        },
      });
    }
  }
}
