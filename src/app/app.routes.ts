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

            { path: 'new/customers', loadComponent: () => import('./create-update/customers/customers.component').then(m => m.CustomersComponent) },
            { path: 'update/customers/:id', loadComponent: () => import('./create-update/customers/customers.component').then(m => m.CustomersComponent) },

            { path: 'new/inventories', loadComponent: () => import('./create-update/inventories/inventories.component').then(m => m.InventoriesComponent) },
            { path: 'update/inventories/:id', loadComponent: () => import('./create-update/inventories/inventories.component').then(m => m.InventoriesComponent) },

            { path: 'new/rentals', loadComponent: () => import('./create-update/rentals/rentals.component').then(m => m.RentalsComponent) },
            { path: 'update/rentals/:id', loadComponent: () => import('./create-update/rentals/rentals.component').then(m => m.RentalsComponent) },

            { path: 'new/languages', loadComponent: () => import('./create-update/languages/languages.component').then(m => m.LanguagesComponent) },
            { path: 'update/languages/:id', loadComponent: () => import('./create-update/languages/languages.component').then(m => m.LanguagesComponent) },

            { path: 'new/addresses', loadComponent: () => import('./create-update/addresses/addresses.component').then(m => m.AddressesComponent) },
            { path: 'update/addresses/:id', loadComponent: () => import('./create-update/addresses/addresses.component').then(m => m.AddressesComponent) },

            { path: 'new/stores', loadComponent: () => import('./create-update/stores/stores.component').then(m => m.StoresComponent) },
            { path: 'update/stores/:id', loadComponent: () => import('./create-update/stores/stores.component').then(m => m.StoresComponent) },

            //{ path: 'new/payments', loadComponent: () => import('./create-update/payments/payments.component').then(m => m.PaymentsComponent) },
            //{ path: 'update/payments/:id', loadComponent: () => import('./create-update/payments/payments.component').then(m => m.PaymentsComponent) },

            { path: 'new/staff', loadComponent: () => import('./create-update/staff/staff.component').then(m => m.StaffComponent) },
            { path: 'update/staff/:id', loadComponent: () => import('./create-update/staff/staff.component').then(m => m.StaffComponent) },
        ]
    },
    { path: '**', title: 'Not-found', loadComponent: ()=> import('./error-404/error-404.component').then(c => c.Error404Component)}
];
