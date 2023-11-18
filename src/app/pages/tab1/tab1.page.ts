import { Component, NgZone, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { Order, OrderStatus } from 'src/app/models/interfaceOrder';
import { ToastService } from 'src/app/services/toast.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';

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
  constructor(
    private toastService: ToastService,
    private userService: UserService,
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router,
    sharedDataService: SharedService,
    private ngZone: NgZone,
  ) {
    this.user = this.userService.getUser();
    this.sharedDataService = sharedDataService;
    this.saleId = localStorage.getItem('saleId');
  }

  async ngOnInit() {
    this.token = this.auth.getToken();
    this.order();
    this.typeOrder();
  }

  async doRefresh(event: any) {
    console.log('Recargando...');
    this.token = this.auth.getToken();
    this.order();
    this.typeOrder();
    this.user = this.userService.getUser();
    this.saleId = localStorage.getItem('saleId');
    event.target.complete();
  }

  ionViewWillEnter() {
    this.order();
  }

  allOrdersDelivered(): boolean {
    return this.orders.every(order => order.status === '651b3f82faa294650dc1ec28');
  }


  async order() {
    const saleId = localStorage.getItem('saleId');
    if (saleId !== null) {
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
}