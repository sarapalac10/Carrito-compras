const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if(localStorage.getItem('carrito')) {
      carrito = JSON.parse(localStorage.getItem('carrito'))
      pintarCarrito()
  }
});

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener('click', e => {
    btnAccion(e)
})

//Traer los productos a la página de index
const fetchData = async () => {
  try {
    const respuesta = await fetch("api.json");
    const data = await respuesta.json();
    // console.log(data);
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

//Crear las cards de los productos
const pintarCards = (data) => {
  data.forEach((element) => {
    templateCard.querySelector("h5").textContent = element.title;
    templateCard.querySelector("p").textContent = element.precio;
    templateCard.querySelector("img").setAttribute("src", element.thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = element.id;

    const clonar = templateCard.cloneNode(true);
    fragment.appendChild(clonar);
  });

  cards.appendChild(fragment);
};

//Agregar al carrito los productos
const addCarrito = (e) => {
  // console.log(e.target)
  // console.log(e.target.classList.contains('btn-dark'))
  if (e.target.classList.contains("btn-dark")) {
    // console.log(e.target.parentElement)
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  // console.log(objeto)
  const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("p").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarrito();
  // console.log(carrito)
};

//Pintar carrito
const pintarCarrito = () => {
  // console.log(carrito);
  items.innerHTML = "";
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =
      producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter();

  localStorage.setItem('carrito', JSON.stringify(carrito))
};

const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = ` <th scope="row" colspan="5">Su carrito está vacío</th> `;
    return
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment)

  //Vaciar carrito
  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', () => {
      carrito = {}
      pintarCarrito()
  })
};

const btnAccion = e => {
    console.log(e.target);
        //Botón de aumentar
    if(e.target.classList.contains('btn-info')) {
        console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
        //Botón de disminuir
    if(e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0 ) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation();
}