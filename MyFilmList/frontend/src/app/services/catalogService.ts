import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CatalogMovie {
  _id: string;
  title: string;
  director?: string;
  year?: number;
  imdbScore?: number;
  actors?: string[];
  genres?: string[];
  synopsis?: string;
  posterUrl?: string;
}

export interface UserMovie {
  _id: string;
  ownerId: string;
  catalogMovieId: string | CatalogMovie;
  watched: boolean;
  onPlanList: boolean;
  yourScore?: number | null;
  watchDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  searchCatalog(query: string): Observable<CatalogMovie[]> {
    return this.http.get<CatalogMovie[]>(`${this.apiUrl}/catalog-movies?q=${encodeURIComponent(query)}`);
  }

  getCatalogAll(): Observable<CatalogMovie[]> {
    return this.http.get<CatalogMovie[]>(`${this.apiUrl}/catalog-movies`);
  }

  addToMyList(catalogMovieId: string): Observable<UserMovie> {
    return this.http.post<UserMovie>(`${this.apiUrl}/user-movies`, { catalogMovieId });
  }

  getMyList(): Observable<UserMovie[]> {
    return this.http.get<UserMovie[]>(`${this.apiUrl}/user-movies`);
  }

  updateUserMovie(id: string, data: Partial<UserMovie>): Observable<UserMovie> {
    return this.http.put<UserMovie>(`${this.apiUrl}/user-movies/${id}`, data);
  }

  deleteUserMovie(id: string): Observable<{ ok: true }> {
    return this.http.delete<{ ok: true }>(`${this.apiUrl}/user-movies/${id}`);
  }
}