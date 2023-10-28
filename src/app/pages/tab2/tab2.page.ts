import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FoodmodalPage } from '../foodmodal/foodmodal.page';
import { AlertController } from '@ionic/angular';
import { FoodType, Food } from '../../models/interfaceFood';
import { FoodService } from '../../services/food.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  seleccionado!: string;
  foodTypes!: FoodType[];
  Food!: Food[];
  foodsByType: { [key: string]: any[] } = {};
  carrito: Food[] = [];
  modalButtonDisabled: boolean = true;
  constructor(
    private toastService: ToastService,
    private modalController: ModalController,
    private alertController: AlertController,
    private foodService: FoodService
  ) { }

  ngOnInit() {
    this.typeFood()
    this.food()
  }

  typeFood() {
    this.foodService.getFoodType().subscribe((typeData: any[]) => {
      this.foodTypes = typeData;
      this.seleccionado = this.foodTypes[0]._id;
    });
  }

  food() {
    this.foodService.getFoodList().subscribe((foodData: any[]) => {
      this.Food = foodData
      this.groupFoodsByType();
    });
  }

  groupFoodsByType() {
    this.foodsByType = this.Food.reduce((result: { [key: string]: any[] }, Food) => {
      if (!result[Food.type]) {
        result[Food.type] = [];
      }
      result[Food.type].push(Food);
      return result;
    }, {});
  }

  filterFoodsByType(selectedType: string): any[] {
    return this.foodsByType[selectedType];
  }

  cambiarSegmento(event: any) {
    const selectedType = event.detail.value as string;
    this.seleccionado = selectedType;
  }

  async agregarAlCarrito(food: Food) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Estás seguro de agregar "${food.name}" a tu carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.toastService.showToast('El producto no a sido añadido', 'warning', 3000);
          },
        },
        {
          text: 'Agregar al carrito',
          handler: () => {
            this.carrito.push(food);
            this.updateModalButtonState();
            this.toastService.showToast(`${food.name} se agregó al carrito`, 'success', 3000);
          },
        },
      ],
    });
    await alert.present();
  }

  updateModalButtonState() {
    this.modalButtonDisabled = this.carrito.length === 0;
    console.log('modalButtonDisabled:', this.modalButtonDisabled);
  }

  onCartItemRemoved(producto: Food) {
    const index = this.carrito.indexOf(producto);
    if (index >= 0) {
      this.carrito.splice(index, 1);
      this.toastService.showToast(`${producto.name} se eliminó del carrito`, 'success', 3000);
      this.updateModalButtonState(); // Actualiza el estado del botón del modal
    }
  }
  async abrirModal() {
    if (!this.modalButtonDisabled) {
      const modal = await this.modalController.create({
        component: FoodmodalPage,
        componentProps: {
          carrito: this.carrito,
          onCartItemRemoved: (producto: Food) => this.onCartItemRemoved(producto),
        },
      });
      await modal.present();
    }
  }
}
