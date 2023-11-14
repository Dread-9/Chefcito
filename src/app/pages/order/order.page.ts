import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/interfaceOrder';
import { Food, FoodDetails } from '../../models/interfaceFood';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  food: Food[] = [];
  foodDetails: FoodDetails[] = [];
  token: any;
  orderId!: any[];
  orderid: string | null = null;
  saleId: string | null = null;
  orders: Order[] = [];
  orderStatus: OrderStatus[] = [];
  constructor(
    private toastService: ToastService,
    private auth: AuthService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.saleId = localStorage.getItem('saleId');
  }
  ngOnInit() {
    this.token = this.auth.getToken();
    this.order();
    this.typeOrder();
    this.orderId = this.route.snapshot.params['orderId'];
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
  // getStatusInfo(statusId: string): { name: string; color: string } {
  //   const status = this.orderStatus.find((s) => s._id === statusId);
  //   if (status) {
  //     switch (status.name) {
  //       case 'Ordenado':
  //         return { name: status.name, color: 'primary' };
  //       case 'Orden Lista':
  //         return { name: status.name, color: 'secondary' };
  //       case 'Entregado':
  //         return { name: status.name, color: 'success' };
  //       case 'Cancelado':
  //         return { name: status.name, color: 'danger' };
  //       default:
  //         return { name: status.name, color: 'medium' };
  //     }
  //   }
  //   return { name: 'Unknown', color: 'warning' };
  // }
  async order() {
    const saleId = localStorage.getItem('saleId');
    if (!saleId) {
      this.toastService.showToast('No se encontró saleId en el localStorage', 'danger', 3000);
      return;
    }
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
  pay() {
    this.router.navigate(['/clientes', this.token, 'foodmodal', 'order', 'pay']);
  }
  help() {
  }
}
