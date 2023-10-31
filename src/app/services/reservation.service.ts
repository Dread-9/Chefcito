import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as serverEndpoint from '../utils/url'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }
  url = serverEndpoint;

  getReservations(): Observable<any> {
    return this.http.get(this.url.url.urlReservation.reservations.reservation);
  }
}
