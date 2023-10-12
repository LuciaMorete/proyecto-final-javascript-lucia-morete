// Variables para traer los elementos:
const store = document.getElementById('store');
const vistaCarrito = document.getElementById('carrito');
const carritoContenedor = document.getElementById('carritoContenedor');
const numeroProductos = document.getElementById('numeroProductos');
const verTodosBoton = document.getElementById('verTodos');
const verZapatosBoton = document.getElementById('verZapatos');
const verCarterasBoton = document.getElementById('verCarteras');
const busquedaInput = document.getElementById('busquedaInput');
const buscarLupa = document.getElementById('buscarLupa');
const ordenarMenor = document.getElementById('ordenarMenor');
const ordenarMayor = document.getElementById('ordenarMayor')

// Array de objetos de productos:
class Producto {
    constructor(codigo, producto, tipoDeProducto, precio, cantidad, img) {
        this.codigo = codigo;
        this.producto = producto;
        this.tipoDeProducto = tipoDeProducto;
        this.precio = precio;
        this.cantidad = cantidad;
        this.img = img;
    }
}

const productos = [];
productos.push(new Producto(1, 'Stiletos', 'zapatos', 50000, 1, './assets/stiletos.jpg' ));
productos.push(new Producto(2, 'Botas', 'zapatos', 40000, 1, './assets/botas.jpg'));
productos.push(new Producto(3, 'Zapatillas', 'zapatos', 30000, 1, './assets/zapatillas.jpg'));
productos.push(new Producto(4, 'Borcegos', 'zapatos', 45000, 1, './assets/borcegos.jpg'));
productos.push(new Producto(5, 'Sandalias', 'zapatos', 20000, 1, './assets/sandalias.jpg'));
productos.push(new Producto(6, 'Bolso', 'carteras', 60000, 1, './assets/bolso.jpg'));
productos.push(new Producto(7, 'Cartera', 'carteras', 20000, 1, './assets/cartera.jpg'));
productos.push(new Producto(8, 'Minibag', 'carteras', 70000, 1, './assets/minibag.jpg'));
productos.push(new Producto(9, 'Mochila', 'carteras', 45000, 1, './assets/mochila.jpg'));
productos.push(new Producto(10, 'Tote Bag', 'carteras', 50000, 1, './assets/totebag.jpg'));
productos.push(new Producto(11, 'Riñonera', 'carteras', 30000, 1, './assets/rinionera.jpg'));
productos.push(new Producto(12, 'Ojotas', 'zapatos', 15000, 1, './assets/ojotas.jpg'));

// Array para iniciar el carrito de compras:
let carrito = JSON.parse(localStorage.getItem('guardar')) || [];

// Función para agregar los productos al store y botón para agregar al carrito:
function agregarProducto(producto) {
    let contenido = document.createElement('div');
    contenido.classList = 'contenido';
    contenido.innerHTML = `
    <img src=${producto.img}>
    <h3>${producto.producto}</h3>
    <p class='precio'>$ ${producto.precio}</p>
    `;

    // Botón agregar al carrito ():
    let botonAgregar = document.createElement('button');
    botonAgregar.innerText = 'Agregar al Carrito';
    botonAgregar.classList = 'boton';

    contenido.append(botonAgregar);

    // Some y condicional para sumar cantidades o para agregar nuevo producto al carrito:
    botonAgregar.addEventListener('click', () => {
        const existente = carrito.some((productoExistente) => {
            return productoExistente.codigo === producto.codigo;
        });

        if (existente) {
            carrito.map((item) => {
                if (item.codigo === producto.codigo) {
                    item.cantidad++;
                }
            });
        } else {
            carrito.push({
                codigo: producto.codigo,
                img: producto.img,
                producto: producto.producto,
                precio: producto.precio,
                cantidad: producto.cantidad,
            });
        }
        // Llamado a funciones para calcular cantidad de productos agregados y guardar el carrito:
        cantidadAgregados();
        guardarCarrito();
    });

    return contenido;
}

// Función para mostrar los productos según la vista elegida:
function mostrarProductos(tipo) {
    // Vacía el store:
    store.innerHTML = '';

    // Array para filtro de productos:
    let productosFiltrados = [];

    if (tipo === 'todos') {
        productosFiltrados = productos.map(elemento => elemento);
    } else {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].tipoDeProducto === tipo) {
                productosFiltrados.push(productos[i]);
            }
        }
    }
    // forEach agrega los productos filtrados al store:
    productosFiltrados.forEach((producto) =>{
        store.append(agregarProducto(producto));
    });
}

