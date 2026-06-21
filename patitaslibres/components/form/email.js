// email.js — envío real del formulario de contacto vía EmailJS

var EMAILJS_SERVICE_ID  = 'service_nfxj28l';
var EMAILJS_TEMPLATE_ID = 'template_xn67i9l';
var EMAILJS_PUBLIC_KEY  = '8To3nY26MuY8oRWsp';

function iniciarEmailJS() {
  if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
}

/* Envía el formulario de contacto por email. Llama a onExito() o onError(mensaje) según el resultado. */
function enviarEmailContacto(datos, onExito, onError) {
  if (!window.emailjs) {
    onError('No se pudo cargar el servicio de envío. Intentá de nuevo más tarde.');
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:  datos.nombre,
    from_email: datos.email,
    subject:    datos.asunto || 'Consulta desde la web',
    message:    datos.mensaje
  }).then(function() {
    onExito();
  }).catch(function(error) {
    onError('No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.');
  });
}

document.addEventListener('DOMContentLoaded', iniciarEmailJS);
