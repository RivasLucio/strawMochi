const btnCarrito = document.querySelector("#botonCarrito");
const carritoContainer = document.querySelector(".carrito-container");

btnCarrito.addEventListener("click", (e) => {
  carritoContainer.classList.toggle("disabled");
  e.preventDefault();
});

document.addEventListener("click", (e) => {
  const isCarrito = e.target.closest(".carrito");

  if (!isCarrito) {
    carritoContainer.classList.add("disabled");
  }
});

// carrito de compras

const contenedorEntradas = document.querySelector("#card-container-entradas");
const contenedorPrincipales = document.querySelector(
  "#card-container-principales"
);

const carritoContador = document.querySelector("#carrito-contador");

const contenedorPostres = document.querySelector("#card-container-postres");
let btnBuy = document.querySelectorAll(".btn-buy");

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarContadorCarrito();
} else {
  productosEnCarrito = [];
}

// Función para cargar productos desde el archivo JSON
function cargarProductos() {
  fetch("../js/almacen.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
          <div class="card-img">
            <img src="${producto.img}" alt="${producto.nombre}"/>
          </div>
          <div class="card-texto">
            <h4>${producto.nombre}</h4>
            <p>${producto.descripcion}</p>
          </div>
          <div class="card-precio">
            <h3>${producto.precio}</h3>
            <a id="${producto.id}" class="btn-buy" href="#"><i class="bi bi-bag"></i></a>
          </div>`;

        if (producto.categoria.nombre === "entrada") {
          contenedorEntradas.appendChild(div);
        } else if (producto.categoria.nombre === "principal") {
          contenedorPrincipales.appendChild(div);
        } else if (producto.categoria.nombre === "postre") {
          contenedorPostres.appendChild(div);
        }
      });
      agregarAlCarrito(data);
    })
    .catch((error) => console.error("Error al cargar el archivo JSON:", error));
}

function agregarAlCarrito(data) {
  let btnBuy = document.querySelectorAll(".btn-buy");

  btnBuy.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idBtn = e.currentTarget.id;
      const productoAgregado = data.find((producto) => producto.id === idBtn);

      if (productosEnCarrito.some((producto) => producto.id === idBtn)) {
        const index = productosEnCarrito.findIndex(
          (producto) => producto.id === idBtn
        );
        productosEnCarrito[index].cantidad++;
      } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
      }
      actualizarContadorCarrito();
      subirProductoEnCarrito();
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );
    });
  });
}

const carritoVacio = document.querySelector(".carrito-vacio");

function subirProductoEnCarrito() {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    carritoVacio.classList.add("disabled");
    carritoContainer.innerHTML = "";
    let total = 0;

    productosEnCarrito.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("carrito-contenido");
      div.innerHTML = `
        <div class="carrito-producto">
          <p class="carrito-cantidad">${producto.cantidad}u. ${producto.precio}</p>
          <img src="${producto.img}" alt="">
          <p class="carrito-nombre">${producto.nombre}</p>
          <i id=${producto.id} class="carrito-eliminar bi bi-x"></i>
        </div>
      `;
      carritoContainer.appendChild(div);

      const precio = parseFloat(producto.precio.replace("$", ""));
      if (!isNaN(precio)) {
        total += precio;
      }
    });

    let divPrecio = document.createElement("div");
    divPrecio.classList.add("carrito-precio");
    divPrecio.innerHTML = `
      <p>$${total}</p>
      <p class="solicitar-pedido">Hacer Pedido</p>
    `;
    carritoContainer.appendChild(divPrecio);
    modal();
  } else {
    carritoContainer.innerHTML = ` 
    <div class="carrito-vacio">
      <p>el carrito se encuentra vacio</p>
      <p>por favor agregue productos.</p>
    </div>
`;
  }
}

cargarProductos();
agregarAlCarrito();
subirProductoEnCarrito();

// funcion para sacar productos de carrito

carritoContainer.addEventListener("click", eliminarProducto);

function eliminarProducto(e) {
  if (e.target.classList.contains("carrito-eliminar")) {
    const idBtn = e.target.id;
    const index = productosEnCarrito.findIndex((prod) => prod.id === idBtn);
    e.stopPropagation();
    productosEnCarrito.splice(index, 1);

    subirProductoEnCarrito();
    actualizarContadorCarrito();

    localStorage.setItem(
      "productos-en-carrito",
      JSON.stringify(productosEnCarrito)
    );
  }
}

// actualiza numerito de carrito

function actualizarContadorCarrito() {
  let contadorActualizado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  carritoContador.innerHTML = contadorActualizado;
}

//funcion para abrir modal

const jsConfetti = new JSConfetti();

function modal() {
  const abrirModal = document.querySelector(".solicitar-pedido");
  const modalContainer = document.querySelector(".modal-container");
  const finalizarPedido = document.querySelector("#finalizar-pedido");
  const modalClose = document.querySelector(".modal-close");

  abrirModal.addEventListener("click", () => {
    modalContainer.classList.remove("disabled");
  });
  modalClose.addEventListener("click", () => {
    modalContainer.classList.add("disabled");
  });
  finalizarPedido.addEventListener("click", (e) => {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("tel").value;

    if (nombre && apellido && email && telefono) {
      e.preventDefault();
      productosEnCarrito.length = 0;
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );
      subirProductoEnCarrito();
      actualizarContadorCarrito();
      modalContainer.classList.add("disabled");
      modalCompraContainer.classList.remove("disabled");
      jsConfetti.addConfetti({
        
        emojis: ['🍜', '🍣','🍙','🍚'],
       
        emojiSize: 60,
     });
    }
  });
}

const cerrarModal = document.querySelector("#cerrar-modal");
const modalCompraContainer = document.querySelector(".modal-compra-container");
cerrarModal.addEventListener("click", () => {
  modalCompraContainer.classList.add("disabled");
});
// mostrar scroll up
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  this.scrollY >= 300
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

//scroll animation
const sr = ScrollReveal({
  origin: "top",
  distance: "70px",
  duration: "2100",
  delay: "400",
});
sr.reveal(".presentacion-img");
sr.reveal(".presentacion-texto", { origin: "bottom" });
sr.reveal(".presentacion-seccionImg", { origin: "right" });
sr.reveal(".presentacion-seccionTexto", { origin: "left" });
sr.reveal("#card-container-entradas", { origin: "bottom" });
sr.reveal("#card-container-principales", { origin: "bottom" });
sr.reveal(".bebidas-container", { origin: "bottom" });
sr.reveal("#card-container-postres", { origin: "left" });

// menu navbar

const btnMenu = document.getElementById("btnMenu");
const navMenuBackground = document.querySelector(".nav-menu-background");
const navCategorias = document.querySelector(".nav-categorias");
const navRedes = document.querySelector(".nav-redes");

const menu = document.getElementById("menu");
const menuClose = document.getElementById("menuClose");

btnMenu.addEventListener("click", (e) => {
  e.preventDefault();
  navMenuBackground.classList.toggle("active");
  navCategorias.classList.toggle("active");
  navRedes.classList.toggle("active");
  menu.classList.toggle("disabled");
  menuClose.classList.toggle("disabled");
});
