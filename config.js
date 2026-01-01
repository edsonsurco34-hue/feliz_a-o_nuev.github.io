// ========== CONFIGURACIÓN PRINCIPAL ==========
const CONFIG = {
  // Fecha objetivo: 1 de enero de 2026
  ANO_NUEVO: new Date('2026-01-01T00:00:00'),
  
  // Telegram Bot (configuración para notificaciones)
  TELEGRAM_BOT_TOKEN: '8515492708:AAHq6Y5cL_WcR7DmZYzJTZUeg0qbHtSRod0',
  TELEGRAM_CHAT_ID: '1671214153',
  
  // Nombres y claves para almacenamiento
  LOCAL_STORAGE_KEY: 'nombre_remitente_2026',
  USER_ID_KEY: 'user_id_2026',
  PARENT_ID_KEY: 'parent_id_2026',
  
  // Nombre de la madre (cuenta original)
  NOMBRE_MADRE: 'EDSON SURCO QUISPE',
  
  // Nombres especiales con fechas
  NOMBRES_ESPECIALES: {
    PERSONA_ESPECIAL: {
      nombreReal: "MILKA NATALIA",
      aliases: [
        "milka",
        "natalia",
        "milka natalia",
        "natalia milka"
      ],
      mensaje: `Para este 2026 deseo que la vida te trate con ternura, 
      que lleguen cosas buenas, personas que te cuiden, momentos que te
       hagan sonreír de verdad y metas que se conviertan en logros. 
       Que tengas paz cuando la necesites, fuerza cuando haga falta y esas
        pequeñas alegrías que llegan sin avisar pero iluminan el día entero.


Feliz Año Nuevo 2026 ✨
Que sea un año enorme para ti… como tú lo mereces.`
    }
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}