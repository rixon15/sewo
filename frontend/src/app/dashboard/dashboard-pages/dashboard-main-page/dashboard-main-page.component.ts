import { HotelCardHorizontalComponent } from './../../shared-components/hotel-card/hotel-card-horizontal/hotel-card-horizontal.component';
import { environment } from './../../../../environments/environments';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HotelCardComponent } from '../../shared-components/hotel-card/hotel-card-vertical/hotel-card.component';
import { Router, RouterModule } from '@angular/router';
interface locationOption {
  value: string;
  label: string;
}

interface locationData {
  name: string;
  country: string;
}

interface HotelResponse {
  data: {
    data: any[];
  };
}

@Component({
  selector: 'app-dashboard-main-page',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectModule,
    CommonModule,
    HotelCardComponent,
    RouterModule,
    HotelCardHorizontalComponent,
  ],
  templateUrl: './dashboard-main-page.component.html',
  styleUrl: './dashboard-main-page.component.css',
  host: {
    class: 'w-full bg-gray-100 h-full p-8',
  },
})
export class DashboardMainPageComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  isLoading: boolean = false;
  locationOptions: locationOption[] | null = null;
  dateOptions: string[] | null = null;
  selectedBuidlingOption: string = '1';
  buildingOptions: {
    value: string;
    label: string;
    disabled?: boolean;
    selected?: boolean;
  }[] = [
    { value: '1', label: 'Rent a building', selected: true },
    { value: '2', label: 'Buy a building', disabled: true },
  ];
  hotelArray: any[] = [];
  hotelByCategory: any[] = [];
  currentCategory: string = 'Popular';
  initialRender = true;
  private categorySubject = new BehaviorSubject<string>('Recommended');
  private categorySubscription: Subscription | null = null;

  async ngOnInit() {
    this.isLoading = true;
    try {
      this.dateOptions = this.generateNextTwoWeeks();

      await this.fetchData();

      //Subscribe to category changes

        this.categorySubscription = this.categorySubject.subscribe(
          async (category) => {
            if(!this.initialRender) {
              this.hotelByCategory = await this.fetchHotelsByCategory(category);
            }
          }
        );
    } finally {
      this.isLoading = false;
      this.initialRender = false;
    }
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  private async fetchData(): Promise<void> {
    this.initialRender = true;
    try {
      const locationPromise = firstValueFrom(
        this.http.get<locationData[]>('assets/locations/locationsRomania.json')
      );

      const hotelsPromise = this.fetchHotels(3);

      // Initial category fetch
      const initialCategoryPromise = this.fetchHotelsByCategory('Recommended');

      const [locationData, hotels, categoryHotels] = await Promise.all([
        locationPromise,
        hotelsPromise,
        initialCategoryPromise,
      ]);

      this.locationOptions = locationData.map(
        (location: locationData, index: number) => ({
          value: index as unknown as string,
          label: location.name,
        })
      );

      this.hotelArray = hotels;
      this.hotelByCategory = categoryHotels;
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  handleSubmit(form: NgForm) {
    const buildingInput = document.querySelector('#BuildingOptions');
    const DateInput = document.querySelector('#DateOptions');
    const LocationInput = document.querySelector('#LocationOptions');

    if (buildingInput && DateInput && LocationInput) {
      this.router.navigate(['/search'], {
        queryParams: {
          building: (buildingInput as HTMLSelectElement).value,
          date: (DateInput as HTMLSelectElement).value,
          location: (LocationInput as HTMLSelectElement).value,
        },
      });
    }
  }

  private generateNextTwoWeeks(): string[] {
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

    const dates: Date[] = [];
    let currentDate = new Date(today);
    while (currentDate <= twoWeeksLater) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const formatter = new Intl.DateTimeFormat('en', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    return dates.map((date) => formatter.format(date));
  }

  private async fetchHotels(limit: number): Promise<any> {
    const response = await firstValueFrom(
      this.http.get<HotelResponse>(
        `${environment.apiUrl}/hotels/list?limit=${limit}`
      )
    );
    return response.data.data;
  }

  private async fetchHotelsByCategory(category: string): Promise<any> {
    const response = await firstValueFrom(
      this.http.get<HotelResponse>(
        `${environment.apiUrl}/hotels/listByCategory?category=${category}&limit=4`
      )
    );

    console.log(response.data.data);

    return response.data.data;
  }

  changeCategory(event: MouseEvent) {
    const newCategory = (event.target as HTMLParagraphElement).innerText;
    this.currentCategory = newCategory;
    this.categorySubject.next(newCategory);
  }
}
