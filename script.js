// Variables globales
let temporizadorInterval = null;
let yaLlego2026 = false;
let nombreDestinatarioGlobal = '';
let nombreRemitenteGlobal = '';
let esMadre = false;

// ========== ALMACENAMIENTO EN MEMORIA (Reemplaza localStorage) ==========
const memoryStorage = {
  userID: null,
  parentID: null,
  nombreRemitente: null
};

function obtenerUserID() {
  if (!memoryStorage.userID) {
    memoryStorage.userID = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return memoryStorage.userID;
}

function obtenerCadenaParental() {
  if (!memoryStorage.parentID) {
    memoryStorage.parentID = 'MADRE';
  }
  return memoryStorage.parentID;
}

const USER_ID = obtenerUserID();
const CADENA_PARENTAL = obtenerCadenaParental();

// ========== INICIALIZACIÓN ==========
window.addEventListener('DOMContentLoaded', () => {
  const nombreActual = memoryStorage.nombreRemitente || CONFIG.NOMBRE_MADRE;
  
  document.getElementById('remitente').value = nombreActual;
  
  // Verificar si es la madre
  esMadre = (CADENA_PARENTAL === 'MADRE');
  
  document.getElementById('loading').style.display = 'none';
  document.getElementById('formulario').style.display = 'block';
  
  console.log('👤 Usuario:', USER_ID.substring(0, 15));
  console.log('👨‍👩‍👧‍👦 Cadena:', esMadre ? 'MADRE (original)' : 'HIJO (compartida)');
});

// ========== TELEGRAM ==========
async function enviarTelegram(mensaje) {
  const telegramUrl = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const params = new URLSearchParams({
      chat_id: CONFIG.TELEGRAM_CHAT_ID,
      text: mensaje
    });
    
    const img = new Image();
    img.src = `${telegramUrl}?${params.toString()}`;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ Mensaje enviado a Telegram');
    return true;
  } catch (error) {
    console.error('❌ Error al enviar:', error);
    return false;
  }
}

// ========== EDITAR NOMBRE ==========
async function editarNombre() {
  const input = document.getElementById('remitente');
  const btn = event.target;
  
  if (btn.textContent.includes('Editar')) {
    window.nombreAnterior = input.value;
    input.removeAttribute('readonly');
    input.focus();
    input.select();
    btn.textContent = '💾 Guardar';
    btn.style.background = 'rgba(76, 175, 80, 0.3)';
    btn.style.color = '#4caf50';
  } else {
    const nuevo = input.value.trim();
    if (nuevo === '') {
      alert('¡El nombre no puede estar vacío!');
      input.value = window.nombreAnterior;
      return;
    }
    
    // Guardar nombre en memoria
    memoryStorage.nombreRemitente = nuevo;
    
    // Marcar como hijo si cambió el nombre
    if (nuevo !== CONFIG.NOMBRE_MADRE && CADENA_PARENTAL === 'MADRE') {
      memoryStorage.parentID = 'HIJO-' + USER_ID;
      console.log('🔄 Cambio de MADRE a HIJO');
    }
    
    if (nuevo !== window.nombreAnterior) {
      const ahora = new Date();
      const fecha = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      
      const tipoCuenta = CADENA_PARENTAL === 'MADRE' ? 'MADRE' : 'HIJO';
      
      const mensaje = `🔄 NOMBRE ACTUALIZADO (${tipoCuenta})

📝 Anterior: ${window.nombreAnterior}
✨ Nuevo: ${nuevo}
👤 Usuario: ${USER_ID.substring(0, 15)}
👨‍👩‍👧‍👦 Tipo: ${tipoCuenta}
📅 ${fecha} - ${hora}

${tipoCuenta === 'MADRE' ? '👑 Cuenta madre actualizada' : '👶 Cuenta hijo independiente creada'}`;

      await enviarTelegram(mensaje);
    }
    
    input.setAttribute('readonly', true);
    btn.textContent = '✓ Guardado';
    btn.style.background = 'rgba(255, 119, 0, 0.3)';
    btn.style.color = '#ffaa00';
    setTimeout(() => { btn.textContent = '✏️ Editar'; }, 1500);
  }
}

// ========== VERIFICAR NOMBRE ESPECIAL ==========
function esNombreEspecial(nombre) {
  const nombreLower = nombre.toLowerCase().trim();
  
  // Verificar la persona especial
  const personaEspecial = CONFIG.NOMBRES_ESPECIALES.PERSONA_ESPECIAL;
  for (let alias of personaEspecial.aliases) {
    if (nombreLower.includes(alias.toLowerCase())) {
      return 'PERSONA_ESPECIAL';
    }
  }
  
  return null;
}

