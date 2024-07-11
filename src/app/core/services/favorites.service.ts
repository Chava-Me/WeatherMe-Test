import { Injectable } from '@angular/core';
import { Location } from 'src/app/shared/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: Location[] = [];
  private storageKey: string = 'favoriteCities';

  constructor() {
    this.loadFromLocalStorage();
  }

  addToFavorites(location: Location): void {
    if(!this.favorites.some(u=>u.Key==location.Key)){
      this.favorites.push(location);
      this.saveToLocalStorage();
    }
  }

  removeFromFavorites(locationKey: string): void {
    this.favorites = this.favorites.filter(c => c.Key !== locationKey);
    this.saveToLocalStorage();
  }

  getFavorites(): Location[] {
    return this.favorites;
  }

  private loadFromLocalStorage(): void {
    const storedFavorites = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    this.favorites = storedFavorites;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
  }
}
