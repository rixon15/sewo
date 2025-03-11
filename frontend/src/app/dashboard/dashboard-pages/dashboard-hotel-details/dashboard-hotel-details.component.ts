import { ImageViewerComponent } from './../../shared-components/image-viewer/image-viewer.component';
import { GoogleMapsService } from './../../services/google-map.service';
import { CommonModule, Location, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { GoogleMapsModule } from '@angular/google-maps';
import { ConvertAddressService } from '../../services/convert-address.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
  imports: [CommonModule, GoogleMapsModule, NgIf, RouterModule, ImageViewerComponent],
  templateUrl: './dashboard-hotel-details.component.html',
  styleUrl: './dashboard-hotel-details.component.css',
  host: {
    class: 'w-full bg-gray-100 h-full p-8',
  },
  providers: [Location],
})
export class DashboardHotelDetailsComponent implements OnInit {
  hotelData: HotelData | null = null;
  isMapLoaded = false;
  isLoading = true;
  showAllReviews = false;
  isImageViewerOpen = false;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 12;
  markers: google.maps.LatLngLiteral[] = [{ lat: 0, lng: 0 }];

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private googleMapsService: GoogleMapsService,
    private converAddressService: ConvertAddressService,
    private location: Location
  ) {}
  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;

      // Handle route params and fetch data first
      const params = await firstValueFrom(this.route.params);
      const id = params['id'];

      // Fetch hotel data
      await this.fetchHotelData(id);

      // Load Google Maps API in parallel with data fetching
      await Promise.all([
        this.googleMapsService.loadGoogleMaps(),
        this.setupMapCoordinates(),
      ]);

      this.isMapLoaded = true;
      this.isLoading = false; // Only set to false after everything is loaded
    } catch (error) {
      console.error('Error initializing:', error);
      this.isLoading = false;
    }
  }

  private async setupMapCoordinates(): Promise<void> {
    if (!this.hotelData) return;

    return new Promise((resolve, reject) => {
      this.converAddressService
        .convertAddressToCoordinates(this.hotelData!.address)
        .subscribe({
          next: (coordinates) => {
            this.center = coordinates;
            this.markers = [coordinates];
            resolve();
          },
          error: (error) => {
            console.error('Error converting address:', error);
            reject(error);
          },
        });
    });
  }

  private async fetchHotelData(id: number): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: HotelData }>(`${environment.apiUrl}/hotels/${id}`)
      );
      this.hotelData = response.data;
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      throw error;
    }
  }

  goBack() {
    this.location.back();
  }

  parseFloat(num: number): number {
    return this.parseFloat(num);
  }

  toggleShowReviews() {
    this.showAllReviews = !this.showAllReviews;
  }

  toggleImageViewer() {
    this.isImageViewerOpen = !this.isImageViewerOpen;
    console.log(this.isImageViewerOpen);
  }
}
