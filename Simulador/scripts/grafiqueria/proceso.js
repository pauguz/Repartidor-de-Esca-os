//TODO LO RELACIONADO AL BOTON PARA PROCESAR LA TABLA 

function actualizarTablaResultados(reg) {
    const totales = escañosPorPartido[reg];
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = ""; 

    // Obtenemos los nombres de los partidos (las llaves del objeto de resultados)
    const listaOrdenada = Object.entries(totales)
        .sort((a, b) => b[1] - a[1]); // Ordenar por escaños de mayor a menor

    listaOrdenada.forEach(([nombrePartido, escaños]) => {
        // Obtenemos los votos. Buscamos en la matriz con el indice de la region y nombre del partido
        let votos = matrizVotos[reg] ? matrizVotos[reg][nombrePartido] : 0;

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
    const regionSeleccionada = (disUn || !selector) ? "TOTAL" : selector.value;
    console.log("seleccionaste ", regionSeleccionada, matrizVotos[regionSeleccionada]);
    mostrarVistaPrevia(matrizVotos, regionSeleccionada);
    if (!escañosPorPartido) return;

    if (escañosPorPartido[regionSeleccionada]) {
        console.log("SI HUBO SELECCION")
        actualizarTablaResultados( regionSeleccionada);
    } else {
        console.log("NO SELECCIONATE NADA", regionSeleccionada)
        actualizarTablaResultados('TOTAL');
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
