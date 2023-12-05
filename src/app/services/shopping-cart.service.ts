import { Injectable } from '@angular/core';
import { Food } from '../models/interfaceFood';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartItems: { product: Food; quantity: number; comment?: string }[] = [];
  private cartSubject: BehaviorSubject<{ product: Food; quantity: number; comment?: string }[]> = new BehaviorSubject<{ product: Food; quantity: number; comment?: string }[]>([]);

  constructor() {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartSubject.next([...this.cartItems]); // Notificar cambios
    }
  }
  agregarAlCarrito(producto: Food, comentario?: string) {
    const item = this.cartItems.find((item) => item.product._id === producto._id);
    if (item) {
      item.quantity++;
      if (comentario !== undefined) {
        item.comment = comentario.trim() !== '' ? comentario : 'Ninguno';
      }
    } else {
      const newItem = {
        product: producto,
        quantity: 1,
        comment: comentario !== undefined && comentario.trim() !== '' ? comentario : 'Ninguno',
      };
      this.cartItems.push(newItem);
    }
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems)); // Actualizar localStorage
    this.cartSubject.next([...this.cartItems]);
  }
  eliminarDelCarrito(producto: Food) {
    const itemIndex = this.cartItems.findIndex((item) => item.product._id === producto._id);
    if (itemIndex !== -1) {
      if (this.cartItems[itemIndex].quantity > 1) {
        this.cartItems[itemIndex].quantity--;
      } else {
        this.cartItems.splice(itemIndex, 1);
      }
      localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
      this.cartSubject.next([...this.cartItems]);
    }
  }
  obtenerCarritoObservable(): Observable<{ product: Food; quantity: number; comment?: string }[]> {
    return this.cartSubject.asObservable();
  }

  actualizarCarrito(nuevoCarrito: { product: Food; quantity: number; comment?: string }[]) {
    this.cartItems = nuevoCarrito;
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
  }
  obtenerCarrito() {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  obtenerComentarioParaPedido() {
    const comentarios = this.cartItems.map(item => item.comment);
    return comentarios.filter(comment => comment !== 'Ninguno').join(', ');
  }

  limpiarCarrito() {
    this.cartItems = [];
  }
}
