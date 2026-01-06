let escañosPorPartido;
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

// Actualiza la tabla según el valor seleccionado en el combo de regiones
function actualizarVistaSegunRegion() {
    if (!escañosPorPartido) return;

    const selector = document.getElementById('cirSel');
    const regionSeleccionada = selector?.value || "TOTAL";

    if (regionSeleccionada !== "TOTAL" && escañosPorPartido.detalle[regionSeleccionada]) {
        actualizarTablaResultados(escañosPorPartido.detalle[regionSeleccionada]);
    } else {
        actualizarTablaResultados(escañosPorPartido.nacional);
    }
}

// Listener global para cambios en el selector (funciona aunque se re-renderice)
document.addEventListener('change', (event) => {
    const target = event.target;
    if (target && target.id === 'cirSel') {
        actualizarVistaSegunRegion();
    }
});