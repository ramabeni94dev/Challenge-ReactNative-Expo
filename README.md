# 📱 Challenge React Native

Este es un challenge desarrollado en **React Native con Expo** que consume la API de **Google PageSpeed Insights** para analizar métricas de rendimiento de sitios web. Los datos obtenidos se almacenan localmente en la aplicación .

---

## 🚀 Tecnologías utilizadas

- **Framework:** React Native (Expo)
- **Lenguaje:** JavaScript
- **Almacenamiento Local:** AsyncStorage
- **HTTP Requests:** Axios
- **Gráficos:** Victory Native o React-Native-SVG
- **UI:** React Native Paper

## 🛠 Instalación y configuración

## 1️⃣ Clonar el repositorio

git clone https://github.com/ramabeni94dev/Challenge-ReactNative.git

cd Challenge-ReactNative

## 2️⃣ Instalar dependencias

#### **Asegúrate de tener Node.js y Expo CLI instalados:**

npm install -g expo-cli

#### **Luego, instala las dependencias del proyecto:**

npm install

## 3️⃣ Configurar variables de entorno

#### Crea el archivo **.env** y coloca tu API Key y URL de Google PageSpeed Insights:

EXPO_PUBLIC_API_KEY= TU_EXPO_API_KEY

EXPO_PUBLIC_API_URL= TU_EXPO_API_URL

## 4️⃣ Ejecutar la app en modo desarrollo

expo start

## 📌 Funcionalidades de la app

### ✅ Pantalla Principal

Input para ingresar una URL.

Checkboxes para seleccionar las métricas a analizar.

Selector (Picker) para elegir la estrategia MOBILE o DESKTOP.

Botón para ejecutar análisis con la API de Google.

Gráficos para visualizar las métricas obtenidas.

Opción para guardar los resultados en la base de datos local.

### ✅ Pantalla de Historial

Lista de todos los análisis guardados.

Posibilidad de ver detalles o eliminar registros.
