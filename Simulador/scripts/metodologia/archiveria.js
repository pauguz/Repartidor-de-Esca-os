const noPartidos=["VOTOS NULOS", "VOTOS EN BLANCO", "VOTOS IMPUGNADOS"];

// Variables globales para guardar los datos cargados
let matrizVotos;
let magnitudes = {};
let nombresCircunscripciones = [];
let escañosPorPartido;


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
          totalNacional(matrizVotos, nombresCircunscripciones, mostrarVistaPrevia);
          if (!disUn) {
            opcionesRegionales();
        }
    
          console.log("Magnitudes detectadas:", magnitudes);
          console.log("DATA:", matrizVotos);
          alert("Datos cargados: " + matrizVotos.length + " partidos y " + nombresCircunscripciones.length + " circunscripciones.");
          
        }
  });
}

