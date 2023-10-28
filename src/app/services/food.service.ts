import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as serverEndpoint from '../utils/url'

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  url = serverEndpoint;

  constructor(private http: HttpClient) { }

  getFoodType(): Observable<any> {
    return this.http.get(serverEndpoint.url.urlFood.foods.typefood);
  }
  getFoodList(): Observable<any> {
    return this.http.get(serverEndpoint.url.urlFood.foods.food);
  }

}
