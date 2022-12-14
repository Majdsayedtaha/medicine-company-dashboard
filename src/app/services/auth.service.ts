import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.model';

// import { TranslateService } from '@ngx-translate/core';
// import { LocalToasterService } from 'src/app/utils/localToaster';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post(environment.base + '/site/login', { email, password });
  }

  handleAuthentication(
    accessToken: string,
    email: string,
    firstName: string,
    lastName: string,
    id: number,
    img: string,
    regionId: number,
    role: string,
    userContacts: string[]
  ) {
    // this.translate.use(lang);
    const user = new User(accessToken, email, firstName, lastName, id, img, regionId, role, userContacts);
    this.user.next(user);
    user.isAuth = true;
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin(email?: string, password?: string) {
    if (!localStorage.getItem('userData') && !(email && password)) {
      return;
    }
    if (localStorage.getItem('userData')) {
      const userData: {
        accessToken: string;
        email: string;
        firstName: string;
        lastName: string;
        id: number;
        img: string;
        regionId: number;
        role: string;
        userContacts: string[];
      } = JSON.parse(localStorage.getItem('userData')!);
      // this.translate.use(userData.lang);
      const loadedUser = new User(
        userData.accessToken,
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.id,
        userData.img,
        userData.regionId,
        userData.role,
        userData.userContacts
      );
      this.user.next(loadedUser);
      loadedUser.isAuth = true;
      // this.router.navigate(['/dashboard']);
    } else if (email && password) {
      this.http.post(environment.base + '/site/login', { email, password }).subscribe((res: any) => {
        if (res.status === 'ok') {
          this.handleAuthentication(
            res.userInfo.accessToken,
            res.userInfo.email,
            res.userInfo.firstName,
            res.userInfo.lastName,
            res.userInfo.id,
            res.userInfo.img,
            res.userInfo.regionId,
            '5',
            res.userInfo.userContacts
          );
          this.router.navigate(['/dashboard']);
        } else {
          console.log(res.details);
        }
      });
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
