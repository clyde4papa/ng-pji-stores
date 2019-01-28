import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {google} from 'google-maps';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  isTracking = false;
  title = "Papa Johns Store Geolocation Demo";
  location: Geolocation = navigator.geolocation;
  locationAvailable: boolean;

  // Papa Johns Headquarters Position
  defaultPosition: Position = {
    coords: {
      accuracy: 0,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: 38.2135969,
      longitude: -85.53159250000002,
      speed: null,
    },
    timestamp: Date.now()
  };

  // Papa Johns Geolocation Config
  defaultPositionOptions: PositionOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 5000
  };

  currentPosition: Position = this.defaultPosition;
  selectedPosition: Position = this.defaultPosition;
  orderPosition: Array<Position> = [];

  marker: google.maps.Marker;

  ngOnInit() {
    this.locationAvailable = !!this.location;
    if (this.locationAvailable) {
      this.location.watchPosition((position: Position) => {
        console.debug('New Position: ', position);
        console.debug('Update Map Event (New Position)');
        this.currentPosition = position;
      },(error: PositionError) => {
        console.warn('Position Error: ', error);
        console.warn('Update Map Event (Position Error)');
      });
    } else {
      console.debug('PRESENT DIALOGUE ASKING TO ENABLE SCREEN.');
      console.warn('Geolocation not supported in this browser.');
    }
  }

  ngAfterViewInit() {
    if(this.currentPosition) {
      var mapProp = {
        center: new google.maps.LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    } else {
      var mapProp = {
        center: new google.maps.LatLng(this.defaultPosition.coords.latitude, this.defaultPosition.coords.longitude),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
    }
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  ngAfterViewChecked() {

  }

  updateLocation() {

  }

  locationError() {

  }

  findMe() {
    if (this.locationAvailable) {
      this.location.getCurrentPosition((position) => {
        console.debug('Current Position Retreived: ', position);
        this.showPosition(position);
      }, (error) => {
        console.warn('Find Me Error: ', error);
      });
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    this.currentPosition = position;

    let location = new google.maps.LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);
    this.map.panTo(location);
    this.map.setZoom(15);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        title: 'Got you!'
      });
      this.marker.setMap(this.map);
    } else {
      this.marker.setPosition(location);
      this.marker.setMap(this.map);
    }
  }

  trackMe() {
    if(this.locationAvailable) {
      console.debug('Track Me Fired');
      this.isTracking = true;
      this.location.watchPosition((position) => {
        this.showTrackingPosition(position);
      });
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }

  showTrackingPosition(position) {
    console.debug(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    console.debug('Update Map Event (Map Markers Change)');
    this.currentPosition = position;

    let location = new google.maps.LatLng(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);
    this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        title: 'Got you!'
      });
    } else {
      this.marker.setPosition(location);
      this.marker.setMap(this.map);
    }
  }
}
