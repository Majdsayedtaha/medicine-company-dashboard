import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
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

  constructor(private fb: FormBuilder, private http: ApiService, private router: Router) {}
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

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.http.post(environment.base + '/site/signup', JSON.stringify(this.registerForm.value)).subscribe((res: any) => {
      if (res.status === 'ok') {
        // TODO Should Put Here Auto Login
      } else {
        // TODO Handle email Taken before
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
}
