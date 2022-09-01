import { Component } from '@angular/core'

import { environment } from 'src/environments/environment';
import { ApiService } from '../../../services/api.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private api: ApiService) { }

  login() {
    this.api
      .post(environment.base +'site/login', {
        email: 'nawlomuhammad@gmail.com',
        password: 'hi this is muhammad',
      })
      .subscribe(() => {
        console.log('WHAT!');
      });
  }
}
