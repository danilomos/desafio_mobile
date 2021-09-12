import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private toastCtrl: ToastController
  ) { }

  async showToast(message: string, duration: number = 2000, position: "middle" | "top" | "bottom" = "top") {
    let toast = await this.toastCtrl.create({
      message,
      duration,
      position
    });
    toast.present();
  }
}
