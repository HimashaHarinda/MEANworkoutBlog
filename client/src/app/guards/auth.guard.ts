import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    rediectUrl;

    constructor(
        private authService: AuthService,
        private router: Router
    ){}



  canActivate(
      router: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ) {
    
    if (this.authService.loggedIn()) {
        return true;
    }else{
        this.rediectUrl = state.url;
        this.router.navigate(['/login']);
        return false;
    }
  }
}