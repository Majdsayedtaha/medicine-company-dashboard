import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormControl, FormGroup } from '@angular/forms';

import { faExchange } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '@coreui/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  saveUserInfoForm!: FormGroup;
  userImg: any;
  submitted: boolean = false;
  faExchange=faExchange
  ngOnInit(): void {
    this.saveUserInfoForm = this.fb.group({
      region: [''],
      city: [''],
      country: [''],
      specialMark: [''],
      img: [null],
    });
  }
  @Input() sidebarId: string = 'sidebar';

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  constructor(private fb: FormBuilder, private auth: AuthService, private http: ApiService) {
    super();
  }
  onLogout() {
    this.auth.logout();
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    this.upload(file);
  }

  upload(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userImage', file.name);
    this.userImg = formData.get('userImage');
  }
  onReset() {
    this.submitted = false;
    this.saveUserInfoForm.reset();
  }
  onSaveUserInfo() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.saveUserInfoForm.invalid) {
      return;
    }
    this.http
      .post(environment.base + '/site/save-user-info', {
        userImage: this.userImg,
        role: 5,
        // regionId: 1,
        specialMark: 'text',
        email: 'admin2@admin.com',
      })
      .subscribe((res: any) => {
        if (res.status === 'ok') {
          this.auth.autoLogin(true,'admin2@admin.com','12345678');
          this.auth.user.subscribe(value => {
            console.log(value);
          });
        }
      });
  }
}
