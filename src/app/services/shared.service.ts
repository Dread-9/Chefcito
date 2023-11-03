import { Injectable } from '@angular/core';
import { Reservation, Sale } from '../models/interfaceReservation';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private reservations: Reservation | null = null;
  private sales: Sale | null = null;
  constructor() { }

  setReservations(reservation: Reservation) {
    this.reservations = reservation;
  }

  getReservations() {
    return this.reservations;
  }

  setSales(sale: Sale) {
    this.sales = sale;
  }

  getSales() {
    return this.sales;
  }
}
