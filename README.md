# LatamChat

Aplicación de chat para Latinoamérica desarrollada con React Native y Expo.

## Requisitos Previos

1. **Node.js y npm**
   - Instalar Node.js (versión 16 o superior) desde [https://nodejs.org/](https://nodejs.org/)

2. **JDK (Java Development Kit)**
   - Instalar JDK 17 o superior
   - Se recomienda Amazon Corretto JDK: [https://aws.amazon.com/es/corretto/](https://aws.amazon.com/es/corretto/)
   - Configurar la variable de entorno JAVA_HOME:
     ```
     JAVA_HOME = C:\Program Files\Amazon Corretto\jdk17.0.x_x
     ```
   - Agregar al PATH: %JAVA_HOME%\bin

3. **Android Studio y Android SDK**
   - Descargar e instalar Android Studio desde [https://developer.android.com/studio](https://developer.android.com/studio)
   - Durante la instalación, asegurarse de instalar:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device
   - Configurar la variable de entorno ANDROID_HOME:
     ```
     ANDROID_HOME = C:\Users\USERNAME\AppData\Local\Android\Sdk
     ```
   - Agregar al PATH:
     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\emulator
     %ANDROID_HOME%\tools
     %ANDROID_HOME%\tools\bin
     ```

4. **Expo CLI**
   - Instalar globalmente:
     ```bash
     npm install -g expo-cli
     ```

## Configuración del Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/atomixon49/YOU-CHAT.git
   cd YOU-CHAT
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copiar el archivo `.env.example` y renombrarlo a `.env`
   - Configurar las siguientes variables en el archivo `.env`:
     ```
     # Supabase credentials
     SUPABASE_URL=https://fdtckwjxsnlwiyphqbww.supabase.co
     SUPABASE_ANON_KEY=tu_anon_key_de_supabase

     # Twilio credentials
     TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio
     TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
     ```

4. **Configurar Supabase**
   - Acceder a [https://supabase.com/](https://supabase.com/)
   - Crear una nueva cuenta o iniciar sesión
   - Crear un nuevo proyecto
   - Copiar y ejecutar el contenido del archivo `src/config/database.sql` en el SQL Editor de Supabase

5. **Configurar Twilio**
   - Acceder a [https://www.twilio.com/](https://www.twilio.com/)
   - Crear una cuenta o iniciar sesión
   - Obtener las credenciales (Account SID y Auth Token)
   - En modo de prueba, verificar los números de teléfono que se usarán para testing

## Ejecutar el Proyecto

1. **Iniciar Android Studio y el emulador**
   - Abrir Android Studio
   - Ir a Tools > Device Manager
   - Crear un nuevo dispositivo virtual o usar uno existente
   - Iniciar el emulador

2. **Iniciar la aplicación**
   ```bash
   npx expo run:android
   ```

## Solución de Problemas Comunes

1. **Error de JAVA_HOME**
   - Verificar que la variable de entorno JAVA_HOME esté correctamente configurada
   - Asegurarse de que la ruta del JDK sea correcta

2. **Error de Android SDK**
   - Verificar que ANDROID_HOME apunte a la ubicación correcta del SDK
   - Asegurarse de tener instaladas las herramientas de línea de comandos de Android

3. **Error de Gradle**
   - Limpiar la caché de Gradle:
     ```bash
     cd android
     ./gradlew clean
     cd ..
     ```

4. **Error de Metro Bundler**
   - Limpiar la caché de Metro:
     ```bash
     npx expo start --clear
     ```

## Desarrollo

- La aplicación usa TypeScript para un mejor desarrollo
- Se utiliza Supabase como backend para la base de datos y autenticación
- Twilio se usa para el envío de SMS de verificación
- La estructura del proyecto sigue una arquitectura modular por características

## Características Principales

- Autenticación por número de teléfono
- Verificación por SMS
- Chat en tiempo real
- Mensajes individuales y grupales
- Lista de contactos
- Perfil de usuario personalizable

## Notas Importantes

- En modo de desarrollo, Twilio solo permite enviar SMS a números verificados
- Las credenciales de Supabase y Twilio no deben compartirse ni subirse al repositorio
- Se recomienda usar Node.js LTS para mayor estabilidad