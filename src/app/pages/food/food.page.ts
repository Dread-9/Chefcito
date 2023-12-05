import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Food, FoodDetails, Unit } from 'src/app/models/interfaceFood';
import { FoodService } from 'src/app/services/food.service';
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
  units: Unit[] = [];
  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private alertController: AlertController,
    private toastService: ToastService,
    private cartService: ShoppingCartService,
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
    this.foodService.getMeasurement().subscribe((data: any) => {
      this.units = data;
    });
  }

  async doRefresh(event: any) {
    console.log('Recargando...');
    this.route.params.subscribe((params) => {
      const foodId = params['foodId'];
      this.foodService.getFoodDetailsById(foodId).subscribe((data: FoodDetails) => {
        this.productDetails = data;
      });
    });
    this.foodService.getMeasurement().subscribe((data: any) => {
      this.units = data;
    });
    event.target.complete();
  }
  async agregarAlCarrito(producto: Food) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Deseas agregar "${producto.name}" al carrito?`,
      mode: 'ios',
      inputs: [
        {
          name: 'comentario',
          type: 'text',
          placeholder: 'Añadir comentario (opcional)',
        }
      ],
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
          handler: (data) => {
            const comentario = data.comentario || '';
            this.cartService.agregarAlCarrito(producto, comentario);
            this.toastService.showToast(`Producto agregado al carrito: ${producto.name}`, 'success', 2000);
          },
        },
      ],
    });

    await alert.present();
  }
  getUnitName(unitId: string): string {
    const unit = this.units.find(u => u._id === unitId);
    return unit ? unit.name : ''
  }
}
