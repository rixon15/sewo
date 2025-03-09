import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../environments/environments";

interface GeocodeResponse {
    status: string;
    results: Array<{
      geometry: {
        location: {
          lat: number;
          lng: number;
        }
      }
    }>;
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class ConvertAddressService {
    constructor(private http: HttpClient) {}
  
    convertAddressToCoordinates(address: string): Observable<google.maps.LatLngLiteral> {
      const encodedAddress = encodeURIComponent(address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${environment.googleMapsApiKey}`;
  
      return this.http.get<GeocodeResponse>(url).pipe(
        map((response: any) => {
          console.log('Raw geocoding response:', response);
          
          if (response.status === 'OK' && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            console.log('Converted coordinates:', location);
            
            return {
              lat: location.lat,
              lng: location.lng
            };
          }
          throw new Error('Geocoding failed: ' + response.status);
        })
      );
    }
  }