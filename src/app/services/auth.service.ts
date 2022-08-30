import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.model';

// TODO: Adding Translation Pipe Library
// TODO: Adding Toast Service
// import { TranslateService } from '@ngx-translate/core';
// import { LocalToasterService } from 'src/app/utils/localToaster';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  constructor(
    private http: HttpClient,
    private router: Router // private translate: TranslateService
  ) {}
  login(data: { email: string; password: string }) {
    return this.http.post(environment.base + '/site/login', data);
  }

  public handleAuthentication(
    email: string,
    userId: number,
    user_name: string,
    company_name: string,
    company_address: string,
    tel_number: string,
    token: string,
    lang: string
  ) {
    // this.translate.use(lang);
    const user = new User(email, userId, user_name, company_name, company_address, tel_number, token, lang);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    if (!localStorage.getItem('userData')) {
      return;
    }

    const userData: {
      email: string;
      userId: number;
      user_name: string;
      company_name: string;
      company_address: string;
      tel_number: string;
      token: string;
      lang: string;
    } = JSON.parse(localStorage.getItem('userData')!);
    // this.translate.use(userData.lang);
    const loadedUser = new User(
      userData.email,
      userData.userId,
      userData.user_name,
      userData.company_name,
      userData.company_address,
      userData.tel_number,
      userData.token,
      userData.lang
    );

    this.user.next(loadedUser);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
  }
}
