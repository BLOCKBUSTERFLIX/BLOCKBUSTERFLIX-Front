import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.isAuthenticated()){
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles: number[] = route.data?.['roles'] || [];

  const userRole = authService.getUserRole();

  if (requiredRoles.length > 0 && !authService.hasRole(requiredRoles)) {
    router.navigate(['/**']);
    return false;
  }

  return true;
};
