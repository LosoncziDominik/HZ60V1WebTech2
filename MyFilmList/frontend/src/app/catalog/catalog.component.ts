import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogMovie, CatalogService } from '../services/catalogService';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  movies: CatalogMovie[] = [];
  query = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    private catalogService: CatalogService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';

    this.catalogService.getCatalogAll().subscribe({
      next: (res) => {
        this.movies = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Could not load catalog';
        this.loading = false;
      }
    });
  }

  search(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    const trimmed = this.query.trim();

    if (!trimmed) {
      this.loadAll();
      return;
    }

    this.catalogService.searchCatalog(trimmed).subscribe({
      next: (res) => {
        this.movies = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Search failed';
        this.loading = false;
      }
    });
  }

  addToMyList(movieId: string): void {
    this.error = '';
    this.success = '';

    this.catalogService.addToMyList(movieId).subscribe({
      next: () => {
        this.success = 'Movie added to your list.';
      },
      error: (err) => {
        this.error = err.error?.error || 'Could not add movie';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}