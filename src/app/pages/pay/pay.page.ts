import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalNotificationsService } from '../../services/local-notifications.service';
import { ToastService } from '../../services/toast.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/interfaceOrder';
import { SharedService } from '../../services/shared.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { UserService } from 'src/app/services/user.service';

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
  ) {
    this.sharedDataService = sharedDataService;
    this.saleId = localStorage.getItem('saleId');
  }

  ngOnInit() {
    this.token = this.auth.getToken();
    this.token = this.auth.getToken();
    this.order();
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
      },
      error: (error) => {
        const errorData = error.error;
        this.toastService.showToast(errorData.msg, 'danger', 3000);
      }
    });
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
            loading.present();
            const saleId = localStorage.getItem('saleId');
            if (!saleId) {
              this.toastService.showToast('No se encontró saleId en el localStorage', 'danger', 3000);
              return;
            }
            this.orderService.pay(saleId, this.token).subscribe({
              next: (response) => {
                this.generatePDF();
                localStorage.removeItem('saleId');
                this.sharedDataService.setMostrarCarta(false);
                this.router.navigate(['clientes', this.token, 'tab1']);
                this.toastService.showToast('Se ha realizado el pago de manera exitosa', 'success', 3000);
                this.localNotificationsService.scheduleNotification(
                  'Pago de orden',
                  `Se ha realizado el pago de manera exitosa`,
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


  generatePDF(): void {
    const documentDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Boleta de Compra', style: 'header' },
        { text: 'Detalles de la orden:', style: 'subheader' },
        this.generateProductList(),
        { text: `Total a pagar: $${this.getTotalAPagar()} pesos`, style: 'total' },
        { text: `Iva: $${this.getIva()} pesos`, style: 'details' },
        { text: `Propina: $${this.getPropina()} pesos`, style: 'details' },
        { text: '¡Gracias por su compra!', style: 'footer' }
      ],
      styles: {
        header: { fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 15] },
        subheader: { fontSize: 18, bold: true, margin: [0, 15, 0, 5] },
        total: { fontSize: 16, bold: true, margin: [0, 15, 0, 15] },
        details: { fontSize: 14, margin: [0, 5, 0, 5] },
        footer: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 15, 0, 0] },
      },
    };
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.download('boleta_compra.pdf');

    // const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    // pdfDocGenerator.download('boleta_compra.pdf');
    // const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    // pdfDocGenerator.getBlob((blob) => {
    //   const filename = 'boleta_compra.pdf';
    //   const objectURL = URL.createObjectURL(blob);

    //   const mailtoLink = `mailto:${userEmail}?subject=Boleta%20de%20Compra&body=Adjunto%20encontrarás%20la%20boleta%20de%20compra%20en%20formato%20PDF.%0D%0A%0D%0A¡Gracias!&attachment=${objectURL}`;

    //   window.location.href = mailtoLink;
    // });
  }
  generateProductList(): any[] {
    const productList = this.orders.map(order => {
      return [
        { text: order.food.name, style: 'product' },
        { text: `$${order.food.price} pesos`, style: 'price' },
      ];
    });

    return productList;
  }
}
