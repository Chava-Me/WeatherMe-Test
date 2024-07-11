import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject,of,map,first } from 'rxjs';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  isMetric = true;

  temperatureUnitChanged = new Subject<null>();

  constructor(private httpClient: HttpClient,
    private loader:LoaderService
  ) {}

  getForecast(locationKey: string): Observable<Forecast> {
    this.loader.addRequest();
    const isMetric = this.isMetric ? 'true' : 'false';

    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    params = params.append('metric', isMetric);

    return this.httpClient.get<Forecast>(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`, { params });
  }

  getCurrentWeather(locationKey: string): Observable<CurrentWeather> {
    this.loader.addRequest();
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);

    return this.httpClient.get<CurrentWeather>(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`, { params })
    .pipe(
        map(array => array[0]),
        first()
      );
  }
}