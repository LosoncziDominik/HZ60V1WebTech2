import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-movie.component.html'
  
})
export class AddMovieComponent {
  form;
  error = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      director: ['', Validators.required],
      length: [0, [Validators.required, Validators.min(1)]],
      year: [0, [Validators.required, Validators.min(1888)]],
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

    formData.append('watched', String(value.watched ?? false));
    formData.append('onPlanList', String(value.onPlanList ?? false));
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