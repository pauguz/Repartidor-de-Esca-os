//TODO LO RELACIONADO AL INPUT DE CSVS Y SU FUNCIONALIDAD

// --COSAS BASICAS
const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const resultsTableBody = document.querySelector('#resultsTable tbody');

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


function mostrarVistaPrevia(data, columna="TOTAL") {
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    resultsTableBody.innerHTML = ""; 


    data.forEach((partido, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align: left;">${i}</td>
            <td style="text-align: left;">${partido.DESCRIPCION_OP}</td>
            <td>${partido[columna].toLocaleString()}</td>
            <td><span style="color: #999;">Pendiente...</span></td>
        `;
        resultsTableBody.appendChild(tr);
    });
}
