import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  token: any;

  constructor(private router: Router, private auth: AuthService,) { }

  ngOnInit() {
    this.token = this.auth.getToken();
  }
  pay() {
    this.router.navigate(['/clientes', this.token, 'foodmodal', 'order', 'pay']);
  }
}
