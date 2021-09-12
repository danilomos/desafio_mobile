import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async showToast(message: string, duration: number = 5000, position: "middle" | "top" | "bottom" = "top") {
    let toast = await this.toastCtrl.create({
      message,
      duration,
      position
    });
    toast.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      duration: 30000,
      translucent: true,
      mode: "ios",
      spinner: "bubbles"
    });
    return await loading.present();
  }

  hideLoading() {
    this.loadingCtrl.dismiss();
  }
}
