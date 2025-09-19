import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {

  loginForm: FormGroup;

  emailErrorMessage: string;
  passwordErrorMessage: string;
  successStatusMessage: string;
  errorStatusMessage: string;



  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    //quando a tela iniciar.

    //inicia o formulario.
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],//campo de email obrigatorio.
      password: ["", [Validators.required]]//campo obrigatorio de senha.
    });

    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.successStatusMessage = "";
    this.errorStatusMessage = "";


  }

  async onLoginClick() {

    this.emailErrorMessage = "";
    this.passwordErrorMessage = "";
    this.successStatusMessage = "";
    this.errorStatusMessage = "";


    console.log("Email", this.loginForm.value.email);
    console.log("Password", this.loginForm.value.password);

    if (this.loginForm.value.email == "") {

      this.emailErrorMessage = "Preecha o email.";
      return;
    }
    if (this.loginForm.value.password == "") {

      this.passwordErrorMessage = "Preencha a senha.";
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

      this.successStatusMessage = "login realizado com sucesso.";
      let json = await response.json();
      console.log("JSON", json);

      let meuToken = json.accessToken;
      let userId =json.user.id;

      localStorage.setItem("meuToken", meuToken)

      localStorage.setItem("meuId", userId)

      this.loginForm.value.email = "";

      window.location.href = "chat";

    } else {

     this.errorStatusMessage = "Senha ou Email incorreta";
    }

     this.cd.detectChanges();




  }

    

}

