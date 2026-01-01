# 🎊 Tarjeta de Año Nuevo 2025 ✨

Una hermosa tarjeta interactiva con cuenta regresiva para Año Nuevo 2025, con notificaciones a Telegram.

## 📁 Estructura de Archivos

```
proyecto-ano-nuevo/
│
├── index.html          # Página principal
├── styles.css          # Estilos
├── script.js           # Lógica principal
├── config.js           # Configuración (TOKEN DE TELEGRAM)
├── .gitignore          # Archivos a ignorar en Git
└── README.md           # Este archivo
```

## 🚀 Instalación y Uso

### 1. Descarga todos los archivos

Crea una carpeta y guarda estos archivos:
- `index.html`
- `styles.css`
- `script.js`
- `config.js`

### 2. Configuración de Seguridad

#### Crear archivo `.gitignore`

Si vas a subir esto a GitHub, crea un archivo `.gitignore`:

```
# Archivo de configuración con tokens sensibles
config.js

# Archivos del sistema
.DS_Store
Thumbs.db
```

#### Archivo `config.example.js` (para GitHub)

Crea una copia de ejemplo SIN tus tokens reales:

```javascript
// config.example.js - Archivo de ejemplo para GitHub
const CONFIG = {
  TELEGRAM_BOT_TOKEN: 'TU_TOKEN_AQUI',
  TELEGRAM_CHAT_ID: 'TU_CHAT_ID_AQUI',
  ANO_NUEVO: new Date('2025-01-01T00:00:00'),
  LOCAL_STORAGE_KEY: 'nombre-remitente-ano-nuevo',
  USER_ID_KEY: 'user-session-id-ano-nuevo'
};
```

### 3. Abrir la página

Simplemente abre `index.html` en tu navegador.

## ✨ Características

### 🎯 Cuenta Regresiva
- **Antes de Año Nuevo**: Muestra cuenta regresiva con días, horas, minutos y segundos
- **Cuando llega a 0**: Cambia automáticamente a pantalla de celebración con confetti

### 📱 Notificaciones a Telegram

Recibirás 3 tipos de mensajes:

1. **Cuando alguien cambia el nombre**
```
🔄 NOMBRE ACTUALIZADO (AÑO NUEVO)
📝 Anterior: EDSON SURCO QUISPE
✨ Nuevo: Juan Pérez
👤 Usuario: user_173516789
📅 30 dic 2024 - 20:45
```

2. **Cuando envían la tarjeta**
```
🎊 TARJETA DE AÑO NUEVO ENVIADA
📤 De: EDSON SURCO QUISPE
📥 Para: María García
👤 Usuario: user_173516789
📅 30 dic 2024 - 20:47
```

3. **Cuando llega el Año Nuevo**
```
🎆 ¡LLEGÓ EL 2025!
🎊 La tarjeta llegó al momento exacto
📤 De: EDSON SURCO QUISPE
📥 Para: María García
👤 Usuario: user_173516789
📅 01 ene 2025 - 00:00
```

### 🔐 Seguridad

- **Token separado**: El token de Telegram está en `config.js` (no en el código principal)
- **`.gitignore`**: Previene subir tokens a GitHub accidentalmente
- **ID único**: Cada usuario tiene un ID para rastrear quién usa la tarjeta

## 🌐 Publicar en Internet

### Opción 1: Netlify (Más seguro)

1. Sube SOLO estos archivos:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `config.example.js` (renómbralo a `config.js`)

2. En Netlify, configura **Environment Variables**:
   - `TELEGRAM_BOT_TOKEN`: Tu token real
   - `TELEGRAM_CHAT_ID`: Tu chat ID

3. Modifica `config.js` para usar variables de entorno (código Node.js necesario)

### Opción 2: GitHub Pages (Menos seguro)

⚠️ **CUIDADO**: Tu token será visible en el código fuente

1. Crea un repositorio
2. Sube archivos EXCEPTO `config.js`
3. Sube `config.example.js`
4. Los usuarios deben crear su propio `config.js` localmente

### Opción 3: Servidor propio (Más seguro)

Usa un backend (Node.js, PHP, etc.) para:
- Guardar el token en el servidor
- Hacer peticiones a Telegram desde el servidor
- No exponer el token al navegador

## 🎨 Personalización

### Cambiar fecha del Año Nuevo (para pruebas)

En `config.js`:
```javascript
ANO_NUEVO: new Date('2024-12-31T23:59:50'), // Prueba en 10 segundos
```

### Cambiar nombre por defecto

En `config.js` o directamente en `script.js`:
```javascript
document.getElementById('remitente').value = 'TU NOMBRE';
```

### Cambiar colores

En `styles.css`, busca y cambia:
- `#ffd700` (dorado)
- `#ff6b6b` (rojo)
- `#4ecdc4` (cyan)

## 📱 Responsive

La página se adapta automáticamente a:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1024px)
- 📱 Móvil (< 768px)
- 📱 Móvil pequeño (< 480px)

## 🐛 Solución de Problemas

### Los mensajes no llegan a Telegram

1. Verifica que tu token sea correcto
2. Verifica que tu chat ID sea correcto
3. Abre la consola del navegador (F12) y busca errores
4. Asegúrate de haber hablado con tu bot al menos una vez

### El temporizador no funciona

1. Verifica que la fecha en `config.js` sea correcta
2. Revisa la zona horaria de tu navegador

### Los efectos visuales son lentos

1. Reduce el número de partículas en `script.js`:
```javascript
for (let i = 0; i < 450; i++) // En vez de 900
```

## 📄 Licencia

Uso personal y educativo. ¡Disfruta y feliz 2025! 🎊✨

---

**Creado con ❤️ por Edson Surco Quispe**