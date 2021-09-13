import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { UtilService } from 'src/app/services/util/util.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map', { read: ElementRef, static: false }) mapRef;
  map: any;

  infoWindows: any = [];
  mapMarker: any = {
    latitude: -23.5489,
    longitude: -46.6388
  };
  actualMarker: any = {};
  user: any = {};

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private utilService: UtilService,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  async loadMap() {
    try {
      const location = new google.maps.LatLng(this.mapMarker.latitude, this.mapMarker.longitude);
      const options = {
        center: location,
        zoom: 18,
        disableDefaultUI: true
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);

      await this.checkGPSPermission();
      this.user = await this.authService.getUser();
      const coords = await this.getLocation();
      await this.analyticsService.logEvent("home", { user: this.user.uid, email: this.user.email, coords: this.formatCoords(coords) });
    } catch (err) {
      await this.analyticsService.errorEvent(err);
    }
  }

  watchGeolocation() {
    this.geolocation.watchPosition().subscribe((data: any) => {
      switch (data.code) {
        case 1:
          this.utilService.hideLoading();
          this.utilService.genericAlert("Erro", "Por favor, habilite a sua geolocalização para efeturar a operação.");
          break;
        default:
          this.addMarkerToMap(data.coords);
          break;
      }
    });
  }

  async getLocation() {
    try {
      const position = await this.geolocation.getCurrentPosition();
      return position.coords;
    } catch (err) {
      return err;
    }
  }

  addMarkerToMap(marker) {
    if (marker.latitude === this.actualMarker.latitude && marker.longitude === this.actualMarker.longitude) return;
    this.actualMarker = marker;
    const position = new google.maps.LatLng(marker.latitude, marker.longitude);
    if ("setMap" in this.mapMarker) this.mapMarker.setMap(null);
    this.mapMarker = new google.maps.Marker({
      position,
      animation: google.maps.Animation.DROP,
      latitude: marker.latitude,
      longitude: marker.longitude
    });

    this.mapMarker.setMap(this.map);
    this.map.setCenter(position);

    this.databaseService.addUserPosition({ ...this.user, ...marker });
    this.utilService.hideLoading();
  }

  formatCoords(coords: Geoposition["coords"]) {
    if (coords.latitude) {
      return JSON.stringify({ latitude: coords.latitude, longitude: coords.latitude, accuracy: coords.accuracy });
    }
    return JSON.stringify(coords);
  }

  goToLogin() {
    this.authService.signOut();
  }

  async checkGPSPermission() {
    try {
      const result = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
      if (result.hasPermission) {
        await this.askToTurnOnGPS();
      } else {
        await this.requestGPSPermission();
      }
    } catch (err) {
      this.utilService.hideLoading();
    }
  }

  async requestGPSPermission() {
    const canRequest: boolean = await this.locationAccuracy.canRequest();
    if (!canRequest) {
      await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION);
      this.askToTurnOnGPS();
    } else {
      console.log("requestGPSPermission cannotRequest", canRequest);
    }
  }

  async askToTurnOnGPS() {
    try {
      const res = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      this.watchGeolocation();
    } catch (err) {
      if (err.code !== -1) {
        this.utilService.hideLoading();
        this.utilService.genericAlert("Erro", "Por favor, habilite a sua geolocalização para efeturar a operação.");
      }
    };
  }


}
