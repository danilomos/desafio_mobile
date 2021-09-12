import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { UtilService } from 'src/app/services/util/util.service';

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

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private utilService: UtilService
  ) { }

  async ngOnInit() {
    await this.platform.ready();
    this.loadMap();
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

      this.watchGeolocation();
    } catch (err) {
      console.log(err);
    }
  }

  watchGeolocation() {
    this.geolocation.watchPosition().subscribe((data: any) => {
      console.log(data);
      switch (data.code) {
        case 1:
          this.utilService.showToast(data.message);
          break;
        default:
          this.addMarkerToMap(data.coords);
          break;
      }
    });
  }

  addMarkerToMap(marker) {
    if (marker.latitude === this.actualMarker.latitude && marker.longitude === this.actualMarker.longitude) return;
    this.actualMarker = marker;
    let position = new google.maps.LatLng(marker.latitude, marker.longitude);
    if (!this.mapMarker.latitude) this.mapMarker.setMap(null);
    this.mapMarker = new google.maps.Marker({
      position,
      animation: google.maps.Animation.DROP,
      latitude: marker.latitude,
      longitude: marker.longitude
    });

    this.mapMarker.setMap(this.map);
    this.map.setCenter(position);
  }

}
