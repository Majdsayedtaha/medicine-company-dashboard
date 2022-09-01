import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
// import { User } from 'src/app/component/auth/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private authserv: AuthService,
    // private toastr: ToastrService,
  ) {}
  updateProfile(user: any) {
    this.http
      .post(environment.base + '/site/save_user_info', user)
      .subscribe((res: any) => {
        if (res.msg === 'ok') {
          this.authserv.handleAuthentication(
            res.user.email,
            res.user.id,
            res.user.username,
            res.user.company_name,
            res.user.company_address,
            res.user.phone,
            res.user.accessToken,
            res.user.lang
          );
          // this.toastr.success(res.details);
          // this.dialog.closeAll()
        } else {
          // this.toastr.error(res.details);
        }
      });
  }
}
