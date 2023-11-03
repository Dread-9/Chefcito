import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Food, FoodDetails } from 'src/app/models/interfaceFood';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {
  productDetails: FoodDetails;

  constructor(private route: ActivatedRoute, private foodService: FoodService) {
    this.productDetails = { food: {} as Food, recipe: [] };
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const foodId = params['foodId'];
      this.foodService.getFoodDetailsById(foodId).subscribe((data: FoodDetails) => {
        this.productDetails = data;
      });
    });
  }
}
