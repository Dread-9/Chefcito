import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationsService {

  private lastNotificationId = 1; // Inicializa con el valor 1

  constructor() { }

  async scheduleNotification(title: string, body: string, schedule: Date) {
    const id = this.lastNotificationId;
    this.lastNotificationId++; // Incrementa el ID para la próxima notificación

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: id,
            schedule: { at: schedule },
          }
        ]
      });
    } catch (error) {
      console.error('Error al programar la notificación', error);
    }
  }

  async cancelNotification(id: number) {
    await LocalNotifications.cancel({
      notifications: [{ id }]
    });
  }
}
