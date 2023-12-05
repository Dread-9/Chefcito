import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as serverEndpoint from '../utils/url'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  postOrder(token: string, requestBody: any): Observable<Object> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(serverEndpoint.url.urlOrder.orders.order, requestBody, { headers });
  }

  getOrderById(token: string, ordersale: string): Observable<Object> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const url = `${serverEndpoint.url.urlOrder.orders.orderbysale}/${ordersale}`;
    return this.http.get(url, { headers });
  }

  getState(): Observable<Object> {
    return this.http.get(serverEndpoint.url.urlOrder.orders.typeorder);
  }

  pay(id: string, token: string, body: { tip: number }): Observable<any> {
    const url = `${serverEndpoint.url.urlReservation.reservations.cancelar}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.put(url, body, { headers });
  }
}
