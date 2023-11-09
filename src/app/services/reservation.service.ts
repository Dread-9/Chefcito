import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as serverEndpoint from '../utils/url'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }
  postReservations(token: string, requestBody: any): Observable<Object> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(serverEndpoint.url.urlReservation.reservations.reservation, requestBody, { headers });
  }
}
