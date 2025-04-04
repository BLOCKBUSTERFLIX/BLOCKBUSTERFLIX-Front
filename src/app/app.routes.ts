import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { verifyCodeGuard } from './guards/verify-code.guard';

export const routes: Routes = [
    {
        path: '', title: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), children: [
            { path: '', loadComponent: () => import('./principal/principal.component').then(m => m.PrincipalComponent) },
            { path: 'crud/:table', loadComponent: () => import('./entity-read-delete/entity-read-delete.component').then(m => m.EntityReadDeleteComponent)},
            
            { path: 'new/actors', loadComponent: () => import('./create-update/actors/actors.component').then(m => m.ActorsComponent),
                canActivate: [authGuard], 
                data: { roles: [1, 2] }
             },
            { path: 'update/actors/:id', loadComponent: () => import('./create-update/actors/actors.component').then(m => m.ActorsComponent),
                canActivate: [authGuard], 
                data: { roles: [1, 2] }
             },

            { path: 'new/films', loadComponent: () => import('./create-update/films/films.component').then(m => m.FilmsComponent),
                canActivate: [authGuard], 
                data: { roles: [1, 2] }
            },
            { path: 'update/films/:id', loadComponent: () => import('./create-update/films/films.component').then(m => m.FilmsComponent),
                canActivate: [authGuard], 
                data: { roles: [1, 2] }
             },
            
            { path: 'new/cities', loadComponent: () => import('./create-update/cities/cities.component').then(m => m.CitiesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
            },
            { path: 'update/cities/:id', loadComponent: () => import('./create-update/cities/cities.component').then(m => m.CitiesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            
            { path: 'new/countries', loadComponent: () => import('./create-update/countries/countries.component').then(m => m.CountriesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/countries/:id', loadComponent: () => import('./create-update/countries/countries.component').then(m => m.CountriesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            
            { path: 'new/categories', loadComponent: () => import('./create-update/categorias/categorias.component').then(m => m.CategoriasComponent),
                canActivate: [authGuard], 
                data: { roles: [1, 2] }
             },
            { path: 'update/categories/:id', loadComponent: () => import('./create-update/categorias/categorias.component').then(m => m.CategoriasComponent),
                canActivate: [authGuard], 
                data: { roles: [1, 2] }
             },

            { path: 'new/customers', loadComponent: () => import('./create-update/customers/customers.component').then(m => m.CustomersComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/customers/:id', loadComponent: () => import('./create-update/customers/customers.component').then(m => m.CustomersComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },

            { path: 'new/inventories', loadComponent: () => import('./create-update/inventories/inventories.component').then(m => m.InventoriesComponent),
                canActivate: [authGuard], 
                data: { roles: [1,2] }
             },
            { path: 'update/inventories/:id', loadComponent: () => import('./create-update/inventories/inventories.component').then(m => m.InventoriesComponent),
                canActivate: [authGuard], 
                data: { roles: [1,2] }
             },

            { path: 'new/rentals', loadComponent: () => import('./create-update/rentals/rentals.component').then(m => m.RentalsComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/rentals/:id', loadComponent: () => import('./create-update/rentals/rentals.component').then(m => m.RentalsComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },

            { path: 'new/languages', loadComponent: () => import('./create-update/languages/languages.component').then(m => m.LanguagesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/languages/:id', loadComponent: () => import('./create-update/languages/languages.component').then(m => m.LanguagesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },

            { path: 'new/addresses', loadComponent: () => import('./create-update/addresses/addresses.component').then(m => m.AddressesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/addresses/:id', loadComponent: () => import('./create-update/addresses/addresses.component').then(m => m.AddressesComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },

            { path: 'new/stores', loadComponent: () => import('./create-update/stores/stores.component').then(m => m.StoresComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/stores/:id', loadComponent: () => import('./create-update/stores/stores.component').then(m => m.StoresComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },

            { path: 'new/payments', loadComponent: () => import('./create-update/payments/payments.component').then(m => m.PaymentsComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/payments/:id', loadComponent: () => import('./create-update/payments/payments.component').then(m => m.PaymentsComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },

            { path: 'new/staff', loadComponent: () => import('./create-update/staff/staff.component').then(m => m.StaffComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },
            { path: 'update/staff/:id', loadComponent: () => import('./create-update/staff/staff.component').then(m => m.StaffComponent),
                canActivate: [authGuard], 
                data: { roles: [1] }
             },

        ]
    },
    { path: 'forgotten-password', title: 'Password recovery', loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)},
    { path: 'recovery-password', title: 'Recover password', loadComponent: () => import('./auth/recover-password/recover-password.component').then(m => RecoverPasswordComponent),
        canActivate: [verifyCodeGuard]
    },
    { path: 'code', title: 'code', loadComponent: () => import('./auth/code/code.component').then(m => m.CodeComponent),
        canActivate: [verifyCodeGuard]
    },
    { path: 'login', title: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)},
    { path: '403-Forbidden', title: '403 Forbidden', loadComponent: () => import('./error-403/error-403.component').then(m => m.Error403Component)},
    { path: '**', title: 'Not-found', loadComponent: ()=> import('./error-404/error-404.component').then(c => c.Error404Component)}
];
