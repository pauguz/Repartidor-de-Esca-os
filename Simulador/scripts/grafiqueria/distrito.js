//TODO LO RELACIONADO A LOS MODOS DE DISTRITOS

//--VALORES GLOBALES--
const disBot = document.getElementById("distrito");
const disSpan= document.getElementById("input-magnitud")
const cirDiv= document.getElementById("cirDiv")

function opcionesRegionales(){
    console.log("Regiones: ", nombresCircunscripciones)
    const cirSel = document.getElementById("cirSel");
    cirSel.innerHTML = "";
    ["TOTAL", ...nombresCircunscripciones].forEach(
        region => {
            const op = document.createElement('option');
            op.setAttribute("value", `${region}`);
            op.innerHTML= `${region}`;
            cirSel.appendChild(op);
        }
    );
    cirSel.value = "TOTAL";
}

let disUn= false;

function distritoUnico(){
    disUn = !disUn
    if(disUn){
        disBot.innerHTML=
        `
        Distrito Multiple
        `;

        disSpan.innerHTML=      
        `
        <label for="magnitud">Magnitud:</label>
        <input id="magnitud" type="number" placeholder=130>
        </input>
        `;
        cirDiv.innerHTML= ``;

;
        return "Distrito Unico Activado"
    } else{
        document.getElement
        disBot.innerHTML=`Distrito Unico`;
        disSpan.innerHTML= ``;
        cirDiv.innerHTML=
        `
        <label for="cirSel">Circunscripcion:</label>
        <select id="cirSel" placeholder="dummy">
        </select>
        `;
        opcionesRegionales();
        return "Distrito Unico Desactivado"
    }
}


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


disBot.addEventListener('click', () => console.log(distritoUnico()));