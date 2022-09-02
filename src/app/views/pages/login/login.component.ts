import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm!: FormGroup;
  public submitted = false;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {}

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
    
    this.submitted = true;
    if (this.loginForm.valid) {
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;
      
      this.auth.login(email, password).subscribe((res: any) => {
        if (res.status === 'ok') {
          this.auth.handleAuthentication(
            res.userInfo.accessToken,
            res.userInfo.email,
            res.userInfo.id,
            res.userInfo.first_name,
            res.userInfo.last_name,
            res.userInfo.img,
            res.userInfo.regionId,
            res.userInfo.role,
            res.userInfo.userContacts
          );
          this.router.navigate(['/dashboard']);
        } else {
          this.message = res.details;
        }
      });
    }
  }
}
