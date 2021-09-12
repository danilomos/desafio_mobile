import { Component } from '@angular/core';
import scriptjs from 'scriptjs';
import config from "../../config";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    scriptjs.get(`https://maps.googleapis.com/maps/api/js?key=${config.googleKey}`, () => console.log("Google Maps Script"));
  }
}
