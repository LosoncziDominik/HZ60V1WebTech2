import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, MovieService } from '../services/movie.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './movies.component.html'
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  error = '';

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private router: Router
  ) {}

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}