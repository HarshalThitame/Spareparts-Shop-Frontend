import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {LoginService} from "../service/login.service";

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isLoggedIn() && loginService.getUserRole() === 'ADMIN') {
    return true;
  }

  router.navigate(['']);
  return false;
};
