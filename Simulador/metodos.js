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


function calcularMatriz(matrizVotos, metodoSeleccionado){

        // Objeto para acumular escaños totales por partido a nivel nacional
        let escañosTotalesPorPartido = {};
        matrizVotos.forEach(p => escañosTotalesPorPartido[p.DESCRIPCION_OP] = 0);
    
        // Iteramos por cada circunscripción (columna)
        nombresCircunscripciones.forEach(region => {
            const cantEscaños = magnitudes[region]; // Valor de la última fila
            if (!cantEscaños || cantEscaños <= 0) return;
    
            // Extraer solo los votos de esta región
            let votosRegion = matrizVotos.map(p => parseFloat(p[region]) || 0);
    
            // Mapear el nombre del select a tu función de matematiqueria.js
            let resultadoRegion;
            const copiaVotos = [...votosRegion]; // Copia para no alterar datos originales
    
            resultadoRegion= calcular(copiaVotos, cantEscaños, metodoSeleccionado);
    
            // Sumar los escaños obtenidos en esta región al total nacional
            resultadoRegion.forEach((escañosGanados, index) => {
                const nombrePartido = matrizVotos[index].DESCRIPCION_OP;
                escañosTotalesPorPartido[nombrePartido] += escañosGanados;
            });
        });

        return escañosTotalesPorPartido;
}