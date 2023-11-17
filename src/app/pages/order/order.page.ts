import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/interfaceOrder';
import { ToastService } from 'src/app/services/toast.service';
import { SharedService } from '../../services/shared.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/componets/popover/popover.component';
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  template: `
    <ion-list>
      <ion-item (click)="showHelp()">
        <ion-label>Necesitas ayuda</ion-label>
      </ion-item>
    </ion-list>
  `
})
export class OrderPage implements OnInit {
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
  }

  ionViewWillEnter() {
    this.order();
  }

  allOrdersDelivered(): boolean {
    return this.orders.every(order => order.status === '651b3f82faa294650dc1ec28');
  }

  async ngOnInit() {
    this.token = this.auth.getToken();
    await this.order();
    this.typeOrder();
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
  pay() {
    this.router.navigate(['/clientes', this.token, 'foodmodal', 'order', 'pay']);
  }

  async help() {
    const alert = await this.alertController.create({
      header: 'Mesero',
      inputs: [
        {
          name: 'Enviar Mesaje a mesero',
          type: 'text',
          placeholder: 'Ingrese un mensaje para el mesero'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            console.log('Nombre ingresado:', data.inputNombre);
            this.toastService.showToast('Mensaje a mesero enviado ', 'success', 3000);
          }
        }
      ]
    });
    await alert.present();
  }
}