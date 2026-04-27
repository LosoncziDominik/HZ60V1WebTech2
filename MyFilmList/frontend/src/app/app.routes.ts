import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MoviesComponent } from './movies/movies.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { CatalogComponent } from './catalog/catalog.component';
import { MyListComponent } from './myList/myList.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movies', component: MoviesComponent, canActivate: [authGuard] },
  { path: 'add-movie', component: AddMovieComponent },
  { path: 'catalog', component: CatalogComponent, canActivate: [authGuard] },
  { path: 'my-list', component: MyListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];