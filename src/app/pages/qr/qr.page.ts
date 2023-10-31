import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  @ViewChild('video', { static: false }) video!: ElementRef;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput!: ElementRef;

  qrCodeString = 'Bienvenido a Chefcito';
  fechaA!: string;
  user: any;

  reservations!: any[];

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult: string | null = null;
  loading!: HTMLIonLoadingElement;

  constructor(
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private reservation: ReservationService,
    private router: Router,
  ) {
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
    }
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.fecha();
  }
  async reserva() {
    this.reservation.getReservations().subscribe((data: any) => {
      this.reservations = data;
    });
    this.router.navigate(['clientes/:user/tab2']);
  }
  fecha() {
    const fechaActual = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    this.fechaA = fechaActual.toLocaleDateString('es-ES', options);
  }
  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }
  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }

  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.videoElement.srcObject = stream;

    this.videoElement.setAttribute('playsinline', true);

    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();

    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null as any;
        this.scanActive = true;
      }

      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
      } else {
        if (this.scanActive) {
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    } else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  captureImage() {
    this.fileinput.nativeElement.click();
  }

  handleFile(files: FileList | null) {
    if (files) {
      const file = files.item(0);
      if (file) {
        var img = new Image();
        img.onload = () => {
          this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
          const imageData = this.canvasContext.getImageData(
            0,
            0,
            this.canvasElement.width,
            this.canvasElement.height
          );
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code) {
            this.scanResult = code.data;
          }
        };
        img.src = URL.createObjectURL(file);
      }
    }
  }
}
