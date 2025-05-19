Instrucciones para Configurar y Ejecutar el Backend
Crear un Directorio para tu Backend:mkdir mi-backend-ilustrado
cd mi-backend-ilustrado
Guardar el Código:Guarda el código JavaScript anterior en un archivo llamado server.js dentro del directorio mi-backend-ilustrado.Crear package.json:Este archivo define las dependencias de tu proyecto. Crea un archivo llamado package.json en el mismo directorio con el siguiente contenido:{
  "name": "backend-libro-ilustrado",
  "version": "1.0.0",
  "description": "Backend para generar texto para un libro ilustrado usando OpenRouter.",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "nodejs",
    "express",
    "openrouter",
    "ai"
  ],
  "author": "Tu Nombre",
  "license": "ISC",
  "dependencies": {
    "express": "^4.19.2",
    "node-fetch": "^2.7.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
Nota sobre node-fetch: La versión ^2.7.0 es para CommonJS. Si estás trabajando con ES Modules (usando import ... from ...), podrías usar node-fetch versión 3.x y ajustar la importación en server.js a import fetch from 'node-fetch';. El server.js proporcionado usa require, por lo que la v2 es adecuada.nodemon: Es una utilidad que reinicia automáticamente el servidor cuando detecta cambios en los archivos, muy útil para desarrollo. Es opcional pero recomendable.Instalar Dependencias:Abre tu terminal en el directorio mi-backend-ilustrado y ejecuta:npm install
Esto instalará express, node-fetch, cors y nodemon (como dependencia de desarrollo).Configurar la Variable de Entorno SK_OPENROUTER_API_KEY:Esta es la parte más importante para que el backend pueda autenticarse con OpenRouter.En desarrollo local:Puedes configurarla directamente en tu terminal antes de iniciar el servidor:# En Linux/macOS
export SK_OPENROUTER_API_KEY="tu_clave_secreta_de_openrouter_aqui"

# En Windows (PowerShell)
$env:SK_OPENROUTER_API_KEY="tu_clave_secreta_de_openrouter_aqui"

# En Windows (CMD)
set SK_OPENROUTER_API_KEY="tu_clave_secreta_de_openrouter_aqui"
Reemplaza "tu_clave_secreta_de_openrouter_aqui" con tu clave API real de OpenRouter.Alternativamente, puedes usar un archivo .env con una librería como dotenv para cargar variables de entorno (más seguro y práctico para desarrollo). Si decides usar dotenv:Instálalo: npm install dotenvCrea un archivo .env en la raíz de tu proyecto backend:SK_OPENROUTER_API_KEY="tu_clave_secreta_de_openrouter_aqui"
Añade require('dotenv').config(); al principio de tu server.js.Importante: Añade .env a tu archivo .gitignore para no subir tus claves a repositorios.En producción (Heroku, Vercel, AWS, etc.):Cada plataforma de despliegue tiene su propia forma de configurar variables de entorno. Consulta la documentación de tu proveedor de hosting. Generalmente, hay una sección en el panel de control de tu aplicación para "Environment Variables", "Config Vars", o similar.Ejecutar el Backend:Para desarrollo (con reinicio automático si instalaste nodemon):npm run dev
Para producción o si no usas nodemon:npm start
Deberías ver un mensaje en la consola indicando que el servidor está escuchando en http://localhost:3000 (o el puerto que hayas configurado).Probar la Integración:Asegúrate de que tu frontend (el archivo HTML que proporcionaste) esté configurado para enviar solicitudes a la URL correcta de tu backend.Si ejecutas el backend localmente, la URL para el frontend será http://localhost:3000/api/generar-texto.Si despliegas el backend en una plataforma, la URL será la que te proporcione esa plataforma (ej., https://tu-app.herokuapp.com/api/generar-texto o https://tu-app.vercel.app/api/generar-texto).En el archivo HTML, la línea:const endpointBackend = '/api/generar-texto';
funcionará si el frontend se sirve desde el mismo dominio y puerto que el backend, o si usas un proxy. Si están en dominios diferentes (lo más común si el frontend es un archivo HTML estático y el backend está en Heroku/Vercel), deberás usar la URL completa:const endpointBackend = 'http://localhost:3000/api/generar-texto'; // Para pruebas locales
// const endpointBackend = 'https://tu-backend-desplegado.com/api/generar-texto'; // Para producción
La configuración app.use(cors()); en el backend permite solicitudes desde cualquier origen, lo que debería ser suficiente para las pruebas. Para producción, considera restringir los orígenes permitidos:// Ejemplo de configuración CORS más restrictiva:
// const corsOptions = {
//   origin: 'https://tu-dominio-frontend.com', // Reemplaza con el dominio de tu frontend
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
DespliegueUna vez que tu backend funcione localmente, puedes desplegarlo en plataformas como:Heroku: Ofrece un plan gratuito. Necesitarás un Procfile (ej. web: npm start) y configurar tus variables de entorno en el dashboard de Heroku.Vercel: Excelente para aplicaciones Node.js. Se integra bien con repositorios Git. Configura las variables de entorno en la configuración del proyecto.AWS (EC2, Elastic Beanstalk, Lambda): Más potente pero también más complejo de configurar.Google Cloud Platform (App Engine, Cloud Run): Similar a AWS en cuanto a opciones.Render, Railway, Fly.io: Alternativas modernas a Heroku.Cada plataforma tiene su propia guía de despliegue para aplicaciones Node.js. El punto clave será siempre configurar la variable de entorno SK_OPENROUTER_API_KEY de forma segura.Con esto, tu backend debería estar listo para recibir solicitudes del frontend y generar texto utilizando OpenRouter.