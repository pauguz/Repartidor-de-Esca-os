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
      if (!data || data.length === 0) return;

      const todasLasKeys = Object.keys(data[0]);
      const primeraKey = todasLasKeys[0];
      const ultimaKey = todasLasKeys.at(-1);

      // Reiniciamos los contenedores globales
      nombresCircunscripciones = [];
      magnitudes = {};
      matrizVotos = [];

      // Identificamos los nombres de los partidos (columnas intermedias)
      const nombresPartidos = todasLasKeys.filter((key, index) => {
        return index !== 0 && 
               index !== todasLasKeys.length - 1 && 
               !noPartidos.includes(key);
      });

      data.forEach(fila => {
        const nombreRegion = fila[primeraKey];
        if (!nombreRegion) return;

        // 1. Guardamos la estructura geográfica
        nombresCircunscripciones.push(nombreRegion);
        magnitudes[nombreRegion] = fila[ultimaKey];

        // 2. Creamos un objeto "limpio" solo con votos de partidos para matrizVotos
        const votosLimpios = { }; // Mantenemos ID de región
        nombresPartidos.forEach(partido => {
          votosLimpios[partido] = fila[partido] || 0;
        });
        
        matrizVotos.push(votosLimpios);
      });

      // 3. Procesamiento y UI
      // Calculamos totales nacionales (ahora sumando verticalmente la matriz limpia)
      nombresCircunscripciones.push("TOTAL");
      console.log(nombresCircunscripciones, "AAA");
      totalNacional(matrizVotos, nombresPartidos, vistaPorClave);


      if (!disUn) {
        opcionesRegionales();
      }

      console.log("Matriz Limpia (Solo Partidos):", matrizVotos);
      alert(`Cargadas ${nombresCircunscripciones.length} regiones.`);
    }
  });
}
