import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.page.html',
  styleUrls: ['./person-modal.page.scss'],
})
export class PersonModalPage implements OnInit {

  constructor(private modalController: ModalController,) { }

  ngOnInit() {
  }

  cerrarModal() {
    this.modalController.dismiss({
    });
  }



}
