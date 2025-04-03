import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let token = authService.getToken();

  if (token) {
    token = `Bearer ${token}`
    const authReq = req.clone({
      setHeaders: {
        'Authorization': token,
        'Accept': 'application/json',
      }
    });
    return next(authReq);
  }

  return next(req);
};
