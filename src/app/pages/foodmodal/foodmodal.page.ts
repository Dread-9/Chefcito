import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { GestureController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { Food } from '../../models/interfaceFood';
import { AuthService } from '../../services/auth.service';
import { LocalNotificationsService } from '../../services/local-notifications.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-foodmodal',
  templateUrl: './foodmodal.page.html',
  styleUrls: ['./foodmodal.page.scss'],
})
export class FoodmodalPage implements OnInit {
  @Input() botonCarritoModalDeshabilitado!: boolean;
  @Input() reservaActiva!: boolean;
  @ViewChild('swipeButton', { read: ElementRef }) swipeButton!: ElementRef;
  carrito: { product: Food; quantity: number }[] = [];
  token: any;
  color = 'primary';
  text = 'Ordenar';
  swipeInProgress = false;
  colWidth!: number;
  translateX!: number;
  swipeGesture!: any;

  constructor(
    private gestureCtrl: GestureController,
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private toastService: ToastService,
    private orderService: OrderService,
    private auth: AuthService,
    private ngZone: NgZone,
    private localNotificationsService: LocalNotificationsService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.carrito = this.shoppingCartService.obtenerCarrito();
  }

  ngOnInit() {
    this.token = this.auth.getToken();
  }
  ngAfterViewInit() {
    this.createSwipeGesture();
  }

  cerrarModal() {
    this.modalController.dismiss({
      botonCarritoModalDeshabilitado: this.botonCarritoModalDeshabilitado
    });
  }
  private createSwipeGesture() {
    this.swipeGesture = this.gestureCtrl.create({
      el: this.swipeButton.nativeElement,
      threshold: 10,
      gestureName: 'Ordenar',
      onStart: () => {
        this.swipeInProgress = true;
      },
      onMove: (detail) => {
        if (this.swipeInProgress && detail.deltaX > 0) {
          const deltaX = detail.deltaX;
          const colWidth = this.swipeButton.nativeElement.parentElement.clientWidth;
          this.colWidth = colWidth - (15 / 100 * colWidth);
          this.translateX = Math.min(deltaX, this.colWidth);
          this.swipeButton.nativeElement.style.transform = `translateX(${this.translateX}px)`;
        }
      },
      onEnd: (detail) => {
        if (this.translateX >= this.colWidth) {
          this.alertController
            .create({
              header: 'Confirmación',
              message: 'Estas seguro de realizar esta reserva',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                },
                {
                  text: 'Reservar',
                  handler: () => {
                    // this.orderService.postOrder(this.token, '')
                    this.ngZone.run(() => {
                      this.router.navigate(['/clientes', this.token, 'foodmodal', 'order']);
                    });
                    this.modalController.dismiss();
                    this.toastService.showToast('Se ha realizado la orden', 'success', 3000);
                    this.localNotificationsService.scheduleNotification(
                      'Reserva',
                      'Reserva realizada de manera exitosa',
                      new Date(new Date().getTime() + 3000)
                    );
                  },
                },
              ],
            })
            .then((alert) => alert.present());
        }
        this.swipeInProgress = false;
        this.swipeButton.nativeElement.style.transform = 'translateX(0)';
      },
    });
    this.swipeGesture.enable(true);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  eliminarDelCarrito(producto: Food) {
    this.alertController
      .create({
        header: 'Confirmación',
        message: `¿Estás seguro de eliminar "${producto.name}" del carrito?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.shoppingCartService.eliminarDelCarrito(producto);
              if (this.carrito.length === 0) {
                this.botonCarritoModalDeshabilitado = true;
              } else {
                this.botonCarritoModalDeshabilitado = false;
              }
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
  aumentarCantidad(item: { product: Food; quantity: number }) {
    item.quantity++;
  }

  disminuirCantidad(item: { product: Food; quantity: number }) {
    if (item.quantity > 1) {
      item.quantity--;
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
}
