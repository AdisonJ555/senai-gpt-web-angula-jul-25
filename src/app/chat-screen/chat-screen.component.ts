import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

interface IChat { //para falar os campos que posso ultilizar.

  chatTitle: string;
  id: number;
  userId: string;
}

interface Imessage {
  chatID: number;
  id: number;
  text: string;
  userId: string;
}

@Component({

  selector: 'app-chat-screen',
  imports: [CommonModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.css'

})
export class ChatScreenComponent {

  chats: IChat[];
  chatSelecionado: IChat;
  menssagens: Imessage[];
  menssagemUsuario = new FormControl("");

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {    //controi a classe
    //inicializacao de variaveis.
    this.chats = [];
    this.chatSelecionado = null!;
    this.menssagens = [];
  }
  ngOnInit() {//Executa quando o agula esta pronto para iniciar
    //buscar dados da API.

    this.getChats();

  }

  async getChats() {
    //Metodos que buscar chats da API.
    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    console.log("chat", response)

    if (response) {

      this.chats = response as [];

    } else {

      console.log("Erro ao buscar os chats.")

    }

    this.cd.detectChanges();

  }

  async onChatClick(chatClicado: IChat) {

    console.log("chatClicado", chatClicado);

    this.chatSelecionado = chatClicado;

    //logica para buscar as mensagens



    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/messages?chatId=" + chatClicado.id, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    console.log("MENSSAGENS", response);

    this.menssagens = response as Imessage[];
    this.cd.detectChanges();
  }

  async enviarMenssagen() {

    let novaMenssagenUsuario = {
      chatId: this.chatSelecionado.id,
      userID: localStorage.getItem("meuId"),
      text: this.menssagemUsuario.value
    };

    let novaMenssagenUsuarioResponde = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages",
      novaMenssagenUsuario, {
      headers: {
        "Content-Type": "Aplication/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));
    //atualiza as menssagens da tela.
    await this.onChatClick(this.chatSelecionado);
    //passo 2 enviar a mensagen do usuario para a IA responder

    let respostaIAResponse = await firstValueFrom(this.http.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      "contents": {
        "parts": [
          {
            "text": this.menssagemUsuario.value + ". Me de uma resposta objetiva."
          }
        ]
      }
    }, {
      headers: {
        "Content-Type": "aplication/json",
        "x-goog-api-key": "AIzaSyDV2HECQZLpWJrqCKEbuq7TT5QPKKdLOdo"
      }
    })) as any;

    let novaRespostaIA = {

      chatId: this.chatSelecionado.id,
      userId: "chatbot",
      text: respostaIAResponse.candidates[0].content.parts[0].text
    }

    let novaRespostaIAresponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaRespostaIA, {
      headers: {

        "Content-Type": "Aplication/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")

      }
    }));

    await this.onChatClick(this.chatSelecionado);

  }
}
