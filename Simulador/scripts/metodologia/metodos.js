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


function calcularMatriz(matrizVotos, metodoSeleccionado) {
    // 1. Objeto para acumular escaños totales (Nacional)
    let escañosTotalesPorPartido = {};
    matrizVotos.forEach(p => escañosTotalesPorPartido[p.DESCRIPCION_OP] = 0);

    // 2. Nuevo objeto para el detalle por circunscripción (Matriz)
    let matrizEscañosDetalle = {};

    // Iteramos por cada circunscripción (columna)
    nombresCircunscripciones.forEach(region => {
        const cantEscaños = magnitudes[region]; 
        if (!cantEscaños || cantEscaños <= 0) return;

        let votosRegion = matrizVotos.map(p => parseFloat(p[region]) || 0);
        const copiaVotos = [...votosRegion];

        // Calculamos los escaños de esta región específica
        let resultadoRegion = calcular(copiaVotos, cantEscaños, metodoSeleccionado);

        // Guardamos el detalle en la matriz de escaños
        // Creamos una entrada para la región con los resultados de cada partido
        matrizEscañosDetalle[region] = {};
        
        resultadoRegion.forEach((escañosGanados, index) => {
            const nombrePartido = matrizVotos[index].DESCRIPCION_OP;
            
            // Llenamos la matriz de detalle
            matrizEscañosDetalle[region][nombrePartido] = escañosGanados;

            // Sumamos al acumulado nacional
            escañosTotalesPorPartido[nombrePartido] += escañosGanados;
        });
    });

    // Retornamos ambos resultados
    return {
        nacional: escañosTotalesPorPartido,
        detalle: matrizEscañosDetalle
    };
}