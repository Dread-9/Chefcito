import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as serverEndpoint from '../utils/url'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  http: any;

  constructor() { }

  postOrder(token: string, desc: any): Observable<Object> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(serverEndpoint.url.urlOrder.orders.order, desc, { headers });
  }
}