// Eventos para los botones de filtrado:
verTodosBoton.addEventListener('click', () => {
    mostrarProductos('todos');
});

verZapatosBoton.addEventListener('click', () => {
    mostrarProductos('zapatos');
});

verCarterasBoton.addEventListener('click', () => {
    mostrarProductos('carteras');
});

// Eventos para los botones de ordenar todos los productos por precio:
ordenarMenor.addEventListener('click', () => {
    const productosOrdenadosMenor = productos.map(elemento => elemento);
    productosOrdenadosMenor.sort((a, b) => a.precio - b.precio);
    mostrarProductosOrdenados(productosOrdenadosMenor);
});

ordenarMayor.addEventListener('click', () => {
    const productosOrdenadosMayor = productos.map(elemento => elemento);
    productosOrdenadosMayor.sort((a, b) => b.precio - a.precio);
    mostrarProductosOrdenados(productosOrdenadosMayor);
});

// Función para mostrar los productos ordenados por precio:
function mostrarProductosOrdenados(productosOrdenados) {
    store.innerHTML = '';
    productosOrdenados.forEach((producto) => {
        store.append(agregarProducto(producto));
    });
}

// Función para buscar productos según la búsqueda realizada por el usuario:
function buscarProductos() {
    const textoBusqueda = busquedaInput.value.toLowerCase();
    const productosEncontrados = productos.filter(producto => producto.producto.toLowerCase().includes(textoBusqueda));
    mostrarResultados(productosEncontrados);
}

// Función para mostrar los resultados de la búsqueda:
function mostrarResultados(resultados) {

    // Vacía el store:
    store.innerHTML = '';

    // Condicional para ejecutar la función de agregar producto o mostrar mensaje si no hay resultado:
    if (resultados.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No se encontraron productos.';
        store.append(mensaje);
    } else {
        resultados.forEach(function (producto) {
            store.append(agregarProducto(producto));
        });
    }
}

// Eventos para accionar la barra de búsqueda:
buscarLupa.addEventListener('click', buscarProductos);
busquedaInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        buscarProductos();
    }
});

// Función para vaciar el carrito:
function vaciarCarrito() {
    carrito.length = 0;
    guardarCarrito();
    funcionarCarrito();
    cantidadAgregados()
    if (carrito.length === 0) {
        carritoContenedor.style.display = 'none';
    }
}

