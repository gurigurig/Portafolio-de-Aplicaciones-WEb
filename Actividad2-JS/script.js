let articulos = [];
let contadorId = 0;
const IVA_PERCENTAGE = 0.16;

document.addEventListener('DOMContentLoaded', () => {
    const productoSelect = document.getElementById('productoSelect');
    const precioInput = document.getElementById('precioInput');

    productoSelect.addEventListener('change', () => {
        const selectedOption = productoSelect.value;
        if (selectedOption) {
            const [nombre, precio] = selectedOption.split('_');
            precioInput.value = parseFloat(precio).toFixed(2);
        } else {
            precioInput.value = '';
        }
    });

    actualizarTabla(); 
});

function agregarArticulo() {
    const productoSelect = document.getElementById('productoSelect');
    const unidadesInput = document.getElementById('unidadesInput');

    const selectedOption = productoSelect.value;
    const unidades = parseInt(unidadesInput.value);

    if (!selectedOption) {
        alert("Por favor elija un producto.");
        return;
    }

    if (isNaN(unidades) || unidades <= 0) {
        alert("Por favor ingrese una cantidad válida de unidades.");
        return;
    }

    const [nombreProducto, precioUnitario] = selectedOption.split('_');
    const precio = parseFloat(precioUnitario);
    const monto = precio * unidades;

    contadorId++;
    const nuevoArticulo = {
        id: contadorId,
        producto: nombreProducto,
        precioUnitario: precio,
        unidades: unidades,
        monto: monto
    };

    const articuloExistenteIndex = articulos.findIndex(item => item.producto === nombreProducto);

    if (articuloExistenteIndex > -1) {
        articulos[articuloExistenteIndex].unidades += unidades;
        articulos[articuloExistenteIndex].monto = articulos[articuloExistenteIndex].unidades * articulos[articuloExistenteIndex].precioUnitario;
    } else {
        articulos.push(nuevoArticulo);
    }

    productoSelect.value = "";
    document.getElementById('precioInput').value = "";
    unidadesInput.value = "1";

    actualizarTabla();
}

function actualizarTabla() {
    const tablaArticulosBody = document.querySelector('#tablaArticulos tbody');
    tablaArticulosBody.innerHTML = '';

    let subtotalCalculado = 0;

    articulos.forEach(articulo => {
        const row = tablaArticulosBody.insertRow();
        row.setAttribute('data-id', articulo.id);

        row.insertCell().textContent = articulo.id;
        row.insertCell().textContent = articulo.producto;
        row.insertCell().textContent = articulo.precioUnitario.toFixed(2);

        const unidadesCell = row.insertCell();
        unidadesCell.textContent = articulo.unidades;

        row.insertCell().textContent = articulo.monto.toFixed(2);

        const actionsCell = row.insertCell();
        actionsCell.className = 'actions';
        actionsCell.innerHTML = `
            <button class="modify-btn" onclick="habilitarModificacion(${articulo.id})">Modificar</button>
            <button class="delete-btn" onclick="eliminarArticulo(${articulo.id})">Eliminar</button>
        `;

        subtotalCalculado += articulo.monto;
    });

    calcularTotales(subtotalCalculado);
}

function habilitarModificacion(id) {
    const row = document.querySelector(`#tablaArticulos tbody tr[data-id="${id}"]`);
    if (!row) return;

    const productoCell = row.children[1];
    const precioUnitarioCell = row.children[2];
    const unidadesCell = row.children[3];
    const montoCell = row.children[4];
    const actionsCell = row.children[5];

    const currentUnidades = unidadesCell.textContent;

    unidadesCell.innerHTML = `<input type="number" value="${currentUnidades}" min="1" id="inputUnidades_${id}" style="width: 60px;">`;

    actionsCell.innerHTML = `
        <button class="modify-btn" onclick="guardarModificacion(${id})">Guardar</button>
        <button class="delete-btn" onclick="cancelarModificacion(${id}, ${currentUnidades})">Cancelar</button>
    `;
}

function guardarModificacion(id) {
    const inputUnidades = document.getElementById(`inputUnidades_${id}`);
    const nuevasUnidades = parseInt(inputUnidades.value);

    if (isNaN(nuevasUnidades) || nuevasUnidades <= 0) {
        alert("Por favor ingrese una cantidad válida de unidades.");
        const articuloOriginal = articulos.find(item => item.id === id);
        if (articuloOriginal) {
            cancelarModificacion(id, articuloOriginal.unidades);
        }
        return;
    }

    const articuloIndex = articulos.findIndex(item => item.id === id);
    if (articuloIndex > -1) {
        articulos[articuloIndex].unidades = nuevasUnidades;
        articulos[articuloIndex].monto = articulos[articuloIndex].precioUnitario * nuevasUnidades;
    }

    actualizarTabla();
}

function cancelarModificacion(id, unidadesOriginales) {
    actualizarTabla();
}


function eliminarArticulo(id) {
    articulos = articulos.filter(articulo => articulo.id !== id);
    actualizarTabla();
}

function calcularTotales(subtotal) {
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    const iva = subtotal * IVA_PERCENTAGE;
    document.getElementById('iva').textContent = iva.toFixed(2);
    const total = subtotal + iva;
    document.getElementById('total').textContent = total.toFixed(2);
}