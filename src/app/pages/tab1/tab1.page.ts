import { Component, NgZone, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { Order, OrderStatus } from 'src/app/models/interfaceOrder';
import { ToastService } from 'src/app/services/toast.service';
import { OrderService } from 'src/app/services/order.service';
import { FoodService } from '../../services/food.service';
import { FoodType } from '../../models/interfaceFood';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
register();
import socket from '../../componets/socket';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  user: any;
  token: any;
  sharedDataService: SharedService;
  saleId: string | null = null;
  orders: Order[] = [];
  orderStatus: OrderStatus[] = [];
  foodTypes: FoodType[] = [];
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    autoplay: {
      delay: 2000,
    }
  };
  banners: string[] = ["../../../assets/icon/Logo.png", "../../../assets/icon/Logo.png", "../../../assets/icon/Logo.png"];
  constructor(
    private toastService: ToastService,
    private userService: UserService,
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router,
    sharedDataService: SharedService,
    private ngZone: NgZone,
    private foodService: FoodService
  ) {
    // socket.on("updatedOrder", (order: Order) => {
    //   console.log('Conectando .... ', order);
    //   this.orders = [order, ...this.orders.filter(({ _id }) => !(_id !== order._id))]
    // });
    this.user = this.userService.getUser();
    this.sharedDataService = sharedDataService;
    this.saleId = localStorage.getItem('saleId');
  }

  async doRefresh(event: any) {
    console.log('Recargando...');
    this.sharedDataService = this.sharedDataService;
    this.saleId = localStorage.getItem('saleId');
    this.getFoodTypes();
    this.token = this.auth.getToken();
    this.order();
    this.typeOrder();
    this.user = this.userService.getUser();
    this.saleId = localStorage.getItem('saleId');
    event.target.complete();
  }

  async ngOnInit() {
    this.token = this.auth.getToken();
    this.order();
    this.typeOrder();
    this.getFoodTypes();
  }

  ionViewWillEnter() {
    this.order();
  }

  allOrdersDelivered(): boolean {
    return this.orders.every(order => order.status === '651b2fdccdeb9672527e1d70');
  }


  async order() {
    const saleId = localStorage.getItem('saleId');
    if (saleId !== null) {
      this.orderService.getOrderById(this.token, saleId).subscribe({
        next: (response) => {
          console.log(response);
          this.orders = response as Order[];
        },
        error: (error) => {
          const errorData = error.error;
          this.toastService.showToast(errorData.msg, 'danger', 3000);
        }
      });
    }
  }
  async typeOrder() {
    this.orderService.getState().subscribe({
      next: (response) => {
        this.orderStatus = response as OrderStatus[];
        console.log('Order Status:', this.orderStatus);
      },
      error: (error) => {
        const errorData = error.error;
        this.toastService.showToast(errorData.msg, 'danger', 3000);
      }
    });
  }
  getStatusName(statusId: string): string {
    const status = this.orderStatus.find((s) => s._id === statusId);
    return status ? status.name : 'Unknown';
  }
  getStatusInfo(statusId: string): { name: string; color: string } {
    const status = this.orderStatus.find((s) => s._id === statusId);
    if (status) {
      switch (status.name) {
        case 'Entregado':
          return { name: status.name, color: 'primary' };
        case 'Ordenado':
          return { name: status.name, color: 'secondary' };
        case 'Orden Lista':
          return { name: status.name, color: 'success' };
        case 'Cancelado':
          return { name: status.name, color: 'danger' };
        default:
          return { name: status.name, color: 'medium' };
      }
    }
    return { name: 'Unknown', color: 'warning' };
  }
  swiperSlideChange(e: any) {
    console.error('Cambio', e);
  }
  getFoodTypes() {
    this.foodService.getFoodType().subscribe(
      (types: FoodType[]) => {
        this.foodTypes = types;
      },
      (error) => {
        console.error('Error fetching food types:', error);
      }
    );
  }

  groupOrdersByFoodName(orders: Order[]): Order[][] {
    const groupedOrders: { [key: string]: Order[] } = {};
    orders.forEach(order => {
      const foodName = order.food.name;
      if (groupedOrders[foodName]) {
        groupedOrders[foodName].push(order);
      } else {
        groupedOrders[foodName] = [order];
      }
    });
    return Object.values(groupedOrders);
  }

  calculateTotalQuantity(orders: Order[]): number {
    return orders.length;
  }

  calculateTotalPrice(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.food.price, 0);
  }
  navigateToSegment(foodTypeId: string) {
    this.router.navigate(['/clientes/' + this.token + '/tab2'], { queryParams: { foodType: foodTypeId } });
  }
}