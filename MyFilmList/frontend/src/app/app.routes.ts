import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MoviesComponent } from './movies/movies.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogDetailsComponent } from './catalog-details/catalog-details.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movies', component: MoviesComponent, canActivate: [authGuard] },
  { path: 'add-movie', component: AddMovieComponent },
  { path: 'catalog', component: CatalogComponent, canActivate: [authGuard] },
  { path: 'catalog/:id', component: CatalogDetailsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];