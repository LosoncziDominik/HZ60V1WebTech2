import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogMovie, CatalogService, UserMovie } from '../services/catalogService';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myList.component.html',
  styleUrl: './myList.component.css'
})
export class MyListComponent implements OnInit {
  items: UserMovie[] = [];
  error = '';

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.loadMyList();
  }

  loadMyList(): void {
    this.catalogService.getMyList().subscribe({
      next: (res) => {
        this.items = res;
      },
      error: (err) => {
        this.error = err.error?.error || 'Could not load your list';
      }
    });
  }

  remove(id: string): void {
    this.catalogService.deleteUserMovie(id).subscribe({
      next: () => this.loadMyList(),
      error: (err) => {
        this.error = err.error?.error || 'Could not remove item';
      }
    });
  }

  markWatched(item: UserMovie): void {
    this.catalogService.updateUserMovie(item._id, {
      watched: true,
      onPlanList: false,
      watchDate: new Date().toISOString()
    }).subscribe({
      next: () => this.loadMyList(),
      error: (err) => {
        this.error = err.error?.error || 'Could not update item';
      }
    });
  }

  getMovie(item: UserMovie): CatalogMovie | null {
    if (typeof item.catalogMovieId === 'object') {
      return item.catalogMovieId;
    }
    return null;
  }
}