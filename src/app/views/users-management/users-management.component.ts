import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { faDownload, faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/interfaces/user.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

interface IUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: number;
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
  user: IUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 5,
    region: '',
    country: '',
    city: '',
    specialMark: '',
  };
  userModel?: User;
  users: IUser[] = [];
  roles = ['Doctor', 'Pharmacist', ' Sales Representative', 'Scientific Representative', 'Agent', 'Company Manager'];
  constructor(private http: ApiService, private router: Router) {}
  faDownload = faDownload;
  faUser = faUser;
  faUpload = faUpload;
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    this.http.get(environment.base + 'site/get-all-users').subscribe((res: any) => {
      if (res.status === 'ok') {
        this.users = res.users;
      } else {
        console.log(res);
      }
    });
  }
  onSubmit(userForm: NgForm) {
    this.http.post(environment.base + '/site/signup', JSON.stringify(userForm.value)).subscribe((res: any) => {
      if (res.status === 'ok') {
        console.log('user added successfully');
        this.loadUsers();
      } else {
        console.log('error');
      }
    });
  }

  // Handling Import Excel Template For Adding New Users
  importingExcel(event: any) {
    this.upload(event.target.files[0]).subscribe((data: any) => {
      if (data.status == 'ok') {
        this.loadUsers();
      } else {
        let tx = '';
        data.errorDetails.forEach((d: any) => {
          tx = tx + '<li>' + d.error + '</li>';
        });
        // this.notifierService.errorNotification(tx, 'Errors');
      }
      ((<HTMLInputElement>document.getElementById('input_file')) as any).value = null;
    });
  }
  importTemplateToEXCEL() {
    this.import().subscribe(response => this.downloadFile(response));
  }
  import() {
    const headerParams = { Authorization: 'Bearer ' + this.userModel?.getToken() };
    return this.http.get(environment.base + 'site/generate-excel-file-template', {
      headers: new HttpHeaders(headerParams),
      observe: 'response',
      responseType: 'arraybuffer',
    });
  }
  upload(file: any): Observable<any> {
    const accessToken = this.userModel?.getToken;
    const headerParams = { Authorization: 'Bearer ' + accessToken };
    const formData = new FormData();
    formData.append('sheet', file, file.name);
    return this.http.post(environment.base + `site/import-excel-file`, formData, {
      headers: new HttpHeaders(headerParams),
    });
  }
  public downloadFile(data: any) {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type'),
    });
    const file = new File([blob], data.headers.get('file-name'), {
      type: data.headers.get('content-type'),
    });
    saveAs(file);
  }
}
