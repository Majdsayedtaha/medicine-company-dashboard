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
    console.log(event);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0] as File;
      this.upload(file);
    }
  }
  file!: File;
  upload(fileTest: File) {
    // this.saveUserInfoForm.patchValue({
    //   img: file,
    // });
    // this.saveUserInfoForm.get('img')?.updateValueAndValidity();
    this.file = fileTest;
  }
  onReset() {
    this.submitted = false;
    this.saveUserInfoForm.reset();
  }
  onSaveUserInfo() {
    const formData: any = new FormData();
    formData.append('role', 5);
    formData.append('userImage', this.file);
    formData.append('email', this.userDetails.email);
    this.submitted = true;
    // stop here if form is invalid
    if (this.saveUserInfoForm.invalid) {
      return;
    }
    const accessToken = this.userDetails?.getToken;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    };
    this.http
      .post(environment.base + '/site/save-user-info', formData, {
        httpOptions,
      })
      .subscribe((res: any) => {
        if (res.status === 'ok') {
          // TODO HERE SET DYNAMIC VALUES To email and password by using update profile request.
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
          this.auth.user.subscribe(value => {
            console.log(value);
          });
        }
      });
  }
  deleteBackdrop() {
    const e = document.querySelector('.modal-backdrop');
    e?.remove();
  }
}
