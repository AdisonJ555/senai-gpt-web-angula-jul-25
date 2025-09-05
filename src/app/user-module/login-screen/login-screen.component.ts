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

  async onLoginClick() {


    console.log("Email", this.loginForm.value.email);
    console.log("Password", this.loginForm.value.password);

    if(this.loginForm.value.email == ""){
      alert("Preecha o email.");
    return;
    }
    if(this.loginForm.value.password == ""){

      alert("Preencha a senha.");
    return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST", //enviar
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    })
    });

    if (response.status >= 200 && response.status <= 299) {

      alert("login ok");
      
    } else {

        alert("Senha ou Email incorreta"); }
 
    
      
    }

}

