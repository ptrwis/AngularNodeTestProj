import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    private authService: AuthService;

    constructor(private router: Router,
                authService: AuthService) {
      this.authService = authService;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      /*
      if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
      }
      */
      if ( this.authService.isAuth()) {
         return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
      return false;
    }
}
