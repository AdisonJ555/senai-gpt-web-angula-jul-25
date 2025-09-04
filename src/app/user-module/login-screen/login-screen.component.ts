import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    //quando a tela iniciar.

    //inicia o formulario.
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],//campo de email obrigatorio.
      password: ["", [Validators.required]]//campo obrigatorio de senha.
    });

  }

  onLoginClick() {

  alert("botao de login clicado.");

  console.log("Email", this.loginForm.value.email);
  console.log("Password", this.loginForm.value.password);

  }
}
