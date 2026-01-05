function mayor(lis){
    let m=Math.max(... lis);
    return lis.indexOf(m);
}

function obtenerIndicesOrdenados(arr) {
    return arr
      .map((valor, indice) => ({ indice, valor })) // Crear pares {indice, valor}
      .sort((a, b) =>  a.valor-b.valor)           // Ordenar por valor
      .map(obj => obj.indice);                     // Extraer solo los índices
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



