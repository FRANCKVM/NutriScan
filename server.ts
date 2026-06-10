import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy-loaded GenAI client to avoid crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La variable de entorno GEMINI_API_KEY es requerida para el análisis con Inteligencia Artificial.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for analyzing ingredients using Gemini
  app.post("/api/analyze", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { ingredientsText, productName, healthConditions } = req.body;

      if (!ingredientsText) {
        res.status(400).json({ error: "Falta el texto de ingredientes o del producto a analizar." });
        return;
      }

      const activeConditions = Array.isArray(healthConditions) ? healthConditions : [];
      const ai = getGeminiClient();

      const userProfilePrompt = activeConditions.length > 0 
        ? `El usuario tiene las siguientes condiciones de salud/restricciones dietéticas: ${activeConditions.join(", ")}.`
        : `El usuario no tiene restricciones de salud marcadas.`;

      const prompt = `Analiza el siguiente producto o lista de ingredientes de un alimento disponible en el mercado peruano:
Producto/Texto a analizar: "${ingredientsText}" ${productName ? `(Nombre sugerido: ${productName})` : ''}

${userProfilePrompt}

Por favor, genera un análisis completo y estructurado en español latinoamericano. Traduce cualquier aditivo técnico (como Glutamato Monosódico, Tartrazina, Sucralosa, Aspartamo, Nitritos, Carragenina) a términos sencillos como exige la ley peruana e indica su nivel de riesgo:
- "Riesgo bajo" (seguro en dosis normales)
- "Consumo moderado" (limitar frecuencia)
- "Evitar en niños" (para colorantes como Tartrazina o edulcorantes artificiales perjudiciales)
- "Riesgo alto" (asociado a problemas de salud directos)

Define también cuántos octógonos oficiales de Perú le corresponden ("ALTO EN SODIO", "ALTO EN AZÚCAR", "ALTO EN GRASAS SATURADAS", "CONTIENE GRASAS TRANS") basándote en los ingredientes.

Genera alertas personalizadas altamente específicas para las condiciones del usuario (por ejemplo, si tiene Diabetes advierte si hay azúcares ocultos o alto impacto glucémico; si tiene Hipertensión, advierte sobre el sodio; si tiene intolerancia a la lactosa, gluten o alergias, revisa trazas).`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          productName: {
            type: Type.STRING,
            description: "Nombre comercial o genérico deducido para el producto alimenticio."
          },
          brand: {
            type: Type.STRING,
            description: "Marca del producto si se identifica, si no establecer vacío."
          },
          nutritionalSummary: {
            type: Type.STRING,
            description: "Resumen breve y directo de la calidad nutricional del producto."
          },
          processingLevel: {
            type: Type.STRING,
            description: "Nivel de procesamiento NOVA: 'NOVA 1 (Sin procesar / Mínimamente procesado)', 'NOVA 2 (Ingredientes culinarios procesados)', 'NOVA 3 (Alimentos procesados)', 'NOVA 4 (Productos ultraprocesados)'."
          },
          processingExplanation: {
            type: Type.STRING,
            description: "Explicación breve de por qué pertenece a esta categoría NOVA."
          },
          macronutrients: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.STRING, description: "Calorías aproximadas por porción o promedio (ej. '150 kcal')" },
              saturatedFat: { type: Type.STRING, description: "Grasas saturadas promedio (ej. '4.5 g' o '0 g')" },
              sugar: { type: Type.STRING, description: "Azúcares totales promedio (ej. '12 g' o '0 g')" },
              sodium: { type: Type.STRING, description: "Sodio promedio (ej. '350 mg' o '5 mg')" },
              protein: { type: Type.STRING, description: "Proteínas promedio" },
              carbohydrates: { type: Type.STRING, description: "Carbohidratos totales promedio" }
            },
            required: ["calories", "saturatedFat", "sugar", "sodium", "protein", "carbohydrates"]
          },
          octogons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Octógonos del sistema peruano aplicables. Ej: 'ALTO EN AZÚCAR', 'ALTO EN SODIO', 'ALTO EN GRASAS SATURADAS', 'CONTIENE GRASAS TRANS'."
          },
          additives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING, description: "Código o nombre técnico (ej: 'E-102 Tartrazina' o 'Glutamato Monosódico')" },
                purpose: { type: Type.STRING, description: "Función (ej: 'Colorante artificial', 'Potenciador del sabor')" },
                simplifiedRisk: { type: Type.STRING, description: "Valor strictly literal de: 'Riesgo bajo', 'Consumo moderado', 'Evitar en niños', 'Riesgo alto'" },
                explanation: { type: Type.STRING, description: "Explicación sencilla del riesgo del aditivo." }
              },
              required: ["code", "purpose", "simplifiedRisk", "explanation"]
            }
          },
          personalizedWarnings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING, description: "Condición relacionada (ej: 'Diabetes', 'Hipertensión', etc.)" },
                severity: { type: Type.STRING, description: "Severidad: 'danger', 'warning' o 'info'." },
                message: { type: Type.STRING, description: "Mensaje directo explicativo de la advertencia." }
              },
              required: ["condition", "severity", "message"]
            }
          },
          recommendation: {
            type: Type.STRING,
            description: "Recomendación o alternativa más saludable si es ultraprocesado."
          }
        },
        required: ["productName", "nutritionalSummary", "processingLevel", "processingExplanation", "macronutrients", "octogons", "additives", "personalizedWarnings", "recommendation"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Eres un experto en nutrición peruana y regulación de la Ley No. 30021 de Alimentación Saludable. Analizas ingredientes de alimentos con lenguaje claro, cercano, riguroso pero sin dramatizar, enfocado en empoderar al consumidor peruano.",
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.2
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No se recibió respuesta del modelo Gemini de AI.");
      }

      const cleanJson = JSON.parse(responseText.trim());
      res.json(cleanJson);
    } catch (error: any) {
      console.error("Error al procesar con Gemini:", error);
      res.status(500).json({ error: error?.message || "Ocurrió un error inesperado al analizar el producto alimenticio." });
    }
  });

  // Serve static UI assets with Vite or from static dist folder
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
