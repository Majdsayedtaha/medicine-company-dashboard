import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FormControl, FormGroup } from '@angular/forms';

import { faPesoSign } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '@coreui/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit, OnDestroy {
  saveUserInfoForm!: FormGroup;
  userImg: any;
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
      region: [''],
      city: [''],
      country: [''],
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

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    this.upload(file);
  }

  upload(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    this.userImg = formData.get('file');
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
        email: 'admin@admin.com',
        // regionId: 1,
        // cityId: 1,
        // countryId: 1,
        specialMark: 'text',
      })
      .subscribe((res: any) => {
        if (res.status === 'ok') {
          // TODO HERE SET DYNAMIC VALUES
          this.auth.autoLogin('admin@admin.com', '12345678');
          this.auth.user.subscribe(value => {
            console.log(value);
          });
        }
      });
  }
}
