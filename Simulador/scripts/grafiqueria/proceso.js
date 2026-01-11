//TODO LO RELACIONADO AL BOTON PARA PROCESAR LA TABLA 

function actualizarTablaResultados(reg) {
    const totales=escañosPorPartido[reg];
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = ""; // Limpiar para mostrar resultados finales

    // Convertir el objeto a array para poder ordenarlo por escaños (de mayor a menor)
    const listaOrdenada = Object.entries(totales)
        .sort((a, b) => b[1] - a[1]);

    console.log(totales);
    listaOrdenada.forEach(([nombre, escaños]) => {
        // Buscamos el total de votos nacional para mostrarlo también
        const partidoData = matrizVotos.find(p => p.DESCRIPCION_OP === nombre);
        const totalVotos = parseFloat(partidoData[reg]);
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
    const regionSeleccionada = (disUn || !selector) ? "TOTAL" : selector.value;
    mostrarVistaPrevia(matrizVotos, regionSeleccionada);
    if (!escañosPorPartido) return;

    if (escañosPorPartido[regionSeleccionada]) {
        actualizarTablaResultados( regionSeleccionada);
    } else {
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

    if (disUn){
        // 1. Obtener la magnitud personalizada (o 130 por defecto)
        const inputMag = document.getElementById('magnitud');
        const magnitudUnica = parseInt(inputMag?.value) || 130;

        // 2. Extraer solo el array de votos totales de la matriz
        // matrizVotos es [{DESCRIPCION_OP: 'A', TOTAL: 100, ...}, {..}]
        const listaVotosNacionales = matrizVotos.map(p => parseFloat(p.TOTAL) || 0);

        // 3. Calcular escaños a nivel nacional
        const resultadoNacional = calcular([...listaVotosNacionales], magnitudUnica, metodoSeleccionado);

        // 4. Formatear para que 'escañosPorPartido' tenga la estructura que espera tu tabla
        // Creamos un objeto donde la llave es el nombre del partido
        let escañosNacionalObj = {};
        resultadoNacional.forEach((escaños, index) => {
            const nombre = matrizVotos[index].DESCRIPCION_OP;
            escañosNacionalObj[nombre] = escaños;
        });

        // Guardamos en la variable global con la estructura completa
        escañosPorPartido = {  "TOTAL": escañosNacionalObj  // En distrito único, el detalle es el mismo total
            }
    } else {
    // Objeto para acumular escaños totales por partido a nivel nacional
    escañosPorPartido = calcularMatriz(matrizVotos, metodoSeleccionado, nombresCircunscripciones);
    }



    // Mostrar según la región seleccionada (o total si aplica)
    actualizarVistaSegunRegion();
});
