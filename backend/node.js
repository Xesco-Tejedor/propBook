// server.js

// Importar los módulos necesarios
const express = require('express');
const fetch = require('node-fetch'); // Para realizar solicitudes HTTP
const cors = require('cors'); // Para habilitar CORS (Cross-Origin Resource Sharing)

// Crear una instancia de la aplicación Express
const app = express();

// Middleware para parsear JSON en las solicitudes entrantes
app.use(express.json());

// Configuración de CORS
// Esto permite que tu frontend (que podría estar en un dominio diferente)
// se comunique con este backend. Para producción, es mejor restringir
// el origen a tu dominio de frontend específico.
app.use(cors()); // Permite todas las solicitudes de origen cruzado por defecto

// Cargar la clave API de OpenRouter desde las variables de entorno
// ¡IMPORTANTE! Asegúrate de que SK_OPENROUTER_API_KEY esté configurada en tu entorno de servidor.
const OPENROUTER_API_KEY = process.env.SK_OPENROUTER_API_KEY;

// Verificar si la clave API está configurada al iniciar
if (!OPENROUTER_API_KEY) {
    console.error("--------------------------------------------------------------------");
    console.error("ERROR FATAL: La variable de entorno SK_OPENROUTER_API_KEY no está configurada.");
    console.error("El backend no podrá comunicarse con la API de OpenRouter.");
    console.error("Asegúrate de configurar esta variable antes de iniciar el servidor.");
    console.error("Ejemplo: export SK_OPENROUTER_API_KEY='tu_clave_api_aqui'");
    console.error("--------------------------------------------------------------------");
    // Podrías optar por salir del proceso si la clave no está: process.exit(1);
    // Por ahora, solo mostraremos una advertencia clara.
}

// Definir el endpoint para generar texto
app.post('/api/generar-texto', async (req, res) => {
    // Extraer los datos del cuerpo de la solicitud
    const { tema, pagina, modeloDeseado } = req.body;

    // Registrar la solicitud recibida (útil para depuración)
    console.log(`[${new Date().toISOString()}] Solicitud recibida en /api/generar-texto:`);
    console.log(`  Tema: ${tema}`);
    console.log(`  Página: ${pagina}`);
    console.log(`  Modelo Deseado: ${modeloDeseado}`);

    // Validar que el tema esté presente
    if (!tema) {
        return res.status(400).json({ error: "El parámetro 'tema' es requerido." });
    }

    // Validar que la clave API de OpenRouter esté disponible
    if (!OPENROUTER_API_KEY) {
        console.error("Error: SK_OPENROUTER_API_KEY no está configurada en el servidor.");
        return res.status(500).json({ error: "Error de configuración del servidor: la clave API para el servicio de IA no está disponible." });
    }

    // Usar el modelo deseado o un modelo por defecto si no se especifica
    const modeloFinal = modeloDeseado || "microsoft/phi-3-mini-128k-instruct"; // Modelo por defecto

    try {
        console.log(`Enviando solicitud a OpenRouter con el modelo: ${modeloFinal}`);

        // Realizar la solicitud a la API de OpenRouter
        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                // Opcional: OpenRouter recomienda estas cabeceras para identificar tu aplicación
                // Reemplaza "TU_SITIO_WEB" y "Generador Libro Ilustrado" con tus propios valores
                // "HTTP-Referer": "https://tu-sitio-web.com", // Ejemplo
                // "X-Title": "Mi Aplicacion con OpenRouter", // Ejemplo
            },
            body: JSON.stringify({
                "model": modeloFinal,
                "messages": [
                    {
                        "role": "system",
                        "content": "Eres un asistente creativo especializado en escribir contenido conciso y evocador para libros ilustrados interactivos. Tus respuestas deben ser adecuadas para acompañar ilustraciones y capturar la imaginación del lector."
                    },
                    {
                        "role": "user",
                        "content": `Escribe un párrafo corto (idealmente entre 3 y 5 frases) y evocador sobre el tema "${tema}" para la página ${pagina} de un libro ilustrado interactivo. El tono debe ser inspirador y adecuado para todas las edades.`
                    }
                ],
                // Puedes añadir otros parámetros soportados por OpenRouter y el modelo específico si es necesario
                // "max_tokens": 150, // Límite de tokens para la respuesta
                // "temperature": 0.7, // Creatividad de la respuesta (0.0 a 2.0)
                // "top_p": 1,
                // "stream": false, // Poner a true si quieres manejar respuestas en streaming
            })
        });

        // Verificar si la respuesta de OpenRouter fue exitosa
        if (!openRouterResponse.ok) {
            const errorText = await openRouterResponse.text(); // Obtener el cuerpo del error como texto
            let errorJson = null;
            try {
                errorJson = JSON.parse(errorText); // Intentar parsear como JSON
            } catch (e) {
                // Si no es JSON, usar el texto plano
                console.warn("La respuesta de error de OpenRouter no era JSON:", errorText);
            }
            console.error(`Error desde OpenRouter API (${openRouterResponse.status} ${openRouterResponse.statusText}):`, errorJson || errorText);
            return res.status(openRouterResponse.status).json({
                error: "Error al comunicarse con la API de OpenRouter.",
                details: errorJson || errorText // Enviar detalles del error al cliente
            });
        }

        // Parsear la respuesta JSON de OpenRouter
        const data = await openRouterResponse.json();

        // Extraer el texto generado de la respuesta
        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            const textoGenerado = data.choices[0].message.content.trim();
            console.log(`Texto generado exitosamente para "${tema}", página ${pagina}.`);
            // Enviar el texto generado de vuelta al cliente
            res.json({ textoGenerado });
        } else {
            console.error("Respuesta inesperada de OpenRouter (formato no reconocido):", data);
            res.status(500).json({ error: "La respuesta de la API de OpenRouter no tuvo el formato esperado o no contenía texto." });
        }

    } catch (error) {
        console.error("Error interno del servidor al procesar la solicitud /api/generar-texto:", error);
        res.status(500).json({
            error: "Error interno del servidor al generar texto.",
            details: error.message // Enviar mensaje de error para depuración
        });
    }
});

// Definir el puerto en el que escuchará el servidor
// Usar el puerto definido en la variable de entorno PORT (común en plataformas de despliegue) o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    if (!OPENROUTER_API_KEY) {
        console.warn("--------------------------------------------------------------------");
        console.warn("ADVERTENCIA: SK_OPENROUTER_API_KEY no está configurada.");
        console.warn("Las llamadas a la API de OpenRouter fallarán hasta que se configure.");
        console.warn("--------------------------------------------------------------------");
    } else {
        console.log("SK_OPENROUTER_API_KEY encontrada. El backend está listo para comunicarse con OpenRouter.");
    }
});
