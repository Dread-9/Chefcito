import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FoodmodalPage } from '../foodmodal/foodmodal.page';
import { AlertController } from '@ionic/angular';
import { FoodType, Food } from '../../models/interfaceFood';
import { FoodService } from '../../services/food.service';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation, Sale } from '../../models/interfaceReservation';
import { Tables } from '../../models/InterfaceTable';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { LocalNotificationsService } from '../../services/local-notifications.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  carrito: { product: Food; quantity: number }[] = [];
  detalleDelProducto: Food | null = null;
  token: any;
  seleccionado!: string;
  foodTypes!: FoodType[];
  Food!: Food[];
  foodsByType: { [key: string]: any[] } = {};
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
  saleId: string | null = null;
  active: string | null = null;
  table: string | null = null;
  Tables!: Tables[];
  mostrarCarta: boolean = false;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
  mesaEncontrada!: Tables

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
    private cartService: ShoppingCartService,
    private localNotificationsService: LocalNotificationsService
  ) {
    this.sharedDataService = sharedDataService;
    this.sharedDataService.getTabla().subscribe((data: Tables[]) => {
      this.Tables = data;
      console.log('Tables', this.Tables);
      this.buscarMesaPorReserva(this.reservationId);
    });
  }
  async doRefresh(event: any) {
    this.sharedDataService.getTabla().subscribe((data: any[]) => {
      this.tables = data;
    });
    this.sharedDataService = this.sharedDataService;
    this.typeFood();
    this.food();
    this.fecha();
    this.user = this.userService.getUser();
    this.token = this.auth.getToken();
    this.carrito = this.cartService.obtenerCarrito();
    this.saleId = localStorage.getItem('saleId');
    this.table = localStorage.getItem('table');
    this.active = localStorage.getItem('active');
    if (this.saleId && this.table && this.active) {
      this.mostrarCarta = true;
    }
    event.target.complete();
    this.buscarMesaPorReserva(this.reservationId);
  }
  ngOnInit() {
    this.typeFood();
    this.food();
    this.fecha();
    this.user = this.userService.getUser();
    this.token = this.auth.getToken();
    this.carrito = this.cartService.obtenerCarrito();
    this.saleId = localStorage.getItem('saleId');
    this.table = localStorage.getItem('table');
    this.active = localStorage.getItem('active');
    if (this.saleId && this.table && this.active) {
      this.mostrarCarta = true;
    }
    this.buscarMesaPorReserva(this.reservationId);
  }
  filterFoodsByName(foods: Food[], searchTerm: string): Food[] {
    if (!searchTerm) {
      return foods;
    }
    searchTerm = searchTerm.toLowerCase();
    return foods.filter(food => food.name.toLowerCase().includes(searchTerm));
  }
  buscarMesaPorReserva(reservationId: string): void {
    const foundTable = this.Tables.find(table => table.id === reservationId);
    if (foundTable) {
      this.mesaEncontrada = foundTable;
    } else {
      console.log('No se encontró la mesa correspondiente a la reserva con el ID proporcionado.');
    }
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
            const saleId = localStorage.getItem('saleId');
            if (!saleId) {
              this.toastService.showToast('No se encontró Id de Reserva', 'danger', 3000);
              return;
            }
            this.sharedDataService.DeleteReservation(saleId, this.token).subscribe({
              next: (response) => {
                localStorage.removeItem('saleId');
                localStorage.removeItem('table');
                localStorage.removeItem('active');
                sessionStorage.removeItem('saleId');
                this.mostrarCarta = false;
                this.router.navigate(['clientes', this.token, 'tab1']);
                this.toastService.showToast(`Se ha cancelado la Reseva de la mesa: `, 'success', 3000);
                this.localNotificationsService.scheduleNotification(
                  'Reserva',
                  `Se ha cancelado la Reseva de la mesa: `,
                  new Date(new Date().getTime() + 3000)
                );
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
      },
    });
    return await modal.present();
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
            this.toastService.showToast('El producto no ha sido agregado al carrito', 'warning', 2000);

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
  async alert() {
    const alert = await this.alertController.create({
      header: 'Mensaje informativo',
      message: 'Solo puedes activar el carrito si tienes una reserva de mesa activa',
      buttons: ['Entendido'],
    });
    await alert.present();
  }
} 
