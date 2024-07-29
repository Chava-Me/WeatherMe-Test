import { Component, OnInit, Renderer2 } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { WeatherService } from './core/services/weather.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayLoading = false;
  isDark:boolean;
    
  constructor(private loaderService: LoaderService, private weatherService: WeatherService,private renderer: Renderer2,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {

    this.matIconRegistry.addSvgIcon(
      "favorite-icon",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/favorite-icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "empty-favorite-icon",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/empty-favorite-icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "search-icon",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/search-icon.svg")
    );
  }

  ngOnInit() {
    this.loaderService.stateChange.subscribe((loaderState) => {
      setTimeout(() => {
        this.displayLoading = loaderState;
      });
    });
  }

  changeTemperatureUnit() {
    this.weatherService.isMetric = !this.weatherService.isMetric;
    this.weatherService.temperatureUnitChanged.next(null);
  }

  changeMode(){
this.isDark=!this.isDark;
if (this.isDark) {
  this.renderer.addClass(document.body, 'dark-theme');
} else {
  this.renderer.removeClass(document.body, 'dark-theme');
}
  }
}
