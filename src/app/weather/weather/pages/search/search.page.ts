import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { Location as LocationModel } from 'src/app/shared/models/location.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage {

  searchControl = new UntypedFormControl();
  searchResults: LocationModel[] = []
  currentForecast: Forecast;
  todayWeather: CurrentWeather;
  currentCityId: string;
  showList: boolean;
  dropDownclicked: boolean;
  searchclicked: boolean;
  currentLocation: LocationModel;
  regexEnglishOnly = /^[a-zA-Z]+$/;
  maxId: number=0;
  maxCurrentId: number=0;;

  constructor(private locationApi: LocationService,
    public weatherApi: WeatherService,
    private route: ActivatedRoute,
    private router: Router,
    private favorites: FavoritesService,
    private loader:LoaderService,
    private dialog: MatDialog) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.currentCityId = params['locationKey'];
      if (this.currentCityId==undefined){
        this.currentCityId=this.locationApi.defaultLocationKey;
      }
      if(!this.currentLocation)
        this.locationApi.getLocationByKey(this.currentCityId).subscribe(data=>{
          this.currentLocation=data;
      })
        this.getCurrentWeather();
    
    });
   

    this.searchControl.valueChanges.pipe(
    ).subscribe(data => {
      if(data=='')
        this.showList = false;
      else {
      if(this.regexEnglishOnly.test(data))
        this.getLocations(data);
      else{
        this.searchControl.setValue(data.replace(/[^A-Za-z]/g, ''));}
      }
    });

this.weatherApi.temperatureUnitChanged.subscribe(()=>this.getCurrentWeather())

  }
  getLocations(str) {
    
    let id= ++this.maxId;
    console.log(str);
    this.locationApi.getAutocompleteLocation(str).subscribe( 
      data=>{
        if(id>this.maxCurrentId){
          this.maxCurrentId=id;
      this.searchResults = data;
      if (data.length == 0)
        this.showList = false;
    }
    });
  }


  getCurrentWeather() {
    this.weatherApi.getCurrentWeather(this.currentCityId).subscribe(data => {
      this.todayWeather = data;
      this.loader.removeRequest();
    }, err=>{this.loader.removeRequest(); this.handleModalError('Weather has an error: '+err)});

    this.weatherApi.getForecast(this.currentCityId).subscribe(data => {
      this.currentForecast = data;
      this.loader.removeRequest();
    }, err=>{this.loader.removeRequest();
      this.handleModalError('Forecast has an error: '+err)
    });
  }

  handleModalError(msg) {
    alert(msg);
  }

  onSelectLocation(location: LocationModel) {
    this.currentCityId=location.Key;
    this.router.navigate(['search/' + location.Key]);
    this.showList = false;
    this.currentLocation = location;
  }

  setFavorite(location: LocationModel) {
    this.dropDownclicked =true;
    if (location.IsFavorite)
      this.favorites.removeFromFavorites(location.Key);
    else
      this.favorites.addToFavorites(location);
    location.IsFavorite = !location.IsFavorite;
    if(this.currentLocation.Key==location.Key)
      this.currentLocation.IsFavorite=location.IsFavorite;
  }

  onSearchBlur() {
    setTimeout(() => {
      if (this.dropDownclicked ){
         this.dropDownclicked = false;
      }
      else { this.showList=false;this.searchclicked=false}
    }, 300);

  }

  onDropdownFocus(){
    this.dropDownclicked =true;
    this.searchclicked=false;
  }

  onDropdownBlur() {
    setTimeout(() => {
      if (this.searchclicked){
         this.searchclicked=false;
      }
      else { this.showList=false;this.dropDownclicked = false;}
    }, 300);

  }
}

