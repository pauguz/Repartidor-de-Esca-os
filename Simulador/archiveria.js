// --COSAS BASICAS
const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const resultsTableBody = document.querySelector('#resultsTable tbody');

// Variables globales para guardar los datos cargados
let matrizVotos = [];
let magnitudes = {};
let nombresCircunscripciones = [];

// --- GESTIÓN DE EVENTOS ---

// Añadiendo "sensibilidad" al drop-area
dropArea.addEventListener('click', () => fileElem.click());

// Evento cuando se selecciona un archivo mediante el explorador
fileElem.addEventListener('change', function() {
    handleFiles(this.files[0]);
});

// Prevenir comportamiento por defecto (evita que el navegador abra el archivo)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

// Efecto visual al arrastrar
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('hover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('hover'), false);
});

// Manejar la caída del archivo
dropArea.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    handleFiles(dt.files[0]);
});

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

// --- VINCULACIÓN CON EL BOTÓN PROCESAR ---

document.getElementById('processButton').addEventListener('click', () => {
    const metodoSeleccionado = document.getElementById('method').value;
    
    if (matrizVotos.length === 0) {
        alert("Primero debes cargar un archivo CSV.");
        return;
    }

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

    // Una vez procesadas todas las regiones, actualizamos la tabla
    actualizarTablaResultados(escañosTotalesPorPartido);
});