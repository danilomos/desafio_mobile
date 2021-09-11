import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    public formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() { }

  submitForm() {
    console.log(this.loginForm.value);
  }

  showError(field) {
    return this.loginForm.get(field).hasError(this.validationsMessages[field])
      && (this.loginForm.get(field).dirty || this.loginForm.get(field).touched);
  }

}