// Función para crear y manejar la sección carrito:
function funcionarCarrito() {

    // Para resetear el carrito:
    carritoContenedor.innerHTML = '';
    carritoContenedor.style.display = 'flex';

    // Header del carrito:
    const carritoHeader = document.createElement('div');
    carritoHeader.classList = 'carrito-header';
    carritoHeader.innerHTML = `
        <h1 class='carrito-header-titulo'>Mi Compra</h1>`;
    carritoContenedor.append(carritoHeader);


    // Botón cruz para cerrar el carrito:
    const carritoCruz = document.createElement('button');
    carritoCruz.classList = 'carrito-cruz';
    carritoCruz.innerText = "X";

    carritoCruz.addEventListener('click', () => {
        carritoContenedor.style.display = 'none';
    });

    carritoHeader.append(carritoCruz);

    // forEach para crear cada producto que se agrega al carrito:
    carrito.forEach((producto) => {
        let productoContenedor = document.createElement('div');
        productoContenedor.classList = 'carrito-producto';
        productoContenedor.innerHTML = `
            <img src=${producto.img}>
            <h3>${producto.producto}</h3>
            <p>$ ${producto.precio * producto.cantidad}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <span class='sumar'> + </span>
            <span class='restar'> - </span>
            <span class= 'eliminar'><i class="bi bi-trash" style="cursor: pointer;"></i></span>
            `;

        carritoContenedor.append(productoContenedor);

        // Botones de sumar, restar y eliminar productos:
        let restar = productoContenedor.querySelector('.restar');

        restar.addEventListener('click', () => {
            if (producto.cantidad !== 1) {
                producto.cantidad--;
            }
            guardarCarrito();
            funcionarCarrito();
        });

        let sumar = productoContenedor.querySelector('.sumar');
        
        sumar.addEventListener('click', () => {
            producto.cantidad++;
            guardarCarrito();
            funcionarCarrito();
        });

        let eliminar = productoContenedor.querySelector('.eliminar');
        eliminar.addEventListener('click', () => {
            eliminarProducto(producto.codigo);
        });
    });

    // Reduce para calcular el total a pagar:
    let total = carrito.reduce((acumulador, item) => {
        return acumulador + item.precio * item.cantidad;
    }, 0);

    // Total a pagar:
    const totalPagar = document.createElement('div');
    totalPagar.classList = 'total-pagar';
    totalPagar.innerHTML = `Total a pagar: $ ${total}`;
    carritoContenedor.append(totalPagar);

    // Input cupón de descuento:
    const carritoDescuento = document.createElement('div');
    carritoDescuento.classList = 'descuento-contenedor';
    carritoDescuento.innerHTML = ` 
    <p>Ingresa aquí tu cupón de descuento:</p>
    <input type='text' id='descuentoInput' class='busqueda-input'>
    <button id='descuentoBoton' class='carrito-botones'>Aplicar cupón</button>
    <p id='mensajeDescuento' class='mensaje-descuento'></p>
    `;
    carritoContenedor.append(carritoDescuento); 

    // Evento para aplicar cupón de descuento:
    descuentoBoton.addEventListener('click', () => {
        const mensajeDescuento = document.getElementById('mensajeDescuento');

        const cupon = descuentoInput.value;

        if (cupon === "DESCUENTO20") {
            const descuento = total * 0.2;
            total -= descuento;

            totalPagar.innerHTML = `Total a pagar: $ ${total}`;

            // Para deshabilitar el botón de descuento y vaciar el valor del input:
            descuentoInput.value = "";
            descuentoInput.disabled = true;
            descuentoBoton.disabled = true;

            mensajeDescuento.textContent = "Cupón aplicado con éxito.";

        } else {
            descuentoInput.value = "";
            mensajeDescuento.textContent = "Debes ingresar un cupón válido.";
        }
    });

     // Evento para borrar el mensaje de error al hacer click en el input:
        descuentoInput.addEventListener('focus', () => {
        mensajeDescuento.textContent = "";
    });

    // Botón iniciar compra: 
    const carritoCompra = document.createElement('button');
    carritoCompra.classList = 'boton-compra';
    carritoCompra.innerText = "Iniciar compra";

    carritoCompra.addEventListener('click', () => {
        carritoContenedor.style.display = 'none'; 
        // Esta función la completaré para la próxima entrega 
    });

    carritoContenedor.append(carritoCompra);

    // Contenedor botones vaciar y seguir comprando:
    const botonesContenedor = document.createElement('div');
    botonesContenedor.classList = 'compra-contenedor';
    carritoContenedor.append(botonesContenedor);

    // Botón seguir comprando:
    const carritoSeguir = document.createElement('button');
    carritoSeguir.classList = 'carrito-botones';
    carritoSeguir.innerText = "Seguir comprando";

    carritoSeguir.addEventListener('click', () => {
        carritoContenedor.style.display = 'none';
    });

    botonesContenedor.append(carritoSeguir);

    // Botón para vaciar el carrito:
    const carritoVaciar = document.createElement('button');
    carritoVaciar.classList = 'carrito-botones';
    carritoVaciar.innerText = "Vaciar Carrito";

    carritoVaciar.addEventListener('click', () => {
        vaciarCarrito();
    });

    botonesContenedor.append(carritoVaciar);
}

// Evento para ejecutar la función del carrito:
vistaCarrito.addEventListener('click', funcionarCarrito);

// Función para eliminar producto del carrito:
function eliminarProducto(codigo) {
    const findCodigo = carrito.find((item) => {
        return item.codigo === codigo;
    });
    carrito = carrito.filter((items) => {
        return items !== findCodigo;
    });
    cantidadAgregados();
    guardarCarrito();
    funcionarCarrito();

    if (carrito.length === 0) {
        carritoContenedor.style.display = 'none';
    }
}

// Función para mostrar número de productos agregados al carrito:
function cantidadAgregados() {
    const carritoLength = carrito.length;

    if (carritoLength === 0) {
        numeroProductos.style.display = 'none';
    } else {
        numeroProductos.style.display = 'flex';
        numeroProductos.style.justifyContent = 'center';
        numeroProductos.style.alignItems = 'center';
        numeroProductos.innerText = carrito.length;
    }
    // Se guarda el número de productos agregados al carrito en el local storage:
    localStorage.setItem('carrito', JSON.stringify(carritoLength));
}

// Función para guardar el carrito en el local storage:
function guardarCarrito() {
    localStorage.setItem('guardar', JSON.stringify(carrito));
}

// Llamado a la función que muestra todos los productos para que se muestren todos por defecto:
mostrarProductos('todos');

// Llamado a la función para calcular el número de productos agregados al carrito:
cantidadAgregados();