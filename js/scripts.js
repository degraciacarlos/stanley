let productosGlobal = [];

// Cambiar imagen principal
function changeImage(thumbnail) {
    const card = thumbnail.closest('.product-card');
    const mainImage = card.querySelector('.product-img');

    mainImage.src = thumbnail.src;

    card.querySelectorAll('.thumb-img')
        .forEach(img => img.classList.remove('active-thumb'));

    thumbnail.classList.add('active-thumb');
}

// Cargar productos
async function cargarProductos() {
    try {
        const respuesta = await fetch('data/products.json?t=' + new Date().getTime());

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el JSON');
        }

        const productos = await respuesta.json();

        productosGlobal = productos.filter(p => p.ESTADO === 1);

        inicializarFiltros(productosGlobal);
        renderProductos(productosGlobal);

    } catch (error) {
        console.error("Error al cargar los productos:", error);
        document.getElementById('catalog').innerHTML = `
            <div class="alert alert-danger text-center">
                No se pudieron cargar los productos.
            </div>
        `;
    }
}

// Crear opciones dinámicas
function inicializarFiltros(productos) {
    const selectTipo = document.getElementById('filterTipo');
    const selectUso = document.getElementById('filterUso');

    const tipos = [...new Set(productos.map(p => p.TIPO))].sort();

    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        selectTipo.appendChild(option);
    });

    // Evento cuando cambia TIPO
    selectTipo.addEventListener('change', () => {
        actualizarFiltroUso();
        aplicarFiltros();
    });

    // Evento cuando cambia USO
    selectUso.addEventListener('change', aplicarFiltros);

    document.getElementById('btnLimpiar')
        .addEventListener('click', limpiarFiltros);

    // Cargar usos iniciales
    actualizarFiltroUso();
}

function actualizarFiltroUso() {
    const selectTipo = document.getElementById('filterTipo');
    const selectUso = document.getElementById('filterUso');

    const tipoSeleccionado = selectTipo.value;

    let productosFiltrados = productosGlobal;

    if (tipoSeleccionado !== 'Todos') {
        productosFiltrados = productosGlobal.filter(p => p.TIPO === tipoSeleccionado);
    }

    const usos = [...new Set(productosFiltrados.map(p => p.USO))].sort();

    // Limpiar select USO
    selectUso.innerHTML = '<option value="Todos">Todos</option>';

    usos.forEach(uso => {
        const option = document.createElement('option');
        option.value = uso;
        option.textContent = uso;
        selectUso.appendChild(option);
    });

    selectUso.value = 'Todos';
}

// Aplicar filtros
function aplicarFiltros() {
    const tipoSeleccionado = document.getElementById('filterTipo').value;
    const usoSeleccionado = document.getElementById('filterUso').value;

    let filtrados = productosGlobal;

    if (tipoSeleccionado !== 'Todos') {
        filtrados = filtrados.filter(p => p.TIPO === tipoSeleccionado);
    }

    if (usoSeleccionado !== 'Todos') {
        filtrados = filtrados.filter(p => p.USO === usoSeleccionado);
    }

    renderProductos(filtrados);
}

// Limpiar filtros
function limpiarFiltros() {
    document.getElementById('filterTipo').value = 'Todos';
    actualizarFiltroUso();
    renderProductos(productosGlobal);
}

// Renderizar productos
function renderProductos(productos) {
    const catalogo = document.getElementById('catalog');
    catalogo.innerHTML = '';

    if (productos.length === 0) {
        catalogo.innerHTML = `
            <div class="container text-center py-5">
                <h4>No se encontraron productos</h4>
            </div>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();

    productos
        .sort((a, b) => a.TIPO.localeCompare(b.TIPO, 'es', { sensitivity: 'base' }))
        .forEach(producto => {

            const div = document.createElement('div');
            div.classList.add('container', 'py-2');

            div.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="card product-card shadow-lg border-0 rounded-4 overflow-hidden">
                            <div class="row g-0 align-items-center">

                                <div class="col-md-8 text-center bg-light p-4">
                                    <img class="img-fluid product-img mb-4" 
                                         src="images/${producto.ID}/image-1.png"
                                         alt="${producto.DESCRIPCION}">

                                    <div class="d-flex justify-content-center gap-3 flex-wrap">
                                        <img class="thumb-img active-thumb" 
                                             src="images/${producto.ID}/image-1.png">
                                        <img class="thumb-img" 
                                             src="images/${producto.ID}/image-2.png">
                                        <img class="thumb-img" 
                                             src="images/${producto.ID}/image-3.png">
                                    </div>
                                </div>

                                <div class="col-md-4 p-5">
                                    <p class="text-muted mb-1">${producto.ASIN}</p>
                                    <h1 class="fw-bold mb-3">${producto.DESCRIPCION}</h1>

                                    <div class="product-info p-3 bg-light rounded-3 mb-4">
                                        <ul class="list-unstyled mb-0">
                                            <li><strong>Color:</strong> ${producto.COLOR}</li>
                                            <li><strong>Capacidad:</strong> ${producto.TAMANO} oz</li>
                                            <li><strong>Uso:</strong> ${producto.USO}</li>
                                        </ul>
                                    </div>

                                    <div class="product-price mb-4">
                                        <span class="current-price">$${producto["PRECIO VENTA"]}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            `;

            div.querySelectorAll('.thumb-img').forEach(img => {
                img.addEventListener('click', function () {
                    changeImage(this);
                });
            });

            fragment.appendChild(div);
        });

    catalogo.appendChild(fragment);
}

cargarProductos();
