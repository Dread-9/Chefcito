import { Injectable } from '@angular/core';
import { Food } from '../models/interfaceFood';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems: { product: Food; quantity: number; comment?: string }[] = [];

  agregarAlCarrito(producto: Food, comentario?: string) {
    const item = this.cartItems.find((item) => item.product._id === producto._id);
    if (item) {
      item.quantity++;
      if (comentario !== undefined) {
        item.comment = comentario;
      }
    } else {
      const newItem = { product: producto, quantity: 1, comment: comentario };
      this.cartItems.push(newItem);
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

  obtenerComentarioParaPedido() {
    const comentarios = this.cartItems.map(item => item.comment);
    return comentarios.filter(comment => comment !== undefined).join(', ');
  }
}
