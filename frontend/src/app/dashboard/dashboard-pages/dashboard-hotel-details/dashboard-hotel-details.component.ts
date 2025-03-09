import { GoogleMapsService } from './../../services/google-map.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { ActivatedRoute } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { ConvertAddressService } from '../../services/convert-address.service';
import { error } from 'console';

interface Image {
  id: number;
  hotel_id: number;
  url: string;
  is_main: false;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
}

interface MainImage extends Omit<Image, 'is_main'> {
  is_main: true;
}

interface Review {
  id: number;
  hotel_id: number;
  user_id: number;
  review_text: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user: User;
}

interface HotelData {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  beds: number;
  baths: number;
  area: number;
  kitchhen: boolean;
  balcony: boolean;
  wifi: boolean;
  parking_area: boolean;
  smoking_area: boolean;
  price: number;
  created_at: string;
  updated_at: boolean;
  reviews_avg_rating: string;
  images: Image[];
  main_image: MainImage;
  reviews: Review[];
  user: { id: number; name: string; email: string; hotel_count: number };
}
@Component({
  selector: 'app-dashboard-hotel-details',
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './dashboard-hotel-details.component.html',
  styleUrl: './dashboard-hotel-details.component.css',
  host: {
    class: 'w-full bg-gray-100 h-full p-8',
  },
})
export class DashboardHotelDetailsComponent implements OnInit {
  hotelData: HotelData | null = null;
  isMapLoaded = false;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 12;
  markers: google.maps.LatLngLiteral[] = [{ lat: 0, lng: 0 }];

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private googleMapsService: GoogleMapsService,
    private converAddressService: ConvertAddressService
  ) {}
  async ngOnInit(): Promise<void> {


    try {
      // Load Google Maps API and wait for it to be ready
      await this.googleMapsService.loadGoogleMaps();
      this.isMapLoaded = true;

      //Handle route params,fetch data then convert the address and  set the coordinates for the center and the marker.
      this.route.params.subscribe(async (params) => {
        const id = params['id'];
        await this.fetchHotelData(id);

        if (this.hotelData) {
          this.converAddressService.convertAddressToCoordinates(this.hotelData.address)
          .subscribe({
            next: (coordinates) => {
              this.center = coordinates;
              this.markers = [coordinates]
            },
            error: (error) => {
              console.error('Error converying address: ', error)
            }
          })
        }
      });
    } catch (error) {
      console.error('Error intializing: ', error);
    }
  }

  private async fetchHotelData(id: number) {
    try {
      this.hotelData = (
        await firstValueFrom(
          this.http.get<{ message: string; data: HotelData }>(
            `${environment.apiUrl}/hotels/${id}`
          )
        )
      ).data;
    } catch (error) {
      console.error('Error fetching the hotel data: ', error);
    }
  }

}
