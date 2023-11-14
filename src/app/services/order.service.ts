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
  // getOrder(token: string): Observable<Order[]> {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.get<Order[]>(serverEndpoint.url.urlOrder.orders.order, { headers });
  // }
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
}
