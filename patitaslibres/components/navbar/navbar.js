// navbar.js — lógica del componente navbar

var hamburguesa = document.getElementById("hamburguesa");
var navLinks = document.getElementById("nav-links");

// Al clickear el hamburguesa, abrir o cerrar el menú
hamburguesa.onclick = function() {
  if (navLinks.classList.contains("abierto")) {
    navLinks.classList.remove("abierto");
  } else {
    navLinks.classList.add("abierto");
  }
};

// Al clickear cualquier link del menú, cerrarlo
var links = navLinks.querySelectorAll("a");
for (var i = 0; i < links.length; i++) {
  links[i].onclick = function() {
    navLinks.classList.remove("abierto");
  };
}

// Al hacer scroll, cerrar el menú y aplicar clase scrolled al navbar
window.onscroll = function() {
  if (window.scrollY > 50) {
    document.getElementById("navbar").classList.add("scrolled");
  } else {
    document.getElementById("navbar").classList.remove("scrolled");
  }
  navLinks.classList.remove("abierto");
};

/* ========================================
   FUNCIÓN: marcarLinkActivo
   Lee la URL actual y marca con la clase
   "active" el link del navbar correspondiente
======================================== */
function marcarLinkActivo() {
  var ruta = window.location.pathname;
  var todosLosLinks = document.querySelectorAll('.nav-links a');

  for (var i = 0; i < todosLosLinks.length; i++) {
    var link = todosLosLinks[i];

    if (link.classList.contains('navbar__cta')) { continue; }

    var href = link.getAttribute('href');
    var partes = href.split('/');
    var nombreArchivo = partes[partes.length - 1];

    if (nombreArchivo === 'index.html') {
      if (ruta.indexOf('index.html') !== -1 || ruta.endsWith('/') || ruta.indexOf('/index/') !== -1) {
        link.classList.add('active');
      }
    } else if (nombreArchivo) {
      var nombrePagina = nombreArchivo.replace('.html', '');
      if (ruta.indexOf(nombrePagina) !== -1) {
        link.classList.add('active');
      }
    }
  }
}

marcarLinkActivo();
