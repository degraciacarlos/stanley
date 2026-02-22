function changeImage(thumbnail) {
    const card = thumbnail.closest('.product-card');
    const mainImage = card.querySelector('.product-img');

    mainImage.src = thumbnail.src;

    card.querySelectorAll('.thumb-img').forEach(img => img.classList.remove('active-thumb'));
    thumbnail.classList.add('active-thumb');
}

async function cargarProductos() {
    try {
        const respuesta = await fetch('data/products.json?t=' + new Date().getTime());

         if (!respuesta.ok) {
            throw new Error('No se pudo cargar el JSON');
        }

        const productos = await respuesta.json();

        const productosActivos = productos.filter(producto => producto.ESTADO === 1);

        productosActivos.sort((a, b) => 
            a.TIPO.localeCompare(b.TIPO)
        );

        const catalogo = document.getElementById('catalog');
        catalogo.innerHTML = '';

        productosActivos.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('container', 'py-5');

            div.innerHTML = `                
                <div class="row justify-content-center mb-5">
                <div class="col-lg-12">
                    <div class="card product-card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div class="row g-0 align-items-center">

                            <div class="col-md-8 position-relative text-center bg-light p-4">
                                <div class="product-img-wrapper mb-4">
                                    <img class="img-fluid product-img mb-4" src="images/${producto.ID}/image-1.png"
                                        alt="${producto.DESCRIPCION}">
                                </div>
                                <div class="d-flex justify-content-center gap-3 flex-wrap">
                                    <img class="thumb-img active-thumb" src="images/${producto.ID}/image-1.png"
                                        onclick="changeImage(this)" alt="Imagen 1">

                                    <img class="thumb-img" src="images/${producto.ID}/image-2.png" onclick="changeImage(this)"
                                        alt="Imagen 2">

                                    <img class="thumb-img" src="images/${producto.ID}/image-3.png" onclick="changeImage(this)"
                                        alt="Imagen 3">
                                </div>

                            </div>

                            <div class="col-md-4 p-5">
                                <h1 class="fw-bold mb-3">${producto.DESCRIPCION}</h1>

                                <p class="product-info"><strong>Color:</strong> <span>${producto.COLOR}</span></p>
                                <p class="product-info"><strong>Capacidad:</strong> <span>${producto["TAMANO (Oz)"]} oz</span></p>

                                <div class="product-price mb-4">
                                    <span class="current-price">$${producto["PRECIO ESTIMADO VENTA"]}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>            
            `;

            catalogo.appendChild(div);
        });

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

cargarProductos();