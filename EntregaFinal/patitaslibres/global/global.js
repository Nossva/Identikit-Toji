// global.js — toda la lógica del sitio

/* ========================================
   FUNCIÓN: iniciarAnimaciones
   IntersectionObserver para .animate-on-scroll
   Agrega la clase "visible" cuando el elemento
   entra en pantalla, activando la transición CSS.
======================================== */
function iniciarAnimaciones() {
  var elementos = document.querySelectorAll('.animate-on-scroll');

  if (!window.IntersectionObserver) {
    for (var i = 0; i < elementos.length; i++) {
      elementos[i].classList.add('visible');
    }
    return;
  }

  var observador = new IntersectionObserver(function(entradas) {
    for (var j = 0; j < entradas.length; j++) {
      if (entradas[j].isIntersecting) {
        entradas[j].target.classList.add('visible');
        observador.unobserve(entradas[j].target);
      }
    }
  }, { threshold: 0.12 });

  for (var k = 0; k < elementos.length; k++) {
    observador.observe(elementos[k]);
  }
}

/* ========================================
   HOME — CONTADORES ANIMADOS DE IMPACTO
======================================== */

/* Hace subir un número de 0 hasta "destino" usando setInterval */
function contarHasta(destino, elemento) {
  var actual    = 0;
  var duracion  = 2000;
  var pasos     = 80;
  var incremento = destino / pasos;
  var intervalo  = duracion / pasos;

  var timer = setInterval(function() {
    actual = actual + incremento;
    if (actual >= destino) {
      actual = destino;
      clearInterval(timer);
    }
    elemento.textContent = '+' + Math.floor(actual).toLocaleString('es-AR');
  }, intervalo);
}

/* Arranca los 3 contadores con sus valores destino */
function arrancarContadores() {
  var numRescatados  = document.getElementById('contador-rescatados');
  var numHogares     = document.getElementById('contador-hogares');
  var numVoluntarios = document.getElementById('contador-voluntarios');

  if (numRescatados)  { contarHasta(1200, numRescatados); }
  if (numHogares)     { contarHasta(850,  numHogares); }
  if (numVoluntarios) { contarHasta(300,  numVoluntarios); }
}

/* Usa IntersectionObserver para iniciar los contadores al hacer scroll */
function iniciarContadores() {
  var primeraCard = document.querySelector('.impacto__card');

  if (!primeraCard) { return; }

  if (!window.IntersectionObserver) {
    arrancarContadores();
    return;
  }

  var yaInicio = false;

  var observador = new IntersectionObserver(function(entradas) {
    for (var i = 0; i < entradas.length; i++) {
      if (entradas[i].isIntersecting && !yaInicio) {
        yaInicio = true;
        arrancarContadores();
        observador.disconnect();
      }
    }
  }, { threshold: 0.3 });

  observador.observe(primeraCard);
}

/* ========================================
   ADOPTAR — FILTROS DE PERROS
   Muestra/oculta tarjetas según el pill activo
======================================== */
function iniciarFiltros() {
  var pills = document.querySelectorAll('.filtro-pill');
  var cards = document.querySelectorAll('.perro-card-adoptar');

  if (pills.length === 0) { return; }

  for (var i = 0; i < pills.length; i++) {
    configurarClickPill(pills[i], cards, pills);
  }
}

/* Configura el click de un pill específico (función auxiliar para evitar closure con var) */
function configurarClickPill(pill, cards, todosPills) {
  pill.onclick = function() {
    for (var j = 0; j < todosPills.length; j++) {
      todosPills[j].classList.remove('activo');
    }
    pill.classList.add('activo');

    var filtro = pill.getAttribute('data-filtro');

    for (var k = 0; k < cards.length; k++) {
      var card = cards[k];
      if (filtro === 'todos') {
        card.style.display = 'flex';
      } else {
        var tamanio = card.getAttribute('data-tamanio');
        var edad    = card.getAttribute('data-edad');
        if (tamanio === filtro || edad === filtro) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      }
    }
  };
}

/* ========================================
   ADOPTAR — MODAL DE INTERÉS
   Abre el modal con el nombre del perro,
   cierra con X, con click fuera, o con Escape
======================================== */
function iniciarModal() {
  var overlay     = document.getElementById('modal-overlay');
  var botonCerrar = document.getElementById('modal-cerrar');
  var nombrePerro = document.getElementById('modal-nombre-perro');

  if (!overlay) { return; }

  var botonesInteres = document.querySelectorAll('.btn-me-interesa');
  for (var i = 0; i < botonesInteres.length; i++) {
    configurarBotonInteres(botonesInteres[i], overlay, nombrePerro);
  }

  if (botonCerrar) {
    botonCerrar.onclick = function() { overlay.style.display = 'none'; };
  }

  overlay.onclick = function(evento) {
    if (evento.target === overlay) { overlay.style.display = 'none'; }
  };

  document.onkeydown = function(evento) {
    if (evento.key === 'Escape') { overlay.style.display = 'none'; }
  };
}

/* Configura el click del botón "Me interesa" de una tarjeta */
function configurarBotonInteres(boton, overlay, nombrePerro) {
  boton.onclick = function() {
    var nombre = boton.getAttribute('data-nombre');
    if (nombrePerro && nombre) { nombrePerro.textContent = nombre; }
    overlay.style.display = 'flex';
  };
}

/* ========================================
   DONAR — SELECTOR DE MONTO Y TOGGLE TIPO
   Pills de monto + texto de impacto +
   toggle entre donación única y mensual
======================================== */
var impactos = {
  '500':  'Cubre la alimentación de un perro durante un mes 🐾',
  '1000': 'Paga las vacunas para dos perros 💉',
  '2500': 'Financia la castración de un perro ✂️',
  '5000': 'Cubre la atención veterinaria completa de un perro 🏥'
};

function iniciarSelectorMonto() {
  var pills        = document.querySelectorAll('.monto-pill');
  var textoImpacto = document.getElementById('texto-impacto');

  if (pills.length === 0) { return; }

  for (var i = 0; i < pills.length; i++) {
    configurarClickMonto(pills[i], pills, textoImpacto);
  }

  /* Toggle Única / Mensual */
  var btnUnica     = document.getElementById('btn-unica');
  var btnMensual   = document.getElementById('btn-mensual');
  var textoMensual = document.getElementById('texto-mensual');

  if (!btnUnica || !btnMensual) { return; }

  btnUnica.onclick = function() {
    btnUnica.classList.add('activo');
    btnMensual.classList.remove('activo');
    if (textoMensual) { textoMensual.style.display = 'none'; }
  };

  btnMensual.onclick = function() {
    btnMensual.classList.add('activo');
    btnUnica.classList.remove('activo');
    if (textoMensual) { textoMensual.style.display = 'block'; }
  };
}

/* Configura el click de un pill de monto específico */
function configurarClickMonto(pill, todosPills, textoImpacto) {
  pill.onclick = function() {
    for (var j = 0; j < todosPills.length; j++) {
      todosPills[j].classList.remove('activo');
    }
    pill.classList.add('activo');

    var monto = pill.getAttribute('data-monto');
    if (textoImpacto && impactos[monto]) {
      textoImpacto.textContent = impactos[monto];
    }

    var inputPersonalizado = document.getElementById('input-monto-personalizado');
    if (inputPersonalizado) { inputPersonalizado.value = ''; }
  };
}

/* ========================================
   DONAR — MODAL DE CONFIRMACIÓN DE DONACIÓN
   Se abre al hacer click en "Donar ahora",
   muestra el monto elegido y su impacto, y
   permite confirmar o cancelar la donación.
======================================== */
function obtenerMontoActual() {
  var inputPersonalizado = document.getElementById('input-monto-personalizado');
  if (inputPersonalizado && Number(inputPersonalizado.value) > 0) {
    return Number(inputPersonalizado.value);
  }
  var pillActivo = document.querySelector('.monto-pill.activo');
  if (pillActivo) { return Number(pillActivo.getAttribute('data-monto')); }
  return 500;
}

function obtenerTextoImpactoModal(monto) {
  if (impactos[String(monto)]) { return impactos[String(monto)]; }
  var perros = Math.max(1, Math.floor(monto / 500));
  return 'Cubre la alimentación de ' + perros + (perros === 1 ? ' perro' : ' perros') + ' durante un mes 🐾';
}

function abrirModalDonacion() {
  var monto        = obtenerMontoActual();
  var textoImpacto = obtenerTextoImpactoModal(monto);
  var btnActivo    = document.querySelector('.toggle-btn.activo');
  var esMensual    = btnActivo && btnActivo.id === 'btn-mensual';
  var tipoDonacion = esMensual ? 'mensual' : 'única';

  var overlay = document.createElement('div');
  overlay.id  = 'modal-donacion-overlay';

  overlay.innerHTML =
    '<div class="modal-donacion" id="modal-donacion-box">' +
      '<button class="modal-donacion__cerrar" id="modal-donacion-cerrar">×</button>' +
      '<div class="modal-donacion__icono">🐾</div>' +
      '<h2 class="modal-donacion__titulo">Confirmá tu donación</h2>' +
      '<p class="modal-donacion__tipo">Donación ' + tipoDonacion + '</p>' +
      '<div class="modal-donacion__monto">$' + monto.toLocaleString('es-AR') + '</div>' +
      '<div class="modal-donacion__impacto"><p>' + textoImpacto + '</p></div>' +
      '<div class="modal-donacion__acciones">' +
        '<button class="btn-primary modal-donacion__btn-confirmar" id="modal-btn-confirmar">Confirmar donación</button>' +
        '<button class="modal-donacion__btn-cancelar" id="modal-btn-cancelar">Cancelar</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function cerrarModal() {
    overlay.remove();
    document.body.style.overflow = '';
  }

  overlay.querySelector('#modal-donacion-cerrar').onclick = cerrarModal;
  overlay.querySelector('#modal-btn-cancelar').onclick    = cerrarModal;

  overlay.onclick = function(e) { if (e.target === overlay) { cerrarModal(); } };

  function onEscape(e) {
    if (e.key === 'Escape') { cerrarModal(); document.removeEventListener('keydown', onEscape); }
  }
  document.addEventListener('keydown', onEscape);

  overlay.querySelector('#modal-btn-confirmar').onclick = function() {
    var box = document.getElementById('modal-donacion-box');
    box.innerHTML =
      '<div class="modal-donacion__gracias">' +
        '<div class="modal-donacion__icono" style="font-size:56px">🐾</div>' +
        '<h2 class="modal-donacion__titulo">¡Gracias por tu donación!</h2>' +
        '<p class="modal-donacion__subtexto">Tu aporte de <strong>$' + monto.toLocaleString('es-AR') + '</strong> ayuda a cambiar vidas.</p>' +
        '<p class="modal-donacion__subtexto" style="margin-top:8px">' + textoImpacto + '</p>' +
        '<button class="btn-primary modal-donacion__btn-confirmar" id="modal-btn-volver" style="margin-top:28px">Volver a la página</button>' +
      '</div>';
    box.querySelector('#modal-btn-volver').onclick = cerrarModal;
  };
}

/* ========================================
   VOLUNTARIOS — FORMULARIO DE INSCRIPCIÓN
   Valida campos obligatorios y muestra
   errores o mensaje de éxito según corresponda
======================================== */
function iniciarFormulario() {
  var form         = document.getElementById('form-voluntario');
  var mensajeExito = document.getElementById('exito-mensaje');

  if (!form) { return; }

  form.onsubmit = function(evento) {
    evento.preventDefault();
    limpiarErrores();
    var hayErrores = false;

    var campoNombre = document.getElementById('campo-nombre');
    if (campoNombre && campoNombre.value.trim() === '') {
      mostrarError('error-nombre', 'Por favor ingresá tu nombre completo.');
      hayErrores = true;
    }

    var campoEmail = document.getElementById('campo-email');
    if (campoEmail && campoEmail.value.trim() === '') {
      mostrarError('error-email', 'Por favor ingresá tu email.');
      hayErrores = true;
    } else if (campoEmail && campoEmail.value.indexOf('@') === -1) {
      mostrarError('error-email', 'El email no parece válido, verificá que tenga @.');
      hayErrores = true;
    }

    var campoTelefono = document.getElementById('campo-telefono');
    if (campoTelefono && campoTelefono.value.trim() === '') {
      mostrarError('error-telefono', 'Por favor ingresá tu número de teléfono.');
      hayErrores = true;
    }

    var campoCiudad = document.getElementById('campo-ciudad');
    if (campoCiudad && campoCiudad.value.trim() === '') {
      mostrarError('error-ciudad', 'Por favor ingresá tu ciudad.');
      hayErrores = true;
    }

    var tiposSeleccionados = document.querySelectorAll('input[name="tipo-voluntariado"]:checked');
    if (tiposSeleccionados.length === 0) {
      mostrarError('error-tipo', 'Seleccioná al menos un tipo de voluntariado.');
      hayErrores = true;
    }

    if (!hayErrores) {
      form.style.display = 'none';
      if (mensajeExito) {
        mensajeExito.style.display = 'block';
        mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
}

/* Muestra un mensaje de error en el span indicado */
function mostrarError(idSpan, mensaje) {
  var span = document.getElementById(idSpan);
  if (span) { span.innerHTML = mensaje; }
}

/* Limpia todos los mensajes de error antes de revalidar */
function limpiarErrores() {
  var spans = document.querySelectorAll('.campo-error');
  for (var i = 0; i < spans.length; i++) { spans[i].innerHTML = ''; }
}

/* ========================================
   INICIO — detección de página y llamado
   a las funciones que corresponden
======================================== */
document.addEventListener('DOMContentLoaded', function() {
  iniciarAnimaciones();

  var ruta = window.location.pathname;

  if (ruta.indexOf('adoptar') !== -1) {
    iniciarFiltros();
    iniciarModal();
  }

  if (ruta.indexOf('donar') !== -1) {
    iniciarSelectorMonto();
  }

  if (ruta.indexOf('voluntarios') !== -1) {
    iniciarFormulario();
  }

  if (ruta.indexOf('index') !== -1 || ruta.endsWith('/') || ruta.indexOf('/home/') !== -1) {
    iniciarContadores();
  }
});
