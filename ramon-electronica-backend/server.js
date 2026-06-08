/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ramón Electrónica 🇻🇪 IoT Platform
 * Broker de Mensajería MQTT sobre WebSockets de alto rendimiento para Render.com
 */

const aedes = require('aedes')();
const httpServer = require('http').createServer();
const ws = require('websocket-stream');

// Render define el puerto usando la variable de entorno 'PORT' de manera dinámica
const PORT = process.env.PORT || 3000;

// Vinculamos Aedes con el Servidor HTTP de Node.js en forma de WebSockets.
// NOTA IMPORTANTE: Render en su capa gratuita Web Services solo expone tráfico HTTP/HTTPS.
// Por lo tanto, los microcontroladores ESP32/ESP8266 y tu WebApp deben comunicarse 
// usando MQTT sobre WebSockets (ws:// tu-app.onrender.com o wss:// tu-app.onrender.com).
ws.createServer({ server: httpServer }, aedes.handle);

// Opcional: Configuración de Autenticación de Módulos ESP32
// Para mayor seguridad de tu ecosistema, puedes definir usuario/contraseña usando variables de entorno.
const MQTT_USER = process.env.MQTT_USER || 'ramon_esp32';
const MQTT_PASS = process.env.MQTT_PASS || 'control_seguro_panas';

aedes.authenticate = function (client, username, password, callback) {
  // Comparamos credenciales si se provee usuario. Si no se provee en Render, permitimos en fase beta local.
  const passStr = password ? password.toString() : '';
  if (!username && !password) {
    console.log(`⚠️ Cliente '${client.id}' conectado sin credenciales de seguridad.`);
    return callback(null, true);
  }
  
  if (username === MQTT_USER && passStr === MQTT_PASS) {
    return callback(null, true);
  } else {
    console.log(`❌ Intento de autenticación fallido para el cliente: ${client.id}`);
    const error = new Error('Auth error');
    error.returnCode = 4; // Bad username or password
    return callback(error, null);
  }
};

// --- Manejadores de Eventos del Broker (Loggers) ---

// Al conectarse un cliente (ESP32 o Teléfono)
aedes.on('client', function (client) {
  console.log(`🔌 Cliente Conectado: \x1b[32m${client ? client.id : 'Desconocido'}\x1b[0m`);
});

// Al desconectarse un cliente
aedes.on('clientDisconnect', function (client) {
  console.log(`💤 Cliente Desconectado: \x1b[31m${client ? client.id : 'Desconocido'}\x1b[0m`);
});

// Al publicarse un mensaje de control (Encender/Apagar relé)
aedes.on('publish', function (packet, client) {
  if (packet && packet.topic.startsWith('$SYS')) return; // Filtramos estadísticas del sistema
  
  const payloadStr = packet.payload ? packet.payload.toString() : '';
  const clientName = client ? client.id : 'Broker Local';
  
  console.log(`✉️ Mensaje en [${packet.topic}] de [${clientName}]: ${payloadStr}`);
});

// Al suscribirse a un tema de telemetría o estado
aedes.on('subscribe', function (subscriptions, client) {
  const clientName = client ? client.id : 'Desconocido';
  subscriptions.forEach(sub => {
    console.log(`👀 Cliente [${clientName}] suscrito al canal: ${sub.topic}`);
  });
});

// Manejo de errores globales para prevenir caídas del servidor
process.on('uncaughtException', (err) => {
  console.error('🔥 Error sin capturar detectado en el hilo principal:', err);
});

// Iniciamos el servicio WebSockets HTTP
httpServer.listen(PORT, '0.0.0.0', function () {
  console.log('===================================================');
  console.log(`🚀 Servicio MQTT (WebSockets) de Ramón Electrónica`);
  console.log(`📡 Puerto de Escucha: ${PORT}`);
  console.log(`🔒 Servidor Enlazado y Listo para Escuchar Tráfico`);
  console.log('===================================================');
});
