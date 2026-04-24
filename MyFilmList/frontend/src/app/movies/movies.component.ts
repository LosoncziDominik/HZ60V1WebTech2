import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, MovieService } from '../services/movie.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movies.component.html'
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  error = '';

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: res => {
        this.movies = res.items;
      },
      error: err => {
        this.error = err.error?.error || 'Could not load movies';
      }
    });
  }

  deleteMovie(id: string | undefined): void {
    if (!id) return;

    this.movieService.deleteMovie(id).subscribe({
      next: () => this.loadMovies(),
      error: err => {
        this.error = err.error?.error || 'Delete failed';
      }
    });
  }
}