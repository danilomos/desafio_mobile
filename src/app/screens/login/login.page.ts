import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util/util.service';

const emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
const validationsMessages = {
  email: [
    { type: 'required', message: 'Email obrigatório.' },
    { type: 'pattern', message: 'Email inválido.' }
  ],
  password: [
    { type: 'required', message: 'Senha obrigatória.' }
  ]
};

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  validationsMessages = validationsMessages;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private analyticsService: AnalyticsService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() { }

  async submitForm() {
    try {
      const { value } = this.loginForm;
      await this.utilService.showLoading();
      const user: any = await this.authService.signIn(value);
      await this.analyticsService.logEvent("login", { user: user.uid, email: user.email, loginAt: user.lastLoginAt })
      await this.router.navigateByUrl("/home");
    } catch (err) {
      await this.analyticsService.errorEvent(err);
      this.utilService.hideLoading();
      this.utilService.showToast("Dados errados ou usuário inexistente.");
    }
  }

  showError(fieldName, type) {
    const field = this.loginForm.get(fieldName);
    return field.hasError(type) && (field.dirty || field.touched);
  }

}