// ========== INICIAR TARJETA ==========
async function iniciar() {
  const remitente = document.getElementById("remitente").value.trim();
  const destinatario = document.getElementById("destinatario").value.trim();
  const inputRemitente = document.getElementById('remitente');
  
  if (!inputRemitente.hasAttribute('readonly')) {
    alert('⚠️ Debes GUARDAR el nombre del remitente antes de continuar!\n\nHaz clic en "💾 Guardar" primero. 🎊');
    return;
  }
  
  if (!destinatario) {
    alert("¡Por favor ingresa el nombre completo del destinatario! 🎆");
    return;
  }
  
  // Guardar nombres globalmente
  nombreDestinatarioGlobal = destinatario;
  nombreRemitenteGlobal = remitente;
  
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  
  const tipoCuenta = esMadre ? 'MADRE' : 'HIJO';
  
  const mensaje = `🎊 TARJETA DE AÑO NUEVO ENVIADA

📤 De: ${remitente}
📥 Para: ${destinatario}
👤 Usuario: ${USER_ID.substring(0, 15)}
👨‍👩‍👧‍👦 Tipo: ${tipoCuenta}
📅 ${fecha} - ${hora}

${tipoCuenta === 'MADRE' ? '👑 Enviado desde cuenta madre' : '👶 Enviado desde cuenta hijo'}`;

  await enviarTelegram(mensaje);
  
  // Verificar si es nombre especial (SOLO MADRE)
  if (esMadre) {
    const nombreEspecial = esNombreEspecial(destinatario);
    if (nombreEspecial) {
      mostrarMensajeEspecial(destinatario, nombreEspecial);
      return;
    }
  }
  
  // Continuar normalmente
  mostrarEscena(remitente, destinatario);
}

// ========== MOSTRAR MENSAJE ESPECIAL (SOLO MADRE) ==========
function mostrarMensajeEspecial(nombre, clave) {
  const datos = CONFIG.NOMBRES_ESPECIALES[clave];
  
  document.getElementById('formulario').style.display = 'none';
  document.getElementById('mensaje-especial').style.display = 'flex';
  document.querySelector('.icono-grande').textContent = '🥳';
  document.getElementById('tituloEspecial').textContent = `¡Feliz Año Nuevo, ${datos.nombreReal}!`;
  document.getElementById('textoEspecial').textContent = datos.mensaje;
  
  // Iniciar temporizador en mensaje especial
  iniciarTemporizadorEspecial();
  
  // Enviar notificación especial
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  
  const mensajeTelegram = `💝 MENSAJE ESPECIAL ACTIVADO (SOLO MADRE)

🎯 Nombre detectado: ${nombre}
👤 Persona especial: ${datos.nombreReal}
⏰ ${fecha} - ${hora}
👑 Activado desde cuenta MADRE

¡La persona especial abrió su tarjeta! 🎉✨`;

  enviarTelegram(mensajeTelegram);
}

// ========== TEMPORIZADOR PARA MENSAJE ESPECIAL ==========
let temporizadorEspecialInterval = null;

function iniciarTemporizadorEspecial() {
  actualizarTemporizadorEspecial();
  temporizadorEspecialInterval = setInterval(actualizarTemporizadorEspecial, 1000);
}

function actualizarTemporizadorEspecial() {
  const ahora = new Date();
  const diferencia = CONFIG.ANO_NUEVO - ahora;
  
  if (diferencia <= 0) {
    clearInterval(temporizadorEspecialInterval);
    document.getElementById('dias-especial').textContent = '00';
    document.getElementById('horas-especial').textContent = '00';
    document.getElementById('minutos-especial').textContent = '00';
    document.getElementById('segundos-especial').textContent = '00';
    return;
  }
  
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  
  document.getElementById('dias-especial').textContent = String(dias).padStart(2, '0');
  document.getElementById('horas-especial').textContent = String(horas).padStart(2, '0');
  document.getElementById('minutos-especial').textContent = String(minutos).padStart(2, '0');
  document.getElementById('segundos-especial').textContent = String(segundos).padStart(2, '0');
}

// ========== CONTINUAR DESPUÉS DEL MENSAJE ESPECIAL ==========
function continuarDespuesEspecial() {
  // Detener temporizador especial
  if (temporizadorEspecialInterval) {
    clearInterval(temporizadorEspecialInterval);
  }
  
  document.getElementById('mensaje-especial').style.display = 'none';
  mostrarEscena(nombreRemitenteGlobal, nombreDestinatarioGlobal);
}

