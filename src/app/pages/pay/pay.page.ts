import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalNotificationsService } from '../../services/local-notifications.service';
import { ToastService } from '../../services/toast.service';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/interfaceOrder';
import { SharedService } from '../../services/shared.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { UserService } from 'src/app/services/user.service';
import jsPDF, { jsPDFAPI } from 'jspdf';
import { ModalController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/componets/popover/popover.component';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
  token: any;
  saleId: string | null = null;
  orders: Order[] = [];
  propinaIngresada: number | null = null;
  sharedDataService: SharedService;
  user: any;
  userEmail!: string;
  mostrarCarta: boolean = false;
  showContent: boolean = true;
  showPaymentElement: boolean = false;
  isActionSheetOpen = false;
  constructor(
    private toastService: ToastService,
    private auth: AuthService,
    private router: Router,
    private localNotificationsService: LocalNotificationsService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private orderService: OrderService,
    sharedDataService: SharedService,
    private userService: UserService,
    private modalController: ModalController,
    public actionSheetController: ActionSheetController
  ) {
    this.sharedDataService = sharedDataService;
    this.saleId = localStorage.getItem('saleId');
    this.sharedDataService.mostrarCarta$.subscribe((mostrarCarta) => {
      this.mostrarCarta = mostrarCarta;
    });

  }

  ngOnInit() {
    this.token = this.auth.getToken();
    const saleId = localStorage.getItem('saleId');
    if (!saleId) {
      this.toastService.showToast('No se encontró id de venta ', 'danger', 3000);
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
    this.user = this.userService.getUser();
    this.userEmail = this.user.mail;
    console.log('Correo electrónico del usuario:', this.userEmail);
  }


  getTotal(): number {
    let total = 0;
    if (this.orders && this.orders.length > 0) {
      total = this.orders.reduce((acc, order) => acc + order.food.price, 0);
    }
    return total;
  }
  getIva(): number {
    const totalProductos = this.getTotal();
    const iva = totalProductos * 0.19;
    return iva;
  }
  getPropinaSugerida(): number {
    const totalProductos = this.getTotal();
    return totalProductos * 0.1;
  }

  getPropina(): number {
    const totalProductos = this.getTotal();
    if (this.propinaIngresada !== null) {
      return this.propinaIngresada;
    } else {
      return totalProductos * 0.1;
    }
  }

  getTotalAPagar(): number {
    const totalProductos = this.getTotal();
    const iva = this.getIva();
    let propina = this.getPropina();

    if (this.propinaIngresada !== null) {
      propina = this.propinaIngresada;
    }
    const totalPagar = totalProductos + iva + propina;
    return totalPagar;
  }

  async abrirActionSheet() {
    let pedidoText = '';
    if (this.orders && this.orders.length > 0) {
      pedidoText = 'Detalles del pedido:\n';
      this.orders.forEach(order => {
        pedidoText += `- ${order.food.name} - $${order.food.price} pesos\n`;
      });
    } else {
      pedidoText = 'No hay pedidos.';
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Pagar',
      mode: 'ios',
      buttons: [
        {
          text: 'Hacer Pedido',
          handler: () => {
            this.pago();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]
    });

    await actionSheet.present();
  }


  async pago() {
    const loading = await this.loadingController.create({
      message: 'Generando Pago...',
      duration: 3000
    });
    const alert = await this.alertController.create({
      header: 'Generar Pago',
      message: '¿Estás seguro de realizar este pago?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Pagar',
          handler: async () => {
            const saleId = localStorage.getItem('saleId');
            if (!saleId) {
              this.toastService.showToast('No se encontró Id de venta', 'danger', 3000);
              return;
            }
            const tip = this.getPropina()
            this.orderService.pay(saleId, this.token, { tip }).subscribe({
              next: (response) => {
                localStorage.removeItem('saleId');
                localStorage.removeItem('table');
                localStorage.removeItem('active');
                sessionStorage.removeItem('saleId');
                this.mostrarCarta = false;
                loading.present();
                this.router.navigate(['clientes', this.token, 'tab1']);
                this.toastService.showToast('Se ha realizado el pago de manera exitosa', 'success', 3000);
                this.localNotificationsService.scheduleNotification(
                  'Pago de orden',
                  `Se ha realizado el pago de manera exitosa`,
                  new Date(new Date().getTime() + 3000)
                );
                // setTimeout(() => {
                //   loading.present();
                //   this.router.navigate(['clientes', this.token, 'tab1']);
                //   this.toastService.showToast('Se ha realizado el pago de manera exitosa', 'success', 3000);
                //   this.localNotificationsService.scheduleNotification(
                //     'Pago de orden',
                //     `Se ha realizado el pago de manera exitosa`,
                //     new Date(new Date().getTime() + 3000)
                //   );
                // }, 10000);
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
}
