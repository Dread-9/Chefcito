import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FoodmodalPage } from '../foodmodal/foodmodal.page';
import { AlertController } from '@ionic/angular';
import { FoodType, Food } from '../../models/interfaceFood';
import { FoodService } from '../../services/food.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation, Sale } from '../../models/interfaceReservation';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  detalleDelProducto: Food | null = null;

  token: any;

  seleccionado!: string;
  foodTypes!: FoodType[];
  Food!: Food[];
  foodsByType: { [key: string]: any[] } = {};
  carrito: Food[] = [];
  modalButtonDisabled: boolean = true;
  fechaA!: string;
  reservations!: Reservation;
  sales!: Sale;
  sale: any;
  reservation: any;
  sharedDataService: SharedService;
  user: any;
  constructor(
    private toastService: ToastService,
    private modalController: ModalController,
    private alertController: AlertController,
    private foodService: FoodService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    sharedDataService: SharedService,
    private auth: AuthService,
    private navCtrl: NavController
  ) {
    this.sharedDataService = sharedDataService;
  }
  ngOnInit() {
    this.typeFood();
    this.food();
    this.fecha();
    this.route.queryParams.subscribe((params) => {
      this.reservation = JSON.parse(params['reservation']);
      this.sale = JSON.parse(params['sale']);
    });
    this.user = this.userService.getUser();
    this.token = this.auth.getToken();
  }
  async cancelReservation() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro de cancelar tu reserva?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // El usuario eligió cancelar la acción
          }
        },
        {
          text: 'Sí, cancelar',
          handler: () => {
            this.toastService.showToast('Se ha cancelado la Reseva de la mesa: ', 'success', 3000);
          }
        }
      ]
    });

    await alert.present();
  }
  fecha() {
    const fechaActual = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    this.fechaA = fechaActual.toLocaleDateString('es-ES', options);
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
      this.updateModalButtonState();
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

  async alert() {
    const alert = await this.alertController.create({
      header: 'Mensaje informativo',
      message: 'Solo puedes realizar un pedido si tienes una reserva de mesa habilitada.',
      buttons: ['Entendido'],
    });
    await alert.present();
  }
  verDetalles(foodId: string) {
    this.router.navigate(['/clientes', this.token, 'tab2', 'food', foodId]);
  }
} 
