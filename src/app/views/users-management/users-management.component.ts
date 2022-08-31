import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {}
  login() {
    this.api
      .post(environment.base + 'site/login', {
        email: 'nawlomuhammad@gmail.com',
        password: 'hi this is muhammad',
      })
      .subscribe(() => {
        console.log('WHAT!');
      });
  }
}