// ========== MOSTRAR ESCENA PRINCIPAL ==========
function mostrarEscena(remitente, destinatario) {
  document.getElementById("formulario").style.display = "none";
  document.getElementById("escena").style.display = "block";
  
  // Actualizar header con nombre
  const primerNombre = remitente.split(' ')[0] + ' ' + (remitente.split(' ')[1] || '');
  document.getElementById("headerName").textContent = primerNombre;
  
  document.getElementById("mensajeInicial").innerHTML = `De: ${remitente} • Para: ${destinatario}`;
  document.getElementById("nombreEspecial").innerHTML = `🎉 Para ${destinatario} 🎉`;
  document.getElementById("firmaRemitente").innerHTML = `Saludos, ${remitente} ✨`;
  
  iniciarTemporizador();
  animate();
}

// ========== MOSTRAR MENSAJE FINAL ==========
function mostrarMensajeFinal() {
  document.getElementById('contenidoPrincipal').style.display = 'flex';
  document.getElementById('compartirMensaje').style.display = 'block';
  
  // Scroll suave hacia el contenido principal después de que se muestre
  setTimeout(() => {
    const contenido = document.getElementById('contenidoPrincipal');
    if (contenido) {
      const yOffset = -80; // Offset para que no quede pegado arriba
      const y = contenido.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, 300);
  
  setTimeout(() => {
    document.getElementById("mensajeFinal").innerHTML = "<span class='fire-text'>🎊 ¡Feliz Año Nuevo 2026! 🎉</span><br>✨ Que este nuevo año esté lleno de éxitos y felicidad ✨";
  }, 1000);
}

// ========== TEMPORIZADOR ==========
function iniciarTemporizador() {
  actualizarTemporizador();
  temporizadorInterval = setInterval(actualizarTemporizador, 1000);
}

function actualizarTemporizador() {
  const ahora = new Date();
  const diferencia = CONFIG.ANO_NUEVO - ahora;
  
  if (diferencia <= 0 && !yaLlego2026) {
    clearInterval(temporizadorInterval);
    mostrarCelebracion();
    return;
  }
  
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  
  document.getElementById('dias').textContent = String(dias).padStart(2, '0');
  document.getElementById('horas').textContent = String(horas).padStart(2, '0');
  document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
  document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

// ========== CELEBRACIÓN ==========
function mostrarCelebracion() {
  yaLlego2026 = true;
  
  document.getElementById('escena').style.display = 'none';
  document.getElementById('celebracion').style.display = 'flex';
  document.getElementById('mensaje-celebracion-texto').innerHTML = 
    `¡${nombreDestinatarioGlobal}!<br>Que el 2026 sea tu mejor año. 🎊<br>Saludos de ${nombreRemitenteGlobal} ✨`;
  
  iniciarFuegosArtificiales();
  iniciarConfetti();
  
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  
  const tipoCuenta = esMadre ? 'MADRE' : 'HIJO';
  
  const mensaje = `🎆 ¡LLEGÓ EL 2026!

🎊 Llegó el momento exacto
📤 De: ${nombreRemitenteGlobal}
📥 Para: ${nombreDestinatarioGlobal}
👤 Usuario: ${USER_ID.substring(0, 15)}
👨‍👩‍👧‍👦 Tipo: ${tipoCuenta}
📅 ${fecha} - ${hora}

¡FELIZ AÑO NUEVO 2026! 🎉✨`;

  enviarTelegram(mensaje);
}

// ========== FUEGOS ARTIFICIALES ==========
function iniciarFuegosArtificiales() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const fireworks = [];
  const particles = [];
  
  class Firework {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.targetY = Math.random() * canvas.height * 0.5;
      this.speed = 3 + Math.random() * 2;
      this.exploded = false;
    }
    
    update() {
      if (!this.exploded) {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.explode();
        }
      }
    }
    
    explode() {
      this.exploded = true;
      const colors = ['#ff0000', '#ff7700', '#ffaa00', '#ffdd00', '#ffd700'];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(this.x, this.y, colors[Math.floor(Math.random() * colors.length)]));
      }
    }
    
    draw() {
      if (!this.exploded) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 100;
      this.decay = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.1;
      this.life -= this.decay;
    }
    
    draw() {
      if (this.life > 0) {
        ctx.globalAlpha = this.life / 100;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  function animateFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    
    if (Math.random() < 0.05) {
      fireworks.push(new Firework());
    }
    
    fireworks.forEach((fw, i) => {
      fw.update();
      fw.draw();
      if (fw.exploded) {
        fireworks.splice(i, 1);
      }
    });
    
    particles.forEach((p, i) => {
      p.update();
      p.draw();
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    });
    
    requestAnimationFrame(animateFireworks);
  }
  
  animateFireworks();
}

