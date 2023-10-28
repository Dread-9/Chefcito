import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { Food } from '../../models/interfaceFood';

@Component({
  selector: 'app-foodmodal',
  templateUrl: './foodmodal.page.html',
  styleUrls: ['./foodmodal.page.scss'],
})
export class FoodmodalPage implements OnInit {
  @Input() carrito!: Food[];
  @Input() onCartItemRemoved!: (producto: Food) => void;
  constructor(
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private toastService: ToastService
  ) { }

  ngOnInit() {
  }
  cerrarModal() {
    this.modalController.dismiss();
  }

  eliminarDelCarrito(producto: Food) {
    this.alertController
      .create({
        header: 'Confirmación',
        message: `¿Estás seguro de eliminar "${producto.name}" del carrito?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.onCartItemRemoved(producto);
              this.toastService.showToast(`${producto.name} se eliminó del carrito`, 'success', 3000);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
}
