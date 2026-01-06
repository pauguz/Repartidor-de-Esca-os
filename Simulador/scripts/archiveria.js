const noPartidos=["VOTOS NULOS", "VOTOS EN BLANCO", "VOTOS IMPUGNADOS"];

// Variables globales para guardar los datos cargados
let matrizVotos = [];
let magnitudes = {};
let nombresCircunscripciones = [];

// --- PROCESAMIENTO DEL ARCHIVO ---

function handleFiles(file) {
  Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function(results) {
          const data = results.data;
          
          // 1. Extraer la última fila (Magnitudes)
          const ultimaFila = data.pop(); 
          
          // 2. Identificar las circunscripciones (todas las columnas menos la primera)
          nombresCircunscripciones = Object.keys(data[0]).filter(key => key !== 'DESCRIPCION_OP');
          
          // 3. Guardar magnitudes en un objeto para fácil acceso
          nombresCircunscripciones.forEach(c => {
              magnitudes[c] = ultimaFila[c];
          });

          // 4. Guardar los partidos y sus votos
          matrizVotos = data;

          console.log("Magnitudes detectadas:", magnitudes);
          alert("Datos cargados: " + matrizVotos.length + " partidos y " + nombresCircunscripciones.length + " circunscripciones.");
          
          mostrarVistaPrevia(data)
        }
  });
}

function mostrarVistaPrevia(data) {
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    resultsTableBody.innerHTML = ""; // Limpiar tabla
    let i=0

    if(!disUn){
        opcionesRegionales();
    }

    data.forEach(fila => { //Para cada Circunscripcion
        // Calculamos el total de votos sumando todas las regiones para este partido
        const totalVotosNacional = nombresCircunscripciones.reduce((acc, region) => {
            const votosRegionales = parseFloat(fila[region]) || 0;
            return acc + votosRegionales;
        }, 0);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: left;">${i}</td>
            <td style="text-align: left;">${fila.DESCRIPCION_OP}</td>
            <td>${totalVotosNacional.toLocaleString()}</td>
            <td><span style="color: #999;">Pendiente...</span></td>
        `;
        i++;
        resultsTableBody.appendChild(tr);
    });
}


function actualizarTablaResultados(totales) {
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = ""; // Limpiar para mostrar resultados finales

    // Convertir el objeto a array para poder ordenarlo por escaños (de mayor a menor)
    const listaOrdenada = Object.entries(totales)
        .sort((a, b) => b[1] - a[1]);

    listaOrdenada.forEach(([nombre, escaños]) => {
        // Buscamos el total de votos nacional para mostrarlo también
        const partidoData = matrizVotos.find(p => p.DESCRIPCION_OP === nombre);
        const totalVotos = nombresCircunscripciones.reduce((acc, reg) => acc + (parseFloat(partidoData[reg]) || 0), 0);

        const tr = document.createElement('tr');
        // Si el partido tiene escaños, resaltamos la fila
        if (escaños > 0) tr.style.backgroundColor = "#f0fff0";

        tr.innerHTML = `
            <td style="text-align: left;">${escaños}</td>
            <td style="text-align: left;">${nombre}</td>
            <td>${totalVotos.toLocaleString()}</td>
            <td><strong>${escaños}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}
