//--VALORES GLOBALES--
const disBot = document.getElementById("distrito");
const disSpan= document.getElementById("input-magnitud")

let disUn= false;

function distritoUnico(){
    disUn = !disUn
    if(disUn){
        disBot.innerHTML=
        `
        Distrito Multiple
        `;

        disSpan.innerHTML=      
        `
        <label for="magnitud">Magnitud:</label>
        <input id="magnitud" type="number" placeholder=130>
        </input>
        `;
        return "Distrito Unico Activado"
    } else{
        document.getElement
        disBot.innerHTML=
        `
        Distrito Unico
        `;
        disSpan.innerHTML= ``;
        return "Distrito Unico Desactivado"
    }
}

disBot.addEventListener('click', () => console.log(distritoUnico()));
