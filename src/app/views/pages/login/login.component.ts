import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm!: FormGroup;
  public submitted = false;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private http: ApiService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }

  onLogin(): void {
    // console.log(this.loginForm.value);
    this.submitted = true;
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.http.post(environment.base + '/site/login', JSON.stringify(this.loginForm.value)).subscribe((res: any) => {
        if (res.status === 'ok') {
          localStorage.setItem('userData', JSON.stringify(res.userInfo));
          this.router.navigate(['/dashboard']);
        } else {
          // TODO Handle email Taken before
          this.message = res.details;
        }
      });
    }
  }
}
