import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-movie.component.html'
  
})
export class AddMovieComponent {
  form;
  error = '';
  selectedFile: File | null = null;
  scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  status: 'watched' | 'plan' = 'plan';

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [''],
      director: [''],
      length: [0],
      year: [0],
      imdbScore: [null],
      yourScore: [null],
      watched: [false],
      onPlanList: [false],
      synopsis: [''],
      genresText: ['']
      
    });
  }

   onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
      }
    }

  onSubmit(): void {

    console.log('submit clicked');
    console.log(this.form.value);
    console.log(this.form.invalid);

    if (this.form.invalid) return;

    const value = this.form.value;
    const formData = new FormData();

    formData.append('title', value.title!);
    formData.append('director', value.director!);
    formData.append('length', String(value.length));
    formData.append('year', String(value.year));

    if (value.imdbScore !== null && value.imdbScore !== undefined) {
      formData.append('imdbScore', String(value.imdbScore));
    }

   if (value.yourScore !== null && value.yourScore !== undefined) {
      formData.append('yourScore', String(value.yourScore));
    }

    formData.append('watched', String(this.status === 'watched'));
    formData.append('onPlanList', String(this.status === 'plan'));
    formData.append('synopsis', value.synopsis ?? '');

    if (value.genresText) {
      formData.append('genres', value.genresText);
    }

    if (this.selectedFile) {
      formData.append('poster', this.selectedFile);
    }

    this.movieService.addMovie(formData).subscribe({
      next: () => this.router.navigate(['/movies']),
      error: err => {
        console.error('SAVE ERROR:', err);
        this.error = err.error?.error || err.error?.details || 'Could not add movie';
      }
    });
  }

 
}