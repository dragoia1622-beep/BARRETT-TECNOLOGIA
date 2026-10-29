
"use strict";

/* ==========================================
   SISTEMA DRAGO-IA
   BARRETT TECNOLOGÍA

   1. Ventanas modales de proyectos
   2. Imágenes de proyectos
   3. Reloj internacional automático
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     1. PROYECTOS REGISTRADOS
  ========================================== */

  const proyectos = {
    guayoyo: "Guayoyo Express",
    clinica: "Clínica Odontológica",
    salsoteca: "El Mundo de las Salsas",
    acuariofilia: "Acuariofilia Vida Marina",
    pescaderia: "Pescadería Barrett",
    escandallo: "Escandallo Chef Guayoyo",
    reservas: "DRAGO Reservas",
    polleria: "DRAGO Pollería",
    envios: "DRAGO Envíos",
    "vida-marina": "Vida Marina · Chef Guayoyo",
    "mi-dieta": "Mi Dieta Guayoyo"
  };

  /* ==========================================
     2. IMÁGENES DE LOS PROYECTOS
  ========================================== */

  const imagenesProyectos = {
    guayoyo: {
      archivo: "guayoyo-express.png",
      alt: "Captura de Guayoyo Express"
    },

    clinica: {
      archivo: "clinica-odontologica.png",
      alt: "Captura de Clínica Odontológica"
    },

    salsoteca: {
      archivo: "mundo-de-las-salsas.png",
      alt: "Captura de El Mundo de las Salsas"
    },

    acuariofilia: {
      archivo: "acuariofilia-vida-marina.png",
      alt: "Captura de Acuariofilia Vida Marina"
    },

    pescaderia: {
      archivo: "pescaderia-barrett.png",
      alt: "Captura de Pescadería Barrett"
    },

    escandallo: {
      archivo: "escandallo-chef-guayoyo.png",
      alt: "Captura de Escandallo Chef Guayoyo"
    },

    "vida-marina": {
      archivo: "vida-marina-chef-guayoyo.png",
      alt: "Captura de Vida Marina Chef Guayoyo"
    },

    "mi-dieta": {
      archivo: "mi-dieta-guayoyo.png",
      alt: "Captura de Mi Dieta Guayoyo"
    },

    polleria: {
      archivo: "drago-polleria.png",
      alt: "Captura del sistema DRAGO Pollería"
    }
  };

  /* ==========================================
     3. ELEMENTOS DEL MODAL
  ========================================== */

  const modal = document.getElementById("drago-modal");

  const titulo = document.getElementById(
    "drago-modal-titulo"
  );

  const descripcion = document.getElementById(
    "drago-modal-descripcion"
  );

  const imagen = document.getElementById(
    "drago-modal-imagen"
  );

  const cerrar = document.querySelector(
    ".drago-cerrar"
  );

  const botones = document.querySelectorAll(
    ".drago-ver"
  );

  /* ==========================================
     4. FUNCIONAMIENTO DE LOS MODALES
  ========================================== */

  if (modal && titulo && descripcion && cerrar) {

    let botonAnterior = null;

    botones.forEach((boton) => {

      boton.addEventListener("click", () => {

        const codigo = boton.dataset.proyecto;
        const nombre = proyectos[codigo];

        if (!nombre) {
          return;
        }

        titulo.textContent = nombre;

        descripcion.textContent =
          "Este proyecto forma parte de SISTEMA DRAGO-IA, " +
          "el portafolio de BARRETT TECNOLOGÍA.";

        /* Mostrar imagen correspondiente */

        if (imagen) {

          const datosImagen = imagenesProyectos[codigo];

          if (datosImagen) {

            imagen.src =
              "../assets/drago/images/" +
              datosImagen.archivo;

            imagen.alt = datosImagen.alt;
            imagen.hidden = false;

          } else {

            imagen.hidden = true;
            imagen.removeAttribute("src");
            imagen.alt = "";

          }
        }

        botonAnterior = boton;

        if (!modal.open) {
          modal.showModal();
        }

      });

    });

    /* Cerrar mediante el botón X */

    cerrar.addEventListener("click", () => {
      modal.close();
    });

    /* Cerrar haciendo clic fuera del modal */

    modal.addEventListener("click", (evento) => {

      if (evento.target !== modal) {
        return;
      }

      const rect = modal.getBoundingClientRect();

      const dentro =
        evento.clientX >= rect.left &&
        evento.clientX <= rect.right &&
        evento.clientY >= rect.top &&
        evento.clientY <= rect.bottom;

      if (!dentro) {
        modal.close();
      }

    });

    /* Devolver el foco al botón original */

    modal.addEventListener("close", () => {

      if (botonAnterior) {
        botonAnterior.focus();
      }

    });

  }

  /* ==========================================
     5. RELOJ INTERNACIONAL DRAGO-IA
     Zona horaria automática del visitante
  ========================================== */

  const relojDrago = document.getElementById(
    "drago-fecha-hora"
  );

  const zonaDrago = document.getElementById(
    "drago-zona-horaria"
  );

  if (relojDrago) {

    const zonaHorariaVisitante =
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone || "UTC";

    const formateador = new Intl.DateTimeFormat(
      "es-ES",
      {
        timeZone: zonaHorariaVisitante,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    );

    function actualizarRelojDrago() {

      const ahora = new Date();

      relojDrago.textContent =
        formateador.format(ahora);

      relojDrago.dateTime =
        ahora.toISOString();

      if (zonaDrago) {

        zonaDrago.textContent =
          zonaHorariaVisitante.replaceAll(
            "_",
            " "
          );

      }

    }

    /* Mostrar inmediatamente */

    actualizarRelojDrago();

    /* Actualizar cada segundo */

    setInterval(actualizarRelojDrago, 1000);

  }

});
