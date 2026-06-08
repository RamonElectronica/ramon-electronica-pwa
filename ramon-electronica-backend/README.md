# Ramón Electrónica Backend & Broker MQTT 🇻🇪

Este es el repositorio oficial del backend para el control e interconexión de los módulos domóticos de **Ramón Electrónica**. 
Está optimizado al 100% para funcionar en la capa gratuita de **Render.com** (usando servicios web en Node.js) sin que expire tu sesión ni falle en los ciclos de compilación.

---

## 🚀 Arquitectura Tecnológica en la Nube de Render
En la capa gratuita de **Render Web Services**, la plataforma solo expone tráfico cifrado estándar **HTTP (puerto 80) y HTTPS (puerto 443)**. 
Los puertos TCP crudos (como el puerto estándar MQTT `1883`) no están permitidos externamente en Render.

- **La Solución Profesional:** El servidor está estructurado usando **Aedes** para enmascarar la conexión MQTT como un túnel de **WebSockets**.
- **Para tus Equipos (ESP32 / ESP8266) o Frontend:** Deberás conectarte empleando el protocolo de sockets:
  - Ruta de Red Local/Test: `ws://localhost:3000`
  - URL en Producción en la Nube: `wss://tu-backend-ramon.onrender.com`

---

## 🛠️ Cómo Instalar y Desplegar en Render Paso a Paso

1. **Crea un repositorio en GitHub:**
   - Nombre: `ramon-electronica-backend` (en tu perfil personal o comercial).
   
2. **Sube estos archivos:**
   - Sube los archivos `package.json` y `server.js` de esta carpeta a la raíz de tu repositorio.

3. **Inicia sesión en Render.com:**
   - Haz clic en **"New +"** ➔ **"Web Service"**.
   - Conecta tu cuenta de GitHub y elige el repositorio `ramon-electronica-backend`.

4. **Configura el servicio con estos parámetos estándar:**
   - **Name:** `ramon-electronica-backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free` (Capa Gratuita).

5. **Variables de Entorno opcionales (Pestaña "Env Vars"):**
   - Agrega `MQTT_USER` con tu nombre de usuario (ejemplo: `ramon_esp32`).
   - Agrega `MQTT_PASS` con tu clave secreta de control (ejemplo: `control_seguro_panas`).
   
6. **¡Listo!** Render compilará tu servidor y te dará un enlace HTTPS como `https://ramon-electronica-backend.onrender.com`.

---

## 📡 Ejemplo de Conexión en tu ESP32 (Arduino IDE)
Para que tus módulos **ESP32 o ESP8266** se comuniquen con este servidor, utiliza la biblioteca `PubSubClient` configurada en modo WebSocket, o una alternativa moderna como `arduinoWebsockets` para canalizar los bytes MQTT.

Ejemplo básico de configuración usando un cliente WebSockets a MQTT en C++:

```cpp
#include <WiFi.h>
#include <WebSocketsClient.h> // Deberás instalar la librería de WebSockets para ESP32

const char* ssid = "Tu_Red_WiFi";
const char* password = "Clave_De_Tu_WiFi";

// URL de tu servidor en Render (sin el "wss://")
const char* websockets_server = "tu-backend-ramon.onrender.com"; 
const int websockets_port = 443; // Usamos el puerto SSL estándar de Render

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("[WS] Desconectado del Broker de Ramón Electrónica");
      break;
    case WStype_CONNECTED:
      Serial.println("[WS] Conectado exitosamente al túnel de Render");
      // Aquí puedes iniciar el saludo MQTT
      break;
    case WStype_TEXT:
      Serial.printf("[WS] Mensaje de control recibido: %s\n", payload);
      // Analiza el payload (ej. "ON" o "OFF") para activar el pin físico del relé
      if (strcmp((char*)payload, "ON") == 0) {
         digitalWrite(2, HIGH); // Pin físico de encendido
      } else if (strcmp((char*)payload, "OFF") == 0) {
         digitalWrite(2, LOW);
      }
      break;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT); // Pin del LED / Relé integrado

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi Conectado!");

  // Conexión SSL de alta seguridad sobre WebSockets
  webSocket.beginSSL(websockets_server, websockets_port, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); // Intento automático cada 5 segundos si falla la red en Venezuela
}

void loop() {
  webSocket.loop();
}
```

---

## 🔒 Seguridad Integrada
El servidor cuenta con protección básica en el archivo `server.js` que verifica que cualquier dispositivo que intente publicar o suscribirse envíe las variables de entorno de autenticación, protegiendo así tus relés de accesos falsos externos.

Desarrollado bajo los estándares de ingeniería de **Ramón Electrónica 🇻🇪**.
