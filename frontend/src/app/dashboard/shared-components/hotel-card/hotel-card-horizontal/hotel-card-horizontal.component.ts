import { Component, Input } from '@angular/core';

interface HotelImage {
  id: number;
  hotel_id: number;
  url: string;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

interface Hotel {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  star_rating: string;
  beds: number;
  baths: number;
  area: number;
  kitchen: boolean;
  balcony: boolean;
  wifi: boolean;
  parking_area: boolean;
  smoking_area: boolean;
  created_at: string;
  updated_at: string;
  images: HotelImage;
  main_image: HotelImage;
  price: number;
}
@Component({
  selector: 'app-hotel-card-horizontal',
  imports: [],
  templateUrl: './hotel-card-horizontal.component.html',
  styleUrl: './hotel-card-horizontal.component.css'
})
export class HotelCardHorizontalComponent {

  @Input() hotel: Hotel | null = null;

}