// ========== CONFETTI ==========
function iniciarConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const confettiPieces = [];
  const colors = ['#ff0000', '#ff7700', '#ffaa00', '#ffdd00', '#ffd700'];
  
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 15 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speedY: Math.random() * 3 + 2,
      speedRotation: Math.random() * 5 - 2.5
    });
  }
  
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces.forEach(piece => {
      ctx.save();
      ctx.translate(piece.x + piece.w / 2, piece.y + piece.h / 2);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
      
      piece.y += piece.speedY;
      piece.rotation += piece.speedRotation;
      
      if (piece.y > canvas.height) {
        piece.y = -piece.h;
        piece.x = Math.random() * canvas.width;
      }
    });
    
    requestAnimationFrame(animateConfetti);
  }
  
  animateConfetti();
}

// ========== EFECTOS VISUALES ==========
function crearEstrellas() {
  const particulas = ['✨', '⭐', '💫', '🌟'];
  
  for (let i = 0; i < 15; i++) {
    const estrella = document.createElement('div');
    estrella.innerHTML = particulas[Math.floor(Math.random() * particulas.length)];
    estrella.style.position = 'fixed';
    estrella.style.left = Math.random() * 100 + '%';
    estrella.style.top = Math.random() * 100 + '%';
    estrella.style.fontSize = (Math.random() * 20 + 15) + 'px';
    estrella.style.opacity = '0';
    estrella.style.pointerEvents = 'none';
    estrella.style.zIndex = '1';
    estrella.style.animation = `aparecer 2s ease-in-out ${Math.random() * 2}s infinite`;
    document.body.appendChild(estrella);
  }
  
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes aparecer {
      0%, 100% { opacity: 0; transform: translateY(0); }
      50% { opacity: 0.8; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
}

// ========== ANIMACIÓN 3D (Copas brindando con burbujas) ==========
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = 500;

const bubbles = [];

class Bubble {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
    this.y = canvas.height - 50;
    this.radius = Math.random() * 8 + 3;
    this.speed = Math.random() * 2 + 1;
    this.wobble = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.color = ['#ffd700', '#ffaa00', '#ff7700', '#ffffff'][Math.floor(Math.random() * 4)];
  }
  
  update() {
    this.y -= this.speed;
    this.x += Math.sin(this.y * 0.05) * this.wobble;
    this.opacity -= 0.005;
    
    if (this.y < 50 || this.opacity <= 0) {
      this.reset();
    }
  }
  
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    const gradient = ctx.createRadialGradient(
      this.x - this.radius / 3, 
      this.y - this.radius / 3, 
      0, 
      this.x, 
      this.y, 
      this.radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, this.color);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x - this.radius / 3, this.y - this.radius / 3, this.radius / 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

for (let i = 0; i < 100; i++) {
  bubbles.push(new Bubble());
}

function drawGlass(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#ffd700';
  
  ctx.beginPath();
  ctx.moveTo(-30, -60);
  ctx.lineTo(-40, 20);
  ctx.lineTo(40, 20);
  ctx.lineTo(30, -60);
  ctx.closePath();
  ctx.stroke();
  
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#ffaa00';
  ctx.beginPath();
  ctx.moveTo(-28, -55);
  ctx.lineTo(-38, 15);
  ctx.lineTo(38, 15);
  ctx.lineTo(28, -55);
  ctx.closePath();
  ctx.fill();
  
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(-40, 20);
  ctx.lineTo(-10, 60);
  ctx.lineTo(10, 60);
  ctx.lineTo(40, 20);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(-30, 60);
  ctx.lineTo(30, 60);
  ctx.lineWidth = 4;
  ctx.stroke();
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(-25, -50);
  ctx.lineTo(-20, -10);
  ctx.stroke();
  
  ctx.restore();
}

let rotation = 0;
let tiltAngle = 0;
let tiltDirection = 1;

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  tiltAngle += 0.02 * tiltDirection;
  if (Math.abs(tiltAngle) > 0.2) {
    tiltDirection *= -1;
  }
  
  bubbles.forEach(bubble => {
    bubble.update();
    bubble.draw();
  });
  
  ctx.save();
  
  ctx.save();
  ctx.translate(canvas.width / 2 - 80, canvas.height / 2 + 100);
  ctx.rotate(-tiltAngle);
  drawGlass(0, 0, 1.2);
  ctx.restore();
  
  ctx.save();
  ctx.translate(canvas.width / 2 + 80, canvas.height / 2 + 100);
  ctx.rotate(tiltAngle);
  drawGlass(0, 0, 1.2);
  ctx.restore();
  
  ctx.restore();
  
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.font = 'bold 180px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#ff0000');
  gradient.addColorStop(0.5, '#ff7700');
  gradient.addColorStop(1, '#ffdd00');
  
  ctx.fillStyle = gradient;
  ctx.fillText('2026', canvas.width / 2, canvas.height / 2 - 50);
  ctx.restore();
  
  requestAnimationFrame(animate);
}

document.getElementById('destinatario').addEventListener('keypress', e => {
  if (e.key === 'Enter') iniciar();
});

crearEstrellas();