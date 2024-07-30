import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchPage } from './pages/search/search.page';
import { WeatherRoutingModule } from './weather-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WeatherCardComponent } from './weather-card/weather-card.component';

@NgModule({
  declarations: [SearchPage, WeatherCardComponent],
  imports: [CommonModule, WeatherRoutingModule,ReactiveFormsModule,MatCardModule,MatIconModule],
  exports:[MatIconModule]
})
export class WeatherModule {}
