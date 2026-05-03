import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Movie {
  _id?: string;
  title: string;
  director: string;
  length: number;
  year: number;
  imdbScore?: number;
  yourScore?: number;
  actors?: string[];
  watched?: boolean;
  onPlanList?: boolean;
  synopsis?: string;
  watchDate?: string;
  genres?: string[];
  posterUrl?: string;
}

export interface MovieListResponse {
  items: Movie[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:4222/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(this.apiUrl);
  }

  addMovie(movieData: FormData) {
    return this.http.post<Movie>(this.apiUrl, movieData);
  }

  deleteMovie(id: string): Observable<{ ok: true }> {
    return this.http.delete<{ ok: true }>(`${this.apiUrl}/${id}`);
  }

  updateUserMovie(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}