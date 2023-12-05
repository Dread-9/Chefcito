import { Injectable } from '@angular/core';
import * as serverEndpoint from '../utils/url'
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  url = serverEndpoint;

  constructor(private http: HttpClient) { }

  getCard(token: string): Observable<any> {
    const url = `${serverEndpoint.url.urlCard.card.getCard}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get(url, { headers });
  }
  postCard(token: string, formdata: string): Observable<any> {
    const url = `${serverEndpoint.url.urlCard.card.createCard}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.post(url, formdata, { headers });
  }

  deleteCard(id: string, token: string): Observable<any> {
    const url = `${serverEndpoint.url.urlCard.card.deleteCard}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.delete(url, { headers });
  }
}
