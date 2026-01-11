//TODO LO RELACIONADO AL BOTON PARA PROCESAR LA TABLA 

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

// Actualiza la tabla según el valor seleccionado en el combo de regiones
function actualizarVistaSegunRegion() {
    const selector = document.getElementById('cirSel');
    const regionSeleccionada = selector?.value || "TOTAL";

    mostrarVistaPrevia(matrizVotos, regionSeleccionada);
    if (!escañosPorPartido) return;


    if (regionSeleccionada !== "TOTAL" && escañosPorPartido.detalle[regionSeleccionada]) {
        actualizarTablaResultados(escañosPorPartido.detalle[regionSeleccionada]);
    } else {
        actualizarTablaResultados(escañosPorPartido.nacional);
    }
}

// --- VINCULACIÓN CON EL BOTÓN PROCESAR ---

document.getElementById('processButton').addEventListener('click', () => {
    if (matrizVotos.length === 0) {
        alert("Primero debes cargar un archivo CSV.");
        return;
    }

    const metodoSeleccionado = document.getElementById('method').value;

    // Objeto para acumular escaños totales por partido a nivel nacional
    escañosPorPartido = calcularMatriz(matrizVotos, metodoSeleccionado);

    // Mostrar según la región seleccionada (o total si aplica)
    actualizarVistaSegunRegion();
});
