import { inject } from "@angular/core"
import { Router } from "@angular/router"

export const authGuard = () => {

const router = inject (Router); //injetando o roteador do projeto.

const token = localStorage.getItem("meuToken"); //Pegar um iten do local storage.

const userId = localStorage.getItem("meuId");

if (token != null && userId != null) {
     return true;

} else{

    localStorage.clear ();

router.navigate(["/login"]);
return false;

}
}