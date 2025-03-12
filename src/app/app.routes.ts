import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', title: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), children: [
            { path: 'crud/:table', loadComponent: () => import('./principal/principal.component').then(m => m.PrincipalComponent) },
        ]
    },
    { path: '**', title: 'Not-found', loadComponent: ()=> import('./error-404/error-404.component').then(c => c.Error404Component)}
];
