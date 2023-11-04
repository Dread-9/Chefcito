// services/shopping-cart.service.ts
import { Injectable } from '@angular/core';
import { Food } from '../models/interfaceFood';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems: { product: Food; quantity: number }[] = [];

  agregarAlCarrito(producto: Food) {
    const item = this.cartItems.find((item) => item.product._id === producto._id);
    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ product: producto, quantity: 1 });
    }
  }

  eliminarDelCarrito(producto: Food) {
    const item = this.cartItems.find((item) => item.product._id === producto._id);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        const index = this.cartItems.indexOf(item);
        this.cartItems.splice(index, 1);
      }
    }
  }

  obtenerCarrito() {
    return this.cartItems;
  }

  vaciarCarrito() {
    this.cartItems = [];
  }
}
