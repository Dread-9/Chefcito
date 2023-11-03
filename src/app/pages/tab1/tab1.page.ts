import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  user: any;
  token: any;
  constructor(
    private userService: UserService,
    private auth: AuthService,) {

  }
  ngOnInit() {
    this.user = this.userService.getUser();
    this.token = this.auth.getToken();
  }
}