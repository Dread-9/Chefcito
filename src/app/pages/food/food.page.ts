import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Food, FoodDetails } from 'src/app/models/interfaceFood';
import { FoodService } from 'src/app/services/food.service';
import { ModalController } from '@ionic/angular';
import { FoodmodalPage } from '../foodmodal/foodmodal.page';
import { AlertController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {
  productDetails: FoodDetails;
  carrito: Food[] = [];

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastService: ToastService,
  ) {
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
