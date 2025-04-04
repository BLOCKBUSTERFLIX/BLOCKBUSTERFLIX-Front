import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const verifyCodeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const url = state.url;

  const verification = localStorage.getItem('verification');
  const validateCode = localStorage.getItem('validate_code');
  const email = localStorage.getItem('email');

  if (url.includes('/code')) {
    if (verification === 'twoFactor' || verification === 'recovery') {
      return true;
    }
  }

  // Acceso a /recover-password
  if (url.includes('/recovery-password')) {
    if (validateCode && email) {
      return true;
    }
  }

  // Cualquier otro caso: redirigir al home (o login si preferís)
  router.navigateByUrl('');
  return false;
};
