import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { NotifierService } from './notifier.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router,private notify:NotifierService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.auth.user.pipe(
      take(1),
      map(user => {
        console.log(user);
        if (user?.role=='5') {
          return true;
        }
         this.notify.errorNotification('Sorry, only managers authorized to login')
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
