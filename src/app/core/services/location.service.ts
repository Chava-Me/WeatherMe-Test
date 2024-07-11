import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Location } from 'src/app/shared/models/location.model';
import { environment } from 'src/environments/environment';
import { FavoritesService } from './favorites.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private httpClient: HttpClient, 
    private favorites:FavoritesService) {}

   defaultLocationKey='215854';

  getAutocompleteLocation(searchText: string): Observable<Location[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    params = params.append('q', searchText);
    
    return this.httpClient.get<Location[]>('http://dataservice.accuweather.com/locations/v1/cities/autocomplete', { params }).pipe(
      map(data => data.map(item => ({ ...item, IsFavorite: this.favorites.getFavorites().some(u=>u.Key==item.Key) }))) );
  }

  getLocationByKey(locationKey: string): Observable<Location> {
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);

    return this.httpClient.get<Location>(`http://dataservice.accuweather.com/locations/v1/${locationKey}`, { params }).pipe(
      map(data => ({ ...data, IsFavorite: this.favorites.getFavorites().some(u=>u.Key==data.Key)})));
  }

 
}


