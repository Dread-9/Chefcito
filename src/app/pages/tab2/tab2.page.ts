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
import { ShoppingCartService } from '../../services/shopping-cart.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  botonCarritoModalDeshabilitado: boolean = true;
  carrito: { product: Food; quantity: number }[] = [];
  detalleDelProducto: Food | null = null;
  token: any;
  seleccionado!: string;
  foodTypes!: FoodType[];
  Food!: Food[];
  foodsByType: { [key: string]: any[] } = {};
  modalButtonDisabled: boolean = true;
  fechaA!: string;
  reservations!: Reservation;
  sales!: Sale;
  sale: any;
  reservation: any;
  sharedDataService: SharedService;
  user: any;
  tables!: any[];
  searchTerm: string = '';
  reservationId!: any;

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
    private cartService: ShoppingCartService
  ) {
    this.sharedDataService = sharedDataService;
    this.sharedDataService.getTabla().subscribe((data: any[]) => {
      this.tables = data;
    });
  }
  ngOnInit() {
    this.typeFood();
    this.food();
    this.fecha();
    this.route.queryParams.subscribe((params) => {
      this.reservation = JSON.parse(params['reservation']);
      this.sale = JSON.parse(params['sale']);
    });
    this.reservationId = this.route.snapshot.queryParams['saleId'];
    this.user = this.userService.getUser();
    this.token = this.auth.getToken();
    this.carrito = this.cartService.obtenerCarrito();
    console.log('ID de reserva:', this.reservationId);
  }
  filterFoodsByName(foods: Food[], searchTerm: string): Food[] {
    if (!searchTerm) {
      return foods;
    }
    searchTerm = searchTerm.toLowerCase();
    return foods.filter(food => food.name.toLowerCase().includes(searchTerm));
  }

  getTableNumber(tableId: string): string {
    const table = this.tables.find(table => table._id === tableId);
    return table ? table.num.toString() : 'No encontrado';
  }
  getTableSize(tableId: string): string {
    const table = this.tables.find(table => table._id === tableId);
    return table ? table.size.toString() : 'No encontrado';
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
            this.toastService.showToast('Su reserva no a sido cancelada', 'warning', 2000);
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.sharedDataService.DeleteReservation(this.reservationId, this.token).subscribe({
              next: (response) => {
                this.router.navigate(['clientes']);
                this.toastService.showToast(`Se ha cancelado la Reseva de la mesa: ${this.reservations.table}`, 'success', 3000);
              },
              error: (error) => {
                const errorData = error.error;
                this.toastService.showToast(errorData.msg, 'danger', 3000);
              }
            });
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
  verDetalles(foodId: string) {
    this.router.navigate(['/clientes', this.token, 'tab2', 'food', foodId]);
  }
  async abrirModal() {
    const modal = await this.modalController.create({
      component: FoodmodalPage,
      componentProps: {
        carrito: this.carrito,
        reservaActiva: this.sharedDataService.getReservations()?.active,
        botonCarritoModalDeshabilitado: this.botonCarritoModalDeshabilitado
      },
    });
    return await modal.present();
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
            this.toastService.showToast('El producto no ha sido agregado al carrito', 'warning', 2000);

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
  ProductosDisponibles(): boolean {
    if (!this.seleccionado) {
      return false;
    }

    const tipoSeleccionado = this.foodTypes.find(tipo => tipo._id === this.seleccionado);
    if (tipoSeleccionado) {
      const productos = this.foodsByType[tipoSeleccionado._id];
      return productos && productos.length > 0;
    }

    return false;
  }

} 
