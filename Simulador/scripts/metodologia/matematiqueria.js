function mayor(lis){
    let m=Math.max(... lis);
    return lis.indexOf(m);
}

function ordenarLlaves(arrPares){
    return arrPares.sort((a, b) =>  a[1]-b[1])           // Ordenar por valor
      .map(obj => obj.indice);                           // Extraer solo los índices
}

function obtenerIndicesOrdenados(arr) {
    return arr
      .map((valor, indice) => ([indice, valor ])) // Crear pares {indice, valor}
      .sort((a, b) =>  a[1]-b[1])           // Ordenar por valor
      .map(obj => obj.indice);                     
  }

function cocienteyresto(votos, cuota){
    let cociente=Math.floor(votos/cuota);
    let r=votos%cuota;
    return [cociente, r];
}

function iterdh(lis, gan, s){
    let m= mayor(lis);
    gan[m]++;
    lis[m]= lis[m]* gan[m]/(gan[m]+s);
}

function cuota(votos, magnitud){
    let sumaVotos = votos.reduce((a, b) => a + b, 0);
    return Math.floor(sumaVotos / magnitud); // Cuota Hare
}


function repartoPorCuota(avanc, votosRestantes, q, magnitud){
    for(let i=0; i < votosRestantes.length; i++){
        let [escañosDirectos, resto] =  cocienteyresto(votosRestantes[i], q);
        avanc[i] = escañosDirectos;
        votosRestantes[i] = resto;
        magnitud -= escañosDirectos;
    }
    return magnitud;

}

function dummy(arr){
    console.log(arr);
}


function totalNacional(matrizVotos, nombresPartidos, func = (data) => {}) {
    // 1. Crear un objeto para acumular sumas
    const totales = {};
    nombresPartidos.forEach(p => totales[p] = 0);

    // 2. Sumar verticalmente: recorremos cada región y cada partido
    matrizVotos.forEach(filaRegión => {
        nombresPartidos.forEach(partido => {
            totales[partido] += parseFloat(filaRegión[partido]) || 0;
        });
    });

    // 3. Agregamos una fila virtual "TOTAL NACIONAL" a la matriz 
    // para que la vista previa pueda leerla como si fuera una región más
    const filaTotal = { "Circunscripciones": "TOTAL" }; // Ajusta el nombre según tu CSV
    nombresPartidos.forEach(p => filaTotal[p] = totales[p]);
    
    // Guardamos los totales nacionales en una propiedad accesible si se necesita
    matrizVotos.push(totales); 

    func(matrizVotos);
    return totales;
}