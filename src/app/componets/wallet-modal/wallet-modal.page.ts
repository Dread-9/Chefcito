import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CreatewalletPage } from '../createwallet/createwallet.page';
import { ToastService } from 'src/app/services/toast.service';
import { CardService } from 'src/app/services/card.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Card } from '../../models/card';


@Component({
  selector: 'app-wallet-modal',
  templateUrl: './wallet-modal.page.html',
  styleUrls: ['./wallet-modal.page.scss'],
})
export class WalletModalPage implements OnInit {
  cardSubscription!: Subscription;
  token: any;
  card!: Card;
  constructor(
    private modalController: ModalController,
    private toastService: ToastService,
    private alertController: AlertController,
    private cardservice: CardService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.getCardData();
    this.token = this.auth.getToken();
  }
  async abrirModal() {
    const modal = await this.modalController.create({
      component: CreatewalletPage,
    });
    return await modal.present();
  }
  getCardData() {
    this.cardSubscription = this.cardservice.getCard(this.token).subscribe({
      next: (response: Card) => {
        this.card = response;
        console.log('Datos de tarjeta obtenidos:', this.card);
      },
      error: (error) => {
        const errorData = error.error;
      }
    });
  }
  async deleteCardData() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta tarjeta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.toastService.showToast('No se ha eliminado la tarjeta seleccionada', 'warning', 3000);
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.performCardDeletion();
          }
        }
      ]
    });

    await alert.present();
  }

  performCardDeletion() {
    this.cardSubscription = this.cardservice.deleteCard(this.token, this.card.id_).subscribe({
      next: () => {
        this.toastService.showToast('Se ha eliminado la tarjeta de manera exitosa', 'danger', 3000);
      },
      error: (error) => {
        const errorData = error.error;
        this.toastService.showToast(errorData.msg, 'danger', 3000);
      }
    });
  }
  flipCard() {
    const cardContainer = document.querySelector('.card-container') as HTMLElement;
    cardContainer.classList.toggle('flipped');
  }

  cerrarModal() {
    this.modalController.dismiss({});
  }
}
