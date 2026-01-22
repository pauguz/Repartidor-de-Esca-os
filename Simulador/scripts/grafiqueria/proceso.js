//TODO LO RELACIONADO AL BOTON PARA PROCESAR LA TABLA 

function actualizarTablaResultados(reg, indiceMatriz) {
    const totales = escañosPorPartido[reg];
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = ""; 

    // Obtenemos los nombres de los partidos (las llaves del objeto de resultados)
    const listaOrdenada = Object.entries(totales)
        .sort((a, b) => b[1] - a[1]); // Ordenar por escaños de mayor a menor

    // Si no se proporciona indiceMatriz, intentamos inferirlo
    if (indiceMatriz === undefined) {
        if (reg === "TOTAL") {
            indiceMatriz = matrizVotos.length - 1; // Última fila con totales nacionales
        } else {
            indiceMatriz = parseInt(reg);
        }
    }

    listaOrdenada.forEach(([nombrePartido, escaños]) => {
        // Obtenemos los votos. Buscamos en la matriz con el indice correcto y nombre del partido
        let votos = matrizVotos[indiceMatriz] ? matrizVotos[indiceMatriz][nombrePartido] : 0;

        const tr = document.createElement('tr');
        if (escaños > 0) tr.style.backgroundColor = "#f0fff0";

        tr.innerHTML = `
            <td style="text-align: left;"><strong>${escaños}</strong></td>
            <td style="text-align: left;">${nombrePartido}</td>
            <td>${parseFloat(votos).toLocaleString()}</td>
            <td>${escaños > 0 ? escaños : '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}
// Actualiza la tabla según el valor seleccionado en el combo de regiones
function actualizarVistaSegunRegion() {
    const selector = document.getElementById('cirSel');
    let regionSeleccionada;
    let indiceMatriz;
    
    if (disUn || !selector) {
        // En modo distrito único, usamos "TOTAL" como clave y el último índice de la matriz
        regionSeleccionada = "TOTAL";
        indiceMatriz = matrizVotos.length - 1; // Última fila que contiene los totales nacionales
    } else {
        regionSeleccionada = selector.value;
        indiceMatriz = parseInt(regionSeleccionada);
    }
    
    console.log("seleccionaste ", regionSeleccionada, matrizVotos[indiceMatriz]);
    mostrarVistaPrevia(matrizVotos, indiceMatriz);
    if (!escañosPorPartido) return;

    if (escañosPorPartido[regionSeleccionada]) {
        console.log("SI HUBO SELECCION")
        actualizarTablaResultados(regionSeleccionada, indiceMatriz);
    } else {
        console.log("NO SELECCIONATE NADA", regionSeleccionada)
        actualizarTablaResultados('TOTAL', matrizVotos.length - 1);
    }
}

// --- VINCULACIÓN CON EL BOTÓN PROCESAR ---

document.getElementById('processButton').addEventListener('click', () => {
    if (matrizVotos.length === 0) {
        alert("Primero debes cargar un archivo CSV.");
        return;
    }

    const metodoSeleccionado = document.getElementById('method').value;
    
    // Identificar partidos: usamos las llaves del primer objeto de la matriz
    // Excluimos 'TOTAL' si lo añadiste en el procesamiento previo
    const nombresPartidos = Object.keys(matrizVotos[0]).filter(k => k !== 'TOTAL');

    if (disUn) {
        // --- MODO DISTRITO ÚNICO ---
        const inputMag = document.getElementById('magnitud');
        const magnitudUnica = parseInt(inputMag?.value) || 130;

        // Usamos la última fila de la matriz (que contiene los totales nacionales)
        const filaNacional = matrizVotos.at(-1);
        //Solucion mejorable al problema de Hare en partidos con  0 votos
        const listaVotosNacionales = nombresPartidos.map(p => parseFloat(filaNacional[p]) || 0);

        const resultadoNacional = calcular([...listaVotosNacionales], magnitudUnica, metodoSeleccionado);

        let escañosNacionalObj = {};
        resultadoNacional.forEach((escaños, index) => {
            const nombre = nombresPartidos[index];
            escañosNacionalObj[nombre] = escaños;
        });

        escañosPorPartido = { "TOTAL": escañosNacionalObj };

    } else {
        // --- MODO DISTRITO MÚLTIPLE (REGIONAL) ---
        // IMPORTANTE: Pasamos una copia de la matriz sin la última fila (si la última es el TOTAL nacional)
        // para que calcularMatriz no la procese como una región extra.
        const matrizSoloRegiones = matrizVotos.slice(0, nombresCircunscripciones.length);
        
        escañosPorPartido = calcularMatriz(matrizSoloRegiones, metodoSeleccionado, nombresPartidos);
    }

    console.log("Cálculo finalizado:", escañosPorPartido);
    actualizarVistaSegunRegion();
});
