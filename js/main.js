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
const iconoPersona = document.getElementById('persona');
const iconoPersonaCheck = document.getElementById('personaCheck');
const modal = document.getElementById('modal');
const cerrarModal = document.getElementById('cerrarModal');
const modalRegistro = document.getElementById('modalRegistro');
const cerrarModalRegistro = document.getElementById('cerrarModalRegistro');
const botonRegistrarse = document.getElementById('registrarse');
const botonRegistrarseModalRegistro = document.getElementById('registrarseModalRegistro'); 
const iniciarSesionBoton = document.getElementById('iniciarSesion'); 
const emailInicioSesion = document.getElementById('usuario'); 
const contrasenaInicioSesion = document.getElementById('contrasena'); 
const letraUsuario = document.getElementById('letraUsuario');

// Array para iniciar el carrito de compras:
let carrito = JSON.parse(localStorage.getItem('guardar')) || [];

// Iniciar número de productos agregados al carrito:
let cantidadTotalProductos = JSON.parse(localStorage.getItem('numeroProductos')) || 0;

// Fetch productos:
let productos = [];

const fetchProductos = async ()=> {
    const response = await fetch ('js/productos.json');
    productos = await response.json();
    mostrarProductos('todos');
}

fetchProductos();

// Función para agregar los productos al store y botón para agregar al carrito:
function agregarProducto(producto) {
    let contenido = document.createElement('div');
    contenido.classList = 'contenido';
    contenido.innerHTML = `
    <img src=${producto.img}>
    <h3>${producto.producto}</h3>
    <p class='precio'>$ ${producto.precio}</p>
    `;

    // Botón agregar al carrito:
    let botonAgregar = document.createElement('button');
    botonAgregar.innerText = 'Agregar al Carrito';
    botonAgregar.classList = 'boton';

    contenido.append(botonAgregar);

    botonAgregar.addEventListener('click', () => {

        const existente = carrito.find((productoExistente) => productoExistente.codigo === producto.codigo);

        existente ? existente.cantidad++ : carrito.push({ ...producto, cantidad: 1 });
        
        cantidadTotalProductos++;
        cantidadAgregados();
        guardarCarrito();

        if (carritoContenedor.style.display === 'flex') {
            funcionarCarrito();
        }
        Toastify({
            text: "Producto agregado",
            duration: 1500,
            close: false,
            gravity: "bottom",
            position: "right",
            stopOnFocus: false,
            toastClassName: "toast",
            style: {
                background: "black",
                color: "white",
                cursor:"default",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "13px",
            },
        }).showToast();
    });
    return contenido;
}

// Función para mostrar los productos según la vista elegida:
function mostrarProductos(tipo) {
    store.innerHTML = '';

    const productosFiltrados = tipo === 'todos' ? [...productos] : productos.filter(item => item.tipoDeProducto === tipo);

    productosFiltrados.forEach((producto) =>{
        store.append(agregarProducto(producto));
    });
    console.log('Productos filtrados:', productosFiltrados);
};

// Eventos para los botones de filtrado:
verTodosBoton.addEventListener('click', () => mostrarProductos('todos'));
verZapatosBoton.addEventListener('click', () => mostrarProductos('zapatos'));
verCarterasBoton.addEventListener('click', () => mostrarProductos('carteras'));

// Eventos para los botones de ordenar todos los productos por precio:
ordenarMenor.addEventListener('click', () => mostrarProductosOrdenados([...productos].sort((a, b) => a.precio - b.precio)));
ordenarMayor.addEventListener('click', () => mostrarProductosOrdenados([...productos].sort((a, b) => b.precio - a.precio)));

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
    busquedaInput.value = '';
}

// Función para mostrar los resultados de la búsqueda:
function mostrarResultados(resultados) {

    store.innerHTML = '';

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
    Swal.fire({
        title: '¿Confirma que desea vaciar el carrito de compra?',
        html: 'Se borrarán todos tus productos',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            cantidadTotalProductos = 0; 
            cantidadAgregados();
            guardarCarrito();
            funcionarCarrito();
        }
    })
}

