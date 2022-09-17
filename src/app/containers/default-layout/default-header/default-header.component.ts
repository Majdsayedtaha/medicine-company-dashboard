import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormControl, FormGroup } from '@angular/forms';

import { faPesoSign } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '@coreui/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit, OnDestroy {
  saveUserInfoForm!: FormGroup;
  submitted: boolean = false;
  faPesoSign = faPesoSign;
  userSubscription$?: Subscription;
  userDetails?: any;

  ngOnInit(): void {
    this.userDetails = this.auth.user.getValue();
    this.userSubscription$ = this.auth.user.subscribe(value => {
      this.userDetails = value;
    });
    this.saveUserInfoForm = this.fb.group({
      regionId: [''],
      cityId: [''],
      countryId: [''],
      specialMark: [''],
      img: [null],
    });
  }
  ngOnDestroy(): void {
    this.userSubscription$?.unsubscribe();
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

  processFile(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.upload(file);
    }
  }
  file!: File;
  upload(fileTest: File) {
    this.file = fileTest;
  }
  onReset() {
    this.submitted = false;
    this.saveUserInfoForm.reset();
  }
  onSaveUserInfo() {
    const formData: any = new FormData();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    formData.append('role', 5);
    formData.append('email', 'admin@admin.com');
    formData.append('userImage', this.file);
    // formData.append('id', this.userDetails?.id);
    this.submitted = true;
    if (this.saveUserInfoForm.invalid) {
      return;
    }

    this.http
      .post(environment.base + '/site/save-user-info', formData, {
        httpOptions,
      })
      .subscribe((res: any) => {
        // this.auth.user.next();
        if (res.status === 'ok') {
          this.http
            .post(environment.base + '/site/login', { email: 'admin@admin.com', password: '11111111' })
            .subscribe((res: any) => {
              if (res.status === 'ok') {
                this.auth.handleAuthentication(
                  res.userInfo.accessToken,
                  res.userInfo.email,
                  res.userInfo.firstName,
                  res.userInfo.lastName,
                  res.userInfo.id,
                  res.userInfo.img,
                  res.userInfo.regionId,
                  res.userInfo.role,
                  res.userInfo.userContacts
                );
              } else {
                console.log(res.details);
              }
            });
        }
      });
  }
  deleteBackdrop() {
    const e = document.querySelector('.modal-backdrop');
    e?.remove();
  }
}
