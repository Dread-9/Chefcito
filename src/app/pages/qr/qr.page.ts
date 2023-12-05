import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from '../../services/auth.service';
import { catchError, map, of } from 'rxjs';
import { Reservation, Sale } from '../../models/interfaceReservation';
import { SharedService } from '../../services/shared.service';
import { LocalNotificationsService } from '../../services/local-notifications.service';


@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {
  reservations!: Reservation;
  sales!: Sale;

  @ViewChild('video', { static: false }) video!: ElementRef;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput!: ElementRef;

  qrCodeString = 'Bienvenido a Chefcito';
  fechaA!: string;
  user: any;
  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResultAvailable = false;
  scanResult: string | null = null;
  loading!: HTMLIonLoadingElement;
  mostrarCarta: boolean = false;
  tables!: any[];

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private plt: Platform,
    private reservation: ReservationService,
    private router: Router,
    private toastService: ToastService,
    private sharedDataService: SharedService,
    private localNotificationsService: LocalNotificationsService

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
    try {
      const token = this.auth.getToken();
      const inputJSON: string | null = this.scanResult!;
      const parsedInput = JSON.parse(inputJSON);
      const tableValue = parsedInput.table;
      const requestBody = { table: tableValue, user: this.user._id };
      this.reservation.postReservations(token, requestBody)
        .pipe(
          map((response: any) => {
            const reservationData: Reservation = response.reservation;
            const saleData: Sale = response.sale;
            const table = reservationData.table
            const active = reservationData.active
            const saleId = saleData._id;
            this.mostrarCarta = true;
            localStorage.setItem('saleId', saleId);
            localStorage.setItem('table', table);
            localStorage.setItem('active', String(active));
            sessionStorage.setItem('saleId', saleId);
            this.router.navigate(['clientes', token, 'tab2'], {
              queryParams: {
                saleId: saleId,
              }
            });
            this.sharedDataService.setMostrarCarta(true);
            this.localNotificationsService.scheduleNotification(
              'Reserva',
              'Reserva realizada de manera exitosa',
              new Date(new Date().getTime() + 3000)
            );
            this.toastService.showToast('Reserva realizada de manera exitosa', 'success', 3000);
            return response;
          }),
          catchError((error) => {
            const errorData = error.error;
            this.toastService.showToast(errorData.msg, 'danger', 3000);
            return of(null);
          })
        )
        .subscribe();
    } catch (error) {
      this.toastService.showToast('Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.', 'danger', 3000);
    }
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
    this.scanResultAvailable = false;
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
  }

  async startScan() {
    this.scanActive = true;
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
        this.scanResultAvailable = true;
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
            this.scanResultAvailable = true;
            console.log('Respuesta', this.scanResult)
          }
        };
        img.src = URL.createObjectURL(file);
      }
    }
  }
}
