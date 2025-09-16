import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';

interface IChat { //para falar os campos que posso ultilizar.

  chatTitle: string;
  id: number;
  userId: string;
}

@Component({
  selector: 'app-chat-screen',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './chat-screen.component.html',
  styleUrl: './chat-screen.component.css'
})
export class ChatScreenComponent {

  chats:IChat[];

  constructor(private http:HttpClient) {    //controi a classe
                  //inicializacao de variaveis.
                  this.chats = [];
  }
  ngOnInit(){//Executa quando o agula esta pronto para iniciar
              //buscar dados da API.

    this.getChats();

  }

  async getChats() {
   //Metodos que buscar chats da API.
   let response = await this.http.get("https://senai-gpt-api.azurewebsites.net/chats",{
   headers:{
   
    "Authorization" : "Bearer " + localStorage.getItem("meuToken") 
  }
}).toPromise();
   
if (response) {

  this.chats = response as [];
  
} else {

  console.log("Erro ao buscar os chats.")
  
}
  

  }

}
