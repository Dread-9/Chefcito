import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recoverpassword',
  templateUrl: './recoverpassword.page.html',
  styleUrls: ['./recoverpassword.page.scss'],
})
export class RecoverpasswordPage implements OnInit {
  roveverpassword = {
    email: '',
  };
  constructor() {
    this.roveverpassword
  }

  ngOnInit() {
  }

}
