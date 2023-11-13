import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/interfaceOrder';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  orders: Order[] = [];
  token: any;
  constructor(
    private router: Router,
    private auth: AuthService,
    private orderService: OrderService,
  ) {
  }
  ngOnInit() {
    this.token = this.auth.getToken();
    this.order();
  }
  order() {
    this.orderService.getOrder(this.token).subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        const primeraOrden = orders[0];
      },
      (error) => {
        console.error('Error al obtener la orden:', error);
      }
    );
  }
  pay() {
    this.router.navigate(['/clientes', this.token, 'foodmodal', 'order', 'pay']);
  }
}