let carritoDescuentoAplicado = false;

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

    // Condicional para mostrar mensaje de carrito vacío o mostrar productos agregados y funciones del carrito:
    if (carrito.length === 0) {
        const carritoVacioMensaje = document.createElement('p');
        carritoVacioMensaje.textContent = 'Tu carrito de compras está vacío.';
        carritoVacioMensaje.classList = 'total-pagar';
        carritoContenedor.append(carritoVacioMensaje);
    } else {
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
                    cantidadTotalProductos--; 
                    cantidadAgregados();
                }
                guardarCarrito();
                funcionarCarrito();
            });

            let sumar = productoContenedor.querySelector('.sumar');
            
            sumar.addEventListener('click', () => {
                producto.cantidad++;
                cantidadTotalProductos++;
                cantidadAgregados();
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
        `;
        carritoContenedor.append(carritoDescuento); 

        // Evento para aplicar cupón de descuento:
        descuentoBoton.addEventListener('click', () => {
            const cupon = descuentoInput.value;

            if (cupon === "DESCUENTO20") {
                const descuento = total * 0.2;
                total -= descuento;

                totalPagar.innerHTML = `Total a pagar: $ ${total}`;

                carritoDescuentoAplicado = true;

                // Para deshabilitar el botón de descuento y vaciar el valor del input:
                descuentoInput.value = "";
                descuentoInput.disabled = true;
                descuentoBoton.disabled = true;

                Swal.fire({
                    icon: 'success',
                    title: 'Cupón aplicado con éxito',
                    showConfirmButton: true,
                });
            } else {
                descuentoInput.value = "";
                Swal.fire({
                title: 'Ingresa un cupón válido.',
                })
            }
        });

        // Botón iniciar compra: 
        const carritoCompra = document.createElement('button');
        carritoCompra.classList = 'boton-compra';
        carritoCompra.innerText = "Iniciar compra";
        carritoContenedor.append(carritoCompra);

        // Función para mostrar el resumen de compra:
        carritoCompra.addEventListener('click', () => {
            let subtotal = 0; 
            let resumenHTML = ``;

            carrito.forEach((producto) => {
                const subtotalProducto = producto.precio * producto.cantidad;
                subtotal += subtotalProducto; 

                resumenHTML += `
                    <div class="resumen">
                        <p>${producto.producto} x${producto.cantidad} - $ ${subtotalProducto}
                    </div>
                `;
            });

            let descuento = 0;
            if (carritoDescuentoAplicado) {
                descuento = subtotal * 0.2;
            }

            resumenHTML += `
                <div class="resumen">
                    <p>Subtotal: $ ${subtotal}</p>
                    <p>Descuento aplicado: $ ${descuento}</p>
                    <p>Costo de Envío: $0</p>
                    <p class='total-resumen'>Total a Pagar: $ ${subtotal - descuento}</p>
                </div>
            `;

            Swal.fire({
                title: 'Resumen de compra:',
                html: resumenHTML,
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: 'Pagar',
                cancelButtonText: `Volver`,
                customClass: {
                    title: 'resumen-titulo',
                    confirmButton: 'resumen-confirm-button',
                    cancelButton: 'resumen-cancel-button'  
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    carrito.length = 0;
                    cantidadTotalProductos = 0; 
                    cantidadAgregados();
                    guardarCarrito();
                    funcionarCarrito();
                    Swal.fire('¡Muchas gracias por su compra!', '', 'success');
                    carritoContenedor.style.display = 'none';
                    window.location.href = '#store'; 
                }
            });
        });
        
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
            window.location.href = '#store'; 
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
}

// Evento para ejecutar la función del carrito:
vistaCarrito.addEventListener('click', () => {
    if (modalInicioSesionAbierto) {
        modal.style.display = 'none';
        modalInicioSesionAbierto = false;
    }
    funcionarCarrito();
    cantidadAgregados();
});

// Función para eliminar producto del carrito:
function eliminarProducto(codigo) {
    const findCodigo = carrito.find((item) => {
        return item.codigo === codigo;
    });
    carrito = carrito.filter((items) => {
        return items !== findCodigo;
    });
    cantidadTotalProductos -= findCodigo.cantidad;
    cantidadAgregados();
    guardarCarrito();
    funcionarCarrito();

    if (carrito.length === 0) {
        carritoContenedor.style.display = 'none';
    }
}

// Función para mostrar número de productos agregados al carrito:
function cantidadAgregados() {

    if (cantidadTotalProductos === 0) {
        numeroProductos.style.display = 'none';
    } else {
        numeroProductos.style.display = 'flex';
        numeroProductos.style.justifyContent = 'center';
        numeroProductos.style.alignItems = 'center';
        numeroProductos.innerText = cantidadTotalProductos;
    }
    // Se guarda el número de productos agregados al carrito en el local storage:
    localStorage.setItem('numeroProductos', JSON.stringify(cantidadTotalProductos));
}

// Función para guardar el carrito en el local storage:
function guardarCarrito() {
    localStorage.setItem('guardar', JSON.stringify(carrito));
}

// Llamado a la función que muestra todos los productos para que se muestren todos por defecto:
mostrarProductos('todos');

// Llamado a la función para calcular el número de productos agregados al carrito:
cantidadAgregados();

// Variable para saber si el modal de inicio de sesión está abierto:
let modalInicioSesionAbierto = false;

// Eventos inicio de sesión y registro:
iconoPersona.addEventListener('click', () => {
    if (modalRegistro.style.display !== 'block') {
        modal.style.display = 'block';
        carritoContenedor.style.display = 'none';
        modalInicioSesionAbierto = true;
    }
    if (carritoContenedor.style.display !== 'none') {
        modal.style.display = 'none';
    }
});

cerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

botonRegistrarse.addEventListener('click', () => {
    modalRegistro.style.display = 'block';
    modal.style.display = 'none';
});

cerrarModalRegistro.addEventListener('click', () => {
    modalRegistro.style.display = 'none';
});

// Evento para registrarse:
let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

botonRegistrarseModalRegistro.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('contrasenaRegistro').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;

    if (nombre && apellido && email && contrasena && confirmarContrasena) {
        if (contrasena === confirmarContrasena) {
            const nuevoUsuario = { nombre, apellido, email, contrasena };
            usuariosRegistrados.push(nuevoUsuario);
            
            localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));
            
            document.getElementById('nombre').value = "";
            document.getElementById('apellido').value = "";
            document.getElementById('email').value = "";
            document.getElementById('contrasenaRegistro').value = "";
            document.getElementById('confirmarContrasena').value = "";

            Swal.fire({
                icon: 'success',
                title: 'Registro completado con éxito',
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    modal.style.display = 'block';
                }
            });
            modalRegistro.style.display = 'none';
        } else {
            Swal.fire({
                title: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.',
            });
        }
    } else {
        Swal.fire({
            title: 'Debes completar todos los campos para registrarte.',
        });

        document.getElementById('nombre').value = "";
        document.getElementById('apellido').value = "";
        document.getElementById('email').value = "";
        document.getElementById('contrasenaRegistro').value = "";
        document.getElementById('confirmarContrasena').value = "";
    }
});

// Función de sesión iniciada:
function sesionIniciada () { 
    iconoPersonaCheck.style.display = 'block';
    iconoPersona.style.display = 'none';


    iconoPersonaCheck.addEventListener('click', () => {
        Swal.fire({
            title: '¿Deseas cerrar sesión?',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'SI'
        }).then((result) => {
            if (result.isConfirmed) {
                iconoPersona.style.display = 'block';
                iconoPersonaCheck.style.display = 'none';
                localStorage.removeItem('sesionIniciada');
            }
        })
    });
}

// Evento para iniciar sesión:
iniciarSesionBoton.addEventListener('click', () => {
    const emailIngresado = emailInicioSesion.value;
    const contrasenaIngresada = contrasenaInicioSesion.value;

    if (emailIngresado === "" || contrasenaIngresada === "") {
        Swal.fire({
            title: 'Por favor, complete ambos campos.',
        });
        return;
    }

    const usuarioEncontrado = usuariosRegistrados.find((usuario) => usuario.email === emailIngresado);
    
    if (usuarioEncontrado && usuarioEncontrado.contrasena === contrasenaIngresada) { 
        localStorage.setItem('sesionIniciada', emailIngresado);

        modal.style.display = 'none';

        Swal.fire({
            icon: 'success',
            title: 'Sesión iniciada',
            showConfirmButton: true,
        });

        emailInicioSesion.value = "";
        contrasenaInicioSesion.value = "";

        sesionIniciada ();

    } else {
        Swal.fire({
            title: 'Email o contraseña incorrecta',
            })
    }
});

// Evento para verificar si hay una sesión iniciada al cargar la página:
document.addEventListener('DOMContentLoaded', () => {
    const sesion = localStorage.getItem('sesionIniciada');

    if (sesion) {
        sesionIniciada ()
    };
});

// Modo dark:
let body = document.querySelector('body');
let botonModoColor = document.querySelector('.color-mode');

botonModoColor.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
})

