import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';


interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  region?: string;
  country?: string;
  city?: string;
  specialMark?: string;
}

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    region: '',
    country: '',
    city: '',
    specialMark: '',
  };
  users: User[] = [];
  roles = ['Doctor', 'Pharmacist', ' Sales Representative', 'Scientific representative', 'Agent'];
  constructor() {}
  ngOnInit(): void {}

  onSubmit(userForm: NgForm) {
    this.users.push(userForm.value);
    // console.log(this.user);
    // console.log(this.users);
    // console.log(userForm.value);
    userForm.reset();

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
