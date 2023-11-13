import { Injectable } from '@angular/core';
import { Reservation, Sale } from '../models/interfaceReservation';
import { BehaviorSubject, Observable } from 'rxjs';
import * as serverEndpoint from '../utils/url'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private reservations: Reservation | null = null;
  private sales: Sale | null = null;
  private reservationId: string | null = null;
  private mostrarCartaSubject = new BehaviorSubject<boolean>(true);
  mostrarCarta$: Observable<boolean> = this.mostrarCartaSubject.asObservable();

  constructor(private http: HttpClient) { }

  setMostrarCarta(value: boolean) {
    this.mostrarCartaSubject.next(value);
  }

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

  setReservationId(reservationId: string) {
    this.reservationId = reservationId;
  }

  getReservationId() {
    return this.reservationId;
  }

  DeleteReservation(id: string, token: string): Observable<any> {
    const url = `${serverEndpoint.url.urlReservation.reservations.cancelar}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.put(url, null, { headers });
  }

  getReservation(id: string, token: string): Observable<any> {
    const url = `${serverEndpoint.url.urlReservation.reservations.cancelar}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.put(url, null, { headers });
  }

  getTabla(): Observable<any> {
    return this.http.get(serverEndpoint.url.urlReservation.reservations.table);
  }

}
