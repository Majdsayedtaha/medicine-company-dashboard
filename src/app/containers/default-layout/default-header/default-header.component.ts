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
      firstName: [this.userDetails.firstName],
      lastName: [this.userDetails.lastName],
      email: [this.userDetails.email],
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
  updateUser() {
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
    //TODO update user
    this.http
      .post(environment.base + '/site/update-user-info', formData, {
        httpOptions,
      })
      .subscribe((res: any) => {
        if (res.status == 'ok') {
          this.auth.handleAuthentication(
            this.userDetails.getToken(),
            this.saveUserInfoForm.value.email,
            this.saveUserInfoForm.value.firstName,
            this.saveUserInfoForm.value.lastName,
            this.userDetails.id,
            this.saveUserInfoForm.value.userImage,
            this.userDetails.value.regionId,
            this.userDetails.value.role,
            this.userDetails.value.contacts
          );
          console.log(this.userDetails);
        }
      });
  }

  deleteBackdrop() {
    const e = document.querySelector('.modal-backdrop');
    e?.remove();
  }
}
