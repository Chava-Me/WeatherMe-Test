import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchPage } from './pages/search/search.page';
import { WeatherRoutingModule } from './weather-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [SearchPage],
  imports: [CommonModule, WeatherRoutingModule,ReactiveFormsModule,MatCardModule],
})
export class WeatherModule {}
