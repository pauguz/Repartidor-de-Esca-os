//METODOS 
// s: salto
function dhont(votos, magnitud, s=1){
    let avanc=Array.from(Array(votos.length), ()=>0);
    let i=0;
    while(i<magnitud ){
         iterdh(votos, avanc, s);
        i++;
        console.log(votos);
    }
    return avanc;
}


function stlag(votos, magnitud){
    return dhont(votos, magnitud, 2);
}

function hare(votos, magnitud){
    console.log(votos);
    let avanc = Array(votos.length).fill(0);
    let sumaVotos = votos.reduce((a, b) => a + b, 0);
    let q = Math.floor(sumaVotos / magnitud); // Cuota Hare
    console.log("CIFRA: ", q)

    
    let votosRestantes = [...votos];

    // Primera repartición: Por cocientes enteros
    for(let i=0; i < votosRestantes.length; i++){
        let [escañosDirectos, resto] =  cocienteyresto(votosRestantes[i], q);
        avanc[i] = escañosDirectos;
        votosRestantes[i] = resto;
        console.log(i, resto, votosRestantes[i])
        magnitud -= escañosDirectos;
    }
    // Segunda repartición: Por residuos mayores


    let indices =  obtenerIndicesOrdenados(votosRestantes).reverse(); // De mayor a menor residuo
    for(let i=0; i < magnitud; i++){
        avanc[indices[i]]++;
        console.log(indices[i], "...", votosRestantes[ indices[i] ] );
    }
    return avanc;
}

const metodos = new Map([  
    ["dhondt", dhont],
    ["stlag", stlag],
    ["hare", hare],
  ])


function calcular(votos, magnitud, abrev){
    const funcion= metodos.get(abrev);
    return funcion(votos, magnitud);
}

