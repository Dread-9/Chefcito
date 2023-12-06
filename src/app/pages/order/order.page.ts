import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/interfaceOrder';
import { ToastService } from 'src/app/services/toast.service';
import { SharedService } from '../../services/shared.service';
import { AlertController } from '@ionic/angular';
import socket from '../../componets/socket';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  template: ``
})
export class OrderPage implements OnInit, OnDestroy, OnChanges {

  token: any;
  sharedDataService: SharedService;
  saleId: string | null = null;
  orders: Order[] = [];
  orderStatus: OrderStatus[] = [];
  constructor(
    private toastService: ToastService,
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router,
    sharedDataService: SharedService,
    private alertController: AlertController,
  ) {


    this.sharedDataService = sharedDataService;
    this.saleId = localStorage.getItem('saleId');
    // socket.on("updatedOrder", (order: Order) => {
    //   console.log('Conectando .... ', this.orders);
    //   this.orders = [order, ...this.orders.filter(({ _id }) => !(_id !== order._id))]
    //   console.log('Conectando .... ', this.orders);
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngOnDestroy(): void {

  }

  ionViewWillEnter() {
    this.order();
  }

  allOrdersDelivered(): boolean {
    return this.orders.every(order => order.status === '651b2fdccdeb9672527e1d70');
  }

  async ngOnInit() {
    this.token = this.auth.getToken();
    await this.order();
    this.typeOrder();
  }
  async doRefresh(event: any) {
    this.token = this.auth.getToken();
    await this.order();
    this.typeOrder();
    event.target.complete();
  }
  async order() {
    const saleId = localStorage.getItem('saleId');
    if (!saleId) {
      this.toastService.showToast('No se encontró id de venta ', 'danger', 3000);
      return;
    }
    this.orderService.getOrderById(this.token, saleId).subscribe({
      next: (response) => {
        console.log(response);
        this.orders = response as Order[];
        if (this.allOrdersDelivered()) {
          this.toastService.showToast('¡Puedes pagar la orden!', 'success', 3000);
        }
      },
      error: (error) => {
        const errorData = error.error;
        this.toastService.showToast(errorData.msg, 'danger', 3000);
      }
    });
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
  pay() {
    this.router.navigate(['/clientes', this.token, 'foodmodal', 'order', 'pay']);
  }

  async help() {
    const alert = await this.alertController.create({
      header: 'Mesero',
      mode: 'ios',
      inputs: [
        {
          name: 'Enviar Mesaje a mesero',
          type: 'text',
          placeholder: 'Ingrese un mensaje para el mesero',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            this.toastService.showToast('Mensaje a mesero enviado ', 'success', 3000);
          }
        }
      ]
    });
    await alert.present();
  }

}