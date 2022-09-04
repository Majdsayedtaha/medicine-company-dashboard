import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// Fontawesome
import { faDownload, faUser } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

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
  constructor(private http: ApiService) {}
  faDownload = faDownload;
  faUser = faUser;
  ngOnInit(): void {}

  onSubmit(userForm: NgForm) {
    console.log('Het');
    this.http
      .post(environment.base + 'category/add', {
        deletedCategories: [],
        categories: [
          {
            id: '1',
            name: 'testt',
          },
        ],
      })
      .subscribe((res: any) => {
        console.log(res);
      });
    // this.users.push(userForm.value);
    // console.log(this.user);
    // console.log(this.users);
    // console.log(userForm.value);
    // userForm.reset();
  }
}
