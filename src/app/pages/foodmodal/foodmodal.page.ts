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
import { EMPTY, catchError, concatMap, forkJoin, from, map, of } from 'rxjs';
import { Order } from '../../models/interfaceOrder';

@Component({
  selector: 'app-foodmodal',
  templateUrl: './foodmodal.page.html',
  styleUrls: ['./foodmodal.page.scss'],
})
export class FoodmodalPage implements OnInit {
  @Input() botonCarritoModalDeshabilitado!: boolean;
  @Input() reservaActiva!: boolean;
  @ViewChild('swipeButton', { read: ElementRef }) swipeButton!: ElementRef;
  carrito: { product: Food; quantity: number; comment?: string }[] = [];
  token: any;
  color = 'primary';
  text = 'Ordenar';
  swipeInProgress = false;
  colWidth!: number;
  translateX!: number;
  swipeGesture!: any;
  saleId: string | null = null;
  ordenado = false;
  order!: Order;

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
    this.saleId = localStorage.getItem('saleId');
    this.carrito = this.shoppingCartService.obtenerCarrito();
    // const cartItemsFromStorage = localStorage.getItem('cartItems');
    // if (cartItemsFromStorage) {
    //   this.carrito = JSON.parse(cartItemsFromStorage);
    // }
    this.shoppingCartService.obtenerCarritoObservable().subscribe((carrito) => {
      this.carrito = carrito;
    });
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
        this.swipeInProgress = false;
        const columna = this.swipeButton.nativeElement.parentElement;

        if (this.translateX >= this.colWidth) {
          this.ordenado = true;
          this.alertController
            .create({
              header: 'Confirmación',
              message: '¿Estás seguro de realizar esta reserva?',
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                    this.ordenado = false;
                    columna.style.transform = 'translateX(0)';
                    columna.style.background = 'var(--ion-color-primary)';
                    this.swipeButton.nativeElement.style.transform = 'translateX(0)';
                    this.swipeButton.nativeElement.querySelector('ion-text').innerText = 'Ordenar';
                  },
                },
                {
                  text: 'Ordenar',
                  handler: async (data) => {
                    const sale = localStorage.getItem('saleId');
                    const status = '651b2fdccdeb9672527e1d6f';
                    for (const cartItem of this.carrito) {
                      const food = [cartItem.product._id];
                      const desc = cartItem.comment || 'Ninguno';
                      const requestBody = { food, sale, desc, status };
                      this.orderService.postOrder(this.token, requestBody)
                        .pipe(
                          map((response: any) => {
                            this.ngZone.run(() => {
                              this.router.navigate(['clientes', this.token, 'foodmodal', 'order']);
                            });
                            this.modalController.dismiss();
                            this.ordenado = false;
                            this.shoppingCartService.limpiarCarrito();
                            localStorage.removeItem('cartItems');
                            this.actualizarCarrito([]);
                            this.toastService.showToast('Se ha realizado la orden', 'success', 3000);
                            this.localNotificationsService.scheduleNotification(
                              'Ordenar',
                              'Orden realizada de manera exitosa',
                              new Date(new Date().getTime() + 3000)
                            );
                          }),
                          catchError((error: any) => {
                            console.error(error);
                            const errorData = error.error;
                            this.toastService.showToast(errorData.msg, 'danger', 3000);
                            this.ordenado = false;
                            columna.style.transform = 'translateX(0)';
                            columna.style.background = 'var(--ion-color-primary)';
                            this.swipeButton.nativeElement.style.transform = 'translateX(0)';
                            this.swipeButton.nativeElement.querySelector('ion-text').innerText = 'Ordenar';
                            return EMPTY;
                          })
                        )
                        .subscribe();
                    }
                  },
                },
              ],
            })
            .then((alert) => alert.present());
        } else {
          this.ordenado = false;
          columna.style.transform = 'translateX(0)';
          columna.style.background = 'var(--ion-color-primary)';
          this.swipeButton.nativeElement.style.transform = 'translateX(0)';
          this.swipeButton.nativeElement.querySelector('ion-text').innerText = 'Ordenar';
        }
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
    const nuevoCarrito = this.shoppingCartService.obtenerCarrito().map((cartItem: { product: Food; quantity: number }) => {
      if (cartItem.product._id === item.product._id) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
    this.actualizarCarrito(nuevoCarrito);
  }

  disminuirCantidad(item: { product: Food; quantity: number }) {
    const nuevoCarrito = this.shoppingCartService.obtenerCarrito().map((cartItem: { product: Food; quantity: number }) => {
      if (cartItem.product._id === item.product._id && cartItem.quantity > 1) {
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      }
      return cartItem;
    });
    this.actualizarCarrito(nuevoCarrito);
  }

  private actualizarCarrito(nuevoCarrito: { product: Food; quantity: number }[]) {
    this.shoppingCartService.actualizarCarrito(nuevoCarrito);

    if (nuevoCarrito.length === 0) {
      localStorage.removeItem('cartItems');
      this.shoppingCartService.limpiarCarrito();
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
