// Clase Item
class Item {
    constructor(orden, titulo, cantidad, inicio, responsable, estado, comentario) {
      this.orden = orden;
      this.titulo = titulo;
      this.cantidad = cantidad;
      this.inicio = inicio;
      this.responsable = responsable;
      this.estado = estado;
      this.comentario = comentario;
    }
  }
  
  // JSON para almacenar los items ingresados en el almacenamiento local
  const items = JSON.parse(localStorage.getItem("items")) || [];
  
  // Función para cargar los items desde el archivo ordenes.json
  const cargarItemsDesdeArchivo = async () => {
    try {
      if (items.length === 0) {
        const response = await fetch('ordenes.json');
        const data = await response.json();
        data.forEach((item) => {
          const newItem = new Item(
            item.orden,
            item.titulo,
            item.cantidad,
            item.inicio,
            item.responsable,
            item.estado,
            item.comentario
          );
          items.push(newItem);
          verItem(newItem);
        });
      }
    } catch (error) {
      console.error("Error al cargar los items desde el archivo ordenes.json:", error);
    }
  };
  
  // Función para manejar el formulario de orden de trabajo
  const ordenTrabajoFormulario = () => {
    const ordenTrabajoFormulario = document.querySelector("#ordenTrabajoFormulario");
    ordenTrabajoFormulario.addEventListener("submit", (e) => {
      e.preventDefault();
      // Obtiene los valores ingresados
      const orden = e.target.elements["orden"].value;
      const titulo = e.target.elements["titulo"].value;
      const cantidad = e.target.elements["cantidad"].value;
      const inicio = e.target.elements["inicio"].value;
      const responsable = e.target.elements["responsable"].value;
      const estado = e.target.elements["estado"].value;
      const comentario = e.target.elements["comentario"].value;
      // Crea un nuevo item
      const item = new Item(orden, titulo, cantidad, inicio, responsable, estado, comentario);
      // Agrega el item a la lista
      items.push(item);
      // Guarda los items en el almacenamiento local
      localStorage.setItem("items", JSON.stringify(items));
      // Muestra el nuevo item en la tabla de órdenes
      verItem(item);
      // Reinicia el formulario
      ordenTrabajoFormulario.reset();
  
      // Muestra la notificación de que la orden fue agregada
      Swal.fire({
        icon: "success",
        title: "LISTO",
        text: "La orden de trabajo se ha agregado exitosamente.",
      });
    });
  };
  
  // Función para mostrar los item en tablas de órdenes
  const verItem = (item) => {
    const tablaOrdenes = document.querySelector("#tablaOrdenes");
    const trItem = document.createElement("tr");
    // Crea la estructura HTML
    trItem.innerHTML = `
      <td>${item.orden}</td>
      <td>${item.titulo}</td>
      <td>${item.cantidad}</td>
      <td>${item.inicio}</td>
      <td>${item.responsable}</td>
      <td>${item.estado}</td>
      <td>${item.comentario}</td>
      <td>
          <button class="editar">Editar</button>
          <button class="eliminar">Eliminar</button>
      </td>
    `;
    tablaOrdenes.append(trItem);
    const editarButton = trItem.querySelector(".editar");
    editarButton.addEventListener("click", () => editarItem(item, trItem));
    const eliminarButton = trItem.querySelector(".eliminar");
    eliminarButton.addEventListener("click", () => eliminarItem(item, trItem));
  };
  
  // Función para mostrar todos los items
  const verItems = () => {
    // Ordena los elementos en orden descendente según su índice en el array
    const itemsOrdenados = items.slice().reverse();
  
    itemsOrdenados.forEach((item) => {
      verItem(item);
    });
  };
  
  // Función para editar un item
  const editarItem = (item, trItem) => {
    const ordenTrabajoFormulario = document.querySelector("#ordenTrabajoFormulario");
    ordenTrabajoFormulario.elements["orden"].value = item.orden;
    ordenTrabajoFormulario.elements["titulo"].value = item.titulo;
    ordenTrabajoFormulario.elements["cantidad"].value = item.cantidad;
    ordenTrabajoFormulario.elements["inicio"].value = item.inicio;
    ordenTrabajoFormulario.elements["responsable"].value = item.responsable;
    ordenTrabajoFormulario.elements["estado"].value = item.estado;
    ordenTrabajoFormulario.elements["comentario"].value = item.comentario;
    eliminarItem(item, trItem);
  
    // Muestra la notificación de orden seleccionada
    Swal.fire({
      icon: "success",
      title: "Orden de trabajo seleccionada",
      text: "ya puede editar tu selección.",
    });
  };
  
  // Función para eliminar un item
  const eliminarItem = (item, trItem) => {
    const index = items.indexOf(item);
    if (index > -1) {
      items.splice(index, 1);
    }
    localStorage.setItem("items", JSON.stringify(items));
    trItem.remove();
  
    // Muestra la notificación de eliminacion
    Swal.fire({
      icon: "success",
      title: "eliminacion completada",
      text: "La orden de trabajo se ha eliminado exitosamente.",
    });
  };
  
  // Función para buscar elementos en los items
  const buscarTrabajo = () => {
    const formularioBusqueda = document.querySelector("#formularioBusqueda");
    formularioBusqueda.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const busqueda = e.target.elements["busqueda"].value.toLowerCase();
      const tipoBusqueda = e.target.elements["tipoBusqueda"].value;
  
      const tablaOrdenes = document.querySelector("#tablaOrdenes");
      const filas = tablaOrdenes.getElementsByTagName("tr");
  
      for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
  
        if (tipoBusqueda === "numeroOrden") {
          const numeroOrden = fila.cells[0].textContent.toLowerCase();
          if (numeroOrden.includes(busqueda)) {
            fila.style.display = "";
          } else {
            fila.style.display = "none";
          }
        } else if (tipoBusqueda === "titulo") {
          const titulo = fila.cells[1].textContent.toLowerCase();
          if (titulo.includes(busqueda)) {
            fila.style.display = "";
          } else {
            fila.style.display = "none";
          }
        } else if (tipoBusqueda === "fecha") {
          const fecha = fila.cells[3].textContent.toLowerCase();
          if (fecha.includes(busqueda)) {
            fila.style.display = "";
          } else {
            fila.style.display = "none";
          }
        } else if (tipoBusqueda === "responsable") {
          const responsable = fila.cells[4].textContent.toLowerCase();
          if (responsable.includes(busqueda)) {
            fila.style.display = "";
          } else {
            fila.style.display = "none";
          }
        } else if (tipoBusqueda === "estado") {
          const estado = fila.cells[5].textContent.toLowerCase();
          if (estado.includes(busqueda)) {
            fila.style.display = "";
          } else {
            fila.style.display = "none";
          }
        }
      }
    });
  };
  //funcion para limpiar la busqueda
const limpiarBusqueda = () => {
  const formularioBusqueda = document.querySelector("#formularioBusqueda");
  formularioBusqueda.reset();

  const tablaOrdenes = document.querySelector("#tablaOrdenes");
  const filas = tablaOrdenes.getElementsByTagName("tr");

  for (let i = 1; i < filas.length; i++) {
      const fila = filas[i];
      fila.style.display = "";
  }
};

buscarTrabajo();

const botonLimpiarBusqueda = document.querySelector("#botonLimpiarBusqueda");
botonLimpiarBusqueda.addEventListener("click", limpiarBusqueda);

  // Carga los items desde el archivo ordenes.json
  cargarItemsDesdeArchivo();
  
  // Muestra todos los items al cargar la página
  verItems();
  
  // Maneja el formulario de orden de trabajo
  ordenTrabajoFormulario();
  
  // Maneja la búsqueda de trabajos
  buscarTrabajo();
  