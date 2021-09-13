import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Capacitor } from '@capacitor/core'
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    public fireAnalytics: FirebaseAnalytics,
    private angularFireAnalytics: AngularFireAnalytics
  ) { }

  async logEvent(name: string, params: any) {
    try {
      if (Capacitor.isNativePlatform()) {
        await this.fireAnalytics.logEvent(name, params);
      } else {
        await this.angularFireAnalytics.logEvent(name, params);
      }
    } catch (err) {
      throw err;
    }

  }

  async crash() {
    await FirebaseCrashlytics.crash({ message: 'Test' });
  };

  async errorEvent(error) {
    await FirebaseCrashlytics.recordException({
      message: JSON.stringify(error)
    });
  }
}
