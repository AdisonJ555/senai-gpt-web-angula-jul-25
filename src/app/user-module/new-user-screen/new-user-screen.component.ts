import { HttpClient } from '@angular/common/http';
import {ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-new-user-screen',
  templateUrl: './new-user-screen.component.html',
  styleUrl: './new-user-screen.component.css',
  imports: [ReactiveFormsModule,HttpClientModule]

})
export class NewUserScreenComponent {

  newUserForm: FormGroup;

  errorName: string;
  emailErrorMessage: string;
  passwordErrorMessage: string;
  successStatusMessage: string;
  errorStatusMessage: string;

  constructor(
    private fb: FormBuilder,
    private http:HttpClient,
    private router: Router
    
  ){
    
    // quando a tela iniciar.

    // inicia o formulario.
    this.newUserForm = this.fb.group({

    Name: ["",[Validators.required]],
    Email: ["", [Validators.required,Validators.email]],//campo de email obrigatorio.
    Password: ["", [Validators.required]],//campo obrigatorio de senha.
    confirmPassword: ["",[Validators.required]],
    });
    this.errorName = "";
    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.successStatusMessage = "";
    this.errorStatusMessage = "";
  }

  async enter() {
    
    this.errorName = "";
    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.successStatusMessage = "";
    this.errorStatusMessage = "";

    console.log("Name", this.newUserForm.value.Name);
    console.log("Email", this.newUserForm.value.Email);
    console.log("Password", this.newUserForm.value.Password);

     if (this.newUserForm.value.Name == "") {

       this.errorName = "Digite o nome do usuario.";
       return;
    }

    if (this.newUserForm.value.Email == "") {

      this.emailErrorMessage = "Preecha o email.";
      return;
    }
    if (this.newUserForm.value.Password !== this.newUserForm.value.confirmPassword) {

      this.passwordErrorMessage = "Senhas não corresponden.";
      return;

    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/users", {
      method: "POST", //enviar
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.newUserForm.value.Name,
        email: this.newUserForm.value.Email,
        password: this.newUserForm.value.Password
      })
    });

    if (response.status >= 200 && response.status <= 299) {

      this.successStatusMessage = "Conta criada com suscesso.";

      let json = await response.json();
      console.log("JSON", json);

      let meuToken = json.accessToken;
      let userId =json.user.id;

      localStorage.setItem("meuToken", meuToken)

      localStorage.setItem("meuId", userId)

      this.newUserForm.value.email = "";

      window.location.href = "users";

    }

    //  this.cd.detectChanges();


  }
}
