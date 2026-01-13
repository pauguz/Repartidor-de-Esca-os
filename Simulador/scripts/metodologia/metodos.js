//METODOS 
// s: salto
function dhont(votos, magnitud, s=1){
    let avanc=Array.from(Array(votos.length), ()=>0);
    let i=0;
    while(i<magnitud ){
         iterdh(votos, avanc, s);
        i++;
        //console.log(votos);
    }
    return avanc;
}


function stlag(votos, magnitud){
    return dhont(votos, magnitud, 2);
}

function mayoria(votos, magnitud, avanc){
    let indices= obtenerIndicesOrdenados(votos).reverse(); //indices de mayor a menor
    let l=votos.length
    for(let i=0; i<magnitud; i++){
        avanc[ indices[i%l] ]++;
    }
    return avanc;
}


function hare(votos, magnitud, funcRest=mayoria, extra=0){
    let avanc = Array(votos.length).fill(0);
    let q = cuota(votos, magnitud+extra); // Cuota Hare
    let votosRestantes = [...votos];
    // Primera repartición: Por cocientes enteros
    magnitud=repartoPorCuota(avanc, votosRestantes, q, magnitud)
    // Segunda repartición: Por residuos mayores
    let indices =  obtenerIndicesOrdenados(votosRestantes).reverse(); // De mayor a menor residuo
    for(let i=0; i < magnitud; i++){
        avanc[indices[i]]++;
    }

    //Por añadir: logica para manejar exceso
    return avanc;
}

function drop(votos, magnitud){
    return hare(votos, magnitud, extra=1);
}

function imperiali(votos, magnitud){
    return hare(votos, magnitud, extra=2);
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


function calcularMatriz(matrizVotos, metodoSeleccionado, nombresPartidos) {
    let escañosTotalesNacional = {};
    nombresPartidos.forEach(p => escañosTotalesNacional[p] = 0);

    let matrizEscañosDetalle = {};

    // Iteramos por cada objeto (que representa una región)
    // Usamos el índice para obtener el nombre de la región desde nombresCircunscripciones
    matrizVotos.forEach((filaRegion, i) => {
        const nombreRegion = nombresCircunscripciones[i];
        
        // Si no hay nombre de región o es la fila de totales (que no tiene magnitud), saltamos
        const cantEscaños = magnitudes[nombreRegion];
        if (!nombreRegion || !cantEscaños || cantEscaños <= 0) return;

        // Extraemos los votos de los partidos en el orden de nombresPartidos
        const votosDeEstaRegion = nombresPartidos.map(p => parseFloat(filaRegion[p]) || 0);

        // Calculamos el reparto
        const resultadoRegion = calcular([...votosDeEstaRegion], cantEscaños, metodoSeleccionado);

        matrizEscañosDetalle[nombreRegion] = {};

        resultadoRegion.forEach((escañosGanados, index) => {
            const partido = nombresPartidos[index];
            matrizEscañosDetalle[nombreRegion][partido] = escañosGanados;
            
            // Acumulado Nacional
            escañosTotalesNacional[partido] += escañosGanados;
        });
    });

    matrizEscañosDetalle["TOTAL"] = escañosTotalesNacional;
    return matrizEscañosDetalle;
}