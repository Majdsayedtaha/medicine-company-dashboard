import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.auth.user.pipe(
      take(1),
      map(user => {
        if (user?.isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}

// if (router.url === '/login') {
//   const isAuth = !!user;
//   if (isAuth) return this.router.createUrlTree(['/dashboard']);
//   return true;
// } else {
//   const isAuth = !!user;
//   if (isAuth) {
//     return true;
//   }
//   return this.router.createUrlTree(['/login']);
// }
