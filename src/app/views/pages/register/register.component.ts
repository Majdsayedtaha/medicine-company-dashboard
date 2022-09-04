import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { MustMatch } from '../../../helpers/must-match.validator';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted: boolean = false;
  message: string = '';
  userImg: any;
  // TODO Send Role

  constructor(private fb: FormBuilder, private http: ApiService, private router: Router, private auth: AuthService) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      } as AbstractControlOptions
    );
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onRegister() {
    console.log(this.userImg);
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    console.log(JSON.stringify(this.registerForm.value))
    this.http.post(environment.base + '/site/signup', JSON.stringify(this.registerForm.value)).subscribe((res: any) => {
      if (res.status === 'ok') {
        const data = {
          email: this.registerForm.controls['email'].value,
          password: this.registerForm.controls['password'].value,
        };
        this.auth.autoLogin(data.email, data.password);
      } else {
        // TODO Handle email taken before as warning
        this.message = res.details;
      }
    });


    // console.log(JSON.stringify(this.registerForm.value, null, 4))
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
    this.router.navigate(['/login']);
  }
  // processFile(imageInput: any) {
  //   const file: File = imageInput.files[0];
  //   this.upload(file);
  // }

  // upload(file: any) {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('userImage', file.name);
  //   this.userImg = formData.get('userImage');
  // }
}
