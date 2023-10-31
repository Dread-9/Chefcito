import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GestureController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { Food } from '../../models/interfaceFood';

@Component({
  selector: 'app-foodmodal',
  templateUrl: './foodmodal.page.html',
  styleUrls: ['./foodmodal.page.scss'],
})
export class FoodmodalPage implements OnInit {
  @ViewChild('swipeButton', { read: ElementRef }) swipeButton!: ElementRef;
  @Input() carrito!: Food[];
  @Input() onCartItemRemoved!: (producto: Food) => void;

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
    private toastService: ToastService
  ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.createSwipeGesture();
  }

  cerrarModal() {
    this.modalController.dismiss();
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
              this.onCartItemRemoved(producto);
              this.toastService.showToast(`${producto.name} se eliminó del carrito`, 'success', 3000);
            },
          },
        ],
      })
      .then((alert) => alert.present());
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
          this.toastService.showToast('Se ha realizado el pedido', 'success', 3000);
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
}
