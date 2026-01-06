
// --- VINCULACIÓN CON EL BOTÓN PROCESAR ---

document.getElementById('processButton').addEventListener('click', () => {
    if (matrizVotos.length === 0) {
        alert("Primero debes cargar un archivo CSV.");
        return;
    }

    const metodoSeleccionado = document.getElementById('method').value;

    // Objeto para acumular escaños totales por partido a nivel nacional
    let escañosTotalesPorPartido = calcularMatriz(matrizVotos, metodoSeleccionado);
    let escañosRegionales = escañosTotalesPorPartido.detalle;
    escañosTotalesPorPartido=escañosTotalesPorPartido.nacional;



    // Una vez procesadas todas las regiones, actualizamos la tabla
    actualizarTablaResultados(escañosTotalesPorPartido);
});