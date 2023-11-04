import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Food, FoodDetails } from 'src/app/models/interfaceFood';
import { FoodService } from 'src/app/services/food.service';
import { ModalController } from '@ionic/angular';
import { FoodmodalPage } from '../foodmodal/foodmodal.page';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {
  productDetails: FoodDetails;
  carrito: Food[] = [];
  botonCarritoModalDeshabilitado: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastService: ToastService,
    private cartService: ShoppingCartService
  ) {
    this.productDetails = { food: {} as Food, recipe: [] };
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const foodId = params['foodId'];
      this.foodService.getFoodDetailsById(foodId).subscribe((data: FoodDetails) => {
        this.productDetails = data;
      });
    });
  }
  async agregarAlCarrito(producto: Food) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Deseas agregar "${producto.name}" al carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.toastService.showToast('El producto no a sido agregado a tu carrito', 'warning', 2000);
          },
        },
        {
          text: 'Agregar',
          handler: () => {
            this.cartService.agregarAlCarrito(producto);
            this.toastService.showToast('Producto agregado al carrito', 'success', 2000);
            this.botonCarritoModalDeshabilitado = false;
          },
        },
      ],
    });

    await alert.present();
  }
}
