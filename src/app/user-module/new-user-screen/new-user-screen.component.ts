import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './new-user-screen.component.html',
  styleUrl: './new-user-screen.component.css'
})
export class NewUserScreenComponent {

  newUserForm: FormGroup;

  emailErrorMessage: string;
  passwordErrorMessage: string;
  successStatusMessage: string;
  errorStatusMessage: string;



  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    // quando a tela iniciar.

    // inicia o formulario.
    this.newUserForm = this.fb.group({
    newUser: ["",[Validators.required]],
    newEmail: ["", [Validators.required]],//campo de email obrigatorio.
    newPassword: ["", [Validators.required]]//campo obrigatorio de senha.
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


    console.log("Email", this.newUserForm.value.email);
    console.log("Password", this.newUserForm.value.password);

    if (this.newUserForm.value.email == "") {

      this.emailErrorMessage = "Preecha o email.";
      return;
    }
    if (this.newUserForm.value.password == "") {

      this.passwordErrorMessage = "Preencha a senha.";
      return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST", //enviar
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.newUserForm.value.email,
        password: this.newUserForm.value.password
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

      this.newUserForm.value.email = "";

      window.location.href = "chat";

    } else {

     this.errorStatusMessage = "Senha ou Email incorreta";
    }

     this.cd.detectChanges();


  }


}
