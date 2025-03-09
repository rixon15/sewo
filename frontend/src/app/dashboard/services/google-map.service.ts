import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";


@Injectable({
    providedIn: 'root'
})
export class GoogleMapsService {
    private isLoaded = false;
    private loadingPromise: Promise<void> | null = null;


    async loadGoogleMaps(): Promise<void> {
        if(this.isLoaded) {
            return Promise.resolve();
        }

        if(this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                this.isLoaded = true;
                resolve();
            };

            script.onerror = () => {
                reject(new Error('Failed to load Google Maps APi'))
            }

            document.body.appendChild(script);
        })

        return this.loadingPromise;
    }

    isGoogleMapsLoadad(): boolean {
        return this.isLoaded;
    }
}