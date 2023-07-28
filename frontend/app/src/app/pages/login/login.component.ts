import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {TOKEN_KEY} from '../../constants';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  validateForm: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private notification: NzNotificationService, private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: ['', {updateOn: 'blur', validators: [Validators.required, Validators.email]}],
      password: ['', {updateOn: 'blur', validators: [Validators.required]}],
      remember: [true]
    });
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    this.authService.login(this.validateForm.value.userName, this.validateForm.value.password)
      .subscribe({
        next: (response) => {
          if (this.validateForm.value.remember) {
            localStorage.setItem(TOKEN_KEY, response.token);
          }
          this.router.navigate(['/home']).catch(() => {
          });
        },
        error: (error) => {
          if (error.status === 401) {
            this.notification.create(
              'error',
              'Login Failed',
              'Incorrect username or password.'
            );
          } else {
            this.notification.create(
              'error',
              'Network Error',
              'An unexpected error occurred. Please try again later.'
            );
            console.error('Network error:', error); // log the error to the console
          }
          // aqui posso inserir uma chamada para registrar o log com Sentry ou o LogRocket
        }
      });

  }
}
