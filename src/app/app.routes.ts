import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', title: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), children: [
            { path: '', loadComponent: () => import('./principal/principal.component').then(m => m.PrincipalComponent) },
            { path: 'crud/:table', loadComponent: () => import('./entity-read-delete/entity-read-delete.component').then(m => m.EntityReadDeleteComponent) },
            
            { path: 'new/actors', loadComponent: () => import('./create-update/actors/actors.component').then(m => m.ActorsComponent) },
            { path: 'update/actors/:id', loadComponent: () => import('./create-update/actors/actors.component').then(m => m.ActorsComponent) },

            { path: 'new/films', loadComponent: () => import('./create-update/films/films.component').then(m => m.FilmsComponent) },
            { path: 'update/films/:id', loadComponent: () => import('./create-update/films/films.component').then(m => m.FilmsComponent) },
            
            { path: 'new/cities', loadComponent: () => import('./create-update/cities/cities.component').then(m => m.CitiesComponent) },
            { path: 'update/cities/:id', loadComponent: () => import('./create-update/cities/cities.component').then(m => m.CitiesComponent) },
            
            { path: 'new/countries', loadComponent: () => import('./create-update/countries/countries.component').then(m => m.CountriesComponent) },
            { path: 'update/countries/:id', loadComponent: () => import('./create-update/countries/countries.component').then(m => m.CountriesComponent) },
            
            { path: 'new/categories', loadComponent: () => import('./create-update/categorias/categorias.component').then(m => m.CategoriasComponent) },
            { path: 'update/categories/:id', loadComponent: () => import('./create-update/categorias/categorias.component').then(m => m.CategoriasComponent) },
        ]
    },
    { path: '**', title: 'Not-found', loadComponent: ()=> import('./error-404/error-404.component').then(c => c.Error404Component)}
];
