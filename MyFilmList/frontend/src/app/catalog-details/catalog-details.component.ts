import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogMovie, CatalogService } from '../services/catalogService';

@Component({
  selector: 'app-catalog-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalog-details.component.html',
  styleUrl: './catalog-details.component.css'
})
export class CatalogDetailsComponent implements OnInit {
  movie?: CatalogMovie;
  loading = false;
  error = '';
  success = '';

  yourScore?: number;
  watched = false;
  onPlanList = true;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Missing movie id';
      return;
    }

    this.loading = true;

    this.catalogService.getCatalogMovieById(id).subscribe({
      next: (res) => {
        this.movie = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Could not load movie';
        this.loading = false;
      }
    });
  }

  addToMyList(): void {
    if (!this.movie) return;

    this.error = '';
    this.success = '';

    const data = {
      yourScore: this.yourScore,
      watched: this.watched,
      onPlanList: this.onPlanList
    };

    this.catalogService.addToMyList(this.movie._id, data).subscribe({
      next: () => {
        this.success = 'Movie added to your list.';
      },
      error: (err) => {
        this.error = err.error?.error || 'Could not add movie';
      }
    });
  }
}