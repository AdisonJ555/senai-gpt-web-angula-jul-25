import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

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
  imports: [HttpClientModule, CommonModule],
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.css'

})
export class ChatScreenComponent {

  chats: IChat[];
  chatSelecionado: IChat;
  menssagens: Imessage[];

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


  }

}
