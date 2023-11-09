import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as serverEndpoint from '../utils/url'
import { FoodDetails } from '../models/interfaceFood';

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

  getFoodDetailsById(foodId: string): Observable<FoodDetails> {
    const url = `${serverEndpoint.url.urlFood.foods.food}?id=${foodId}`;
    return this.http.get<FoodDetails>(url);
  }
  getMeasurement(): Observable<any> {
    return this.http.get(serverEndpoint.url.urlFood.foods.measurement);
  }
}
