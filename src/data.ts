import { HealthCondition, ProductPreset } from './types';

export const HEALTH_CONDITIONS: HealthCondition[] = [
  {
    id: 'diabetes',
    label: 'Diabetes / Control Glucémico',
    iconName: 'Droplet',
    description: 'Alertar sobre azúcares, edulcorantes artificiales e índice glucémico elevado.'
  },
  {
    id: 'hypertension',
    label: 'Hipertensión Arterial',
    iconName: 'Activity',
    description: 'Control riguroso de sodio y alimentos con octógono \"ALTO EN SODIO\".'
  },
  {
    id: 'pregnancy',
    label: 'Embarazo',
    iconName: 'HeartHandshake',
    description: 'Filtrar exceso de cafeína, edulcorantes dudosos, aditivos y bacterias.'
  },
  {
    id: 'celiac',
    label: 'Alergia al Gluten / Celíaco',
    iconName: 'Wheat',
    description: 'Detectar presencia de gluten, trigo, cebada, centeno y trazas.'
  },
  {
    id: 'lactose',
    label: 'Intolerancia a la Lactosa',
    iconName: 'Milk',
    description: 'Identificar ingredientes lácteos directos o derivados de la leche.'
  },
  {
    id: 'vegan',
    label: 'Estilo Vegano',
    iconName: 'Leaf',
    description: 'Identificar ingredientes de origen animal (gelatina, carmín, lácteos, huevo).'
  },
  {
    id: 'child',
    label: 'Nutrición Infantil / Menores',
    iconName: 'Smile',
    description: 'Evitar edulcorantes químicos y colorantes que causen hiperactividad infantil.'
  },
  {
    id: 'athlete',
    label: 'Rendimiento Deportivo / Atleta',
    iconName: 'TrendingUp',
    description: 'Priorizar proteínas de calidad, macronutrientes balanceados y evitar excesos calóricos.'
  }
];

export const PRODUCT_PRESETS: ProductPreset[] = [
  {
    id: 'incakola',
    name: 'Gaseosa Inca Kola Original',
    brand: 'The Coca-Cola Company / Lindley',
    category: 'Bebidas',
    image: 'incakola',
    description: 'Bebida gasificada de sabor único tradicional de la mesa peruana.',
    ingredientsText: 'Agua carbonatada, azúcar, acidulante (ácido cítrico), conservador (benzoato de sodio), cafeína, colorante artificial (tartrazina - E102) y aromatizantes.',
    mockResult: {
      productName: 'Inca Kola Original (350ml)',
      brand: 'Lindley / Coca-Cola',
      nutritionalSummary: 'Bebida carbonatada de alto contenido de azúcar que aporta calorías vacías sin valor nutricional, complementada con aditivos sintéticos bajo estricto control.',
      processingLevel: 'NOVA 4 (Productos ultraprocesados)',
      processingExplanation: 'Contiene puramente azúcares refinados disueltos en agua carbonatada con colorantes color amarillo artificial y conservantes sintéticos.',
      macronutrients: {
        calories: '143 kcal',
        saturatedFat: '0 g',
        sugar: '36 g',
        sodium: '40 mg',
        protein: '0 g',
        carbohydrates: '36 g'
      },
      octogons: ['ALTO EN AZÚCAR'],
      additives: [
        {
          code: 'E-102 (Tartrazina)',
          purpose: 'Colorante sintético (Amarillo)',
          simplifiedRisk: 'Evitar en niños',
          explanation: 'Asociado con hiperactividad en niños, reacciones alérgicas y asma.'
        },
        {
          code: 'E-211 (Benzoato de Sodio)',
          purpose: 'Conservador químico',
          simplifiedRisk: 'Consumo moderado',
          explanation: 'Ayuda a prevenir el crecimiento microbiano; en dosis excesivas o mezclado con vitamina C puede generar benceno.'
        },
        {
          code: 'Cafeína',
          purpose: 'Estimulante y aromatizante',
          simplifiedRisk: 'Consumo moderado',
          explanation: 'Estimulante del sistema nervioso central. No aconsejable en niños pequeños ni gestantes sensibles.'
        }
      ],
      personalizedWarnings: [
        {
          condition: 'Diabetes',
          severity: 'danger',
          message: '¡Peligro! Contiene 36g de azúcar por porción, lo cual provocará un incremento glucémico agudo inmediato. Contraindicado.'
        },
        {
          condition: 'Nutrición Infantil',
          severity: 'danger',
          message: 'Posee Tartrazina y cafeína. Por ley peruana requiere advertencia especial: \"Evitar su consumo en niños\".'
        },
        {
          condition: 'Atleta',
          severity: 'warning',
          message: 'Calorías vacías de absorción ultra veloz sin densidad de nutrientes, incompatible con balance energético óptimo.'
        }
      ],
      recommendation: 'Sustituye por agua mineral con gas con unas rodajas de limón fresco, refresco de chicha morada natural sin azúcar refinada o infusiones frías.'
    }
  },
  {
    id: 'sublime',
    name: 'Chocolatina Sublime Clásico',
    brand: 'Nestlé Perú',
    category: 'Snacks',
    image: 'chocolate',
    description: 'Chocolate con leche con trozos de maní, insignia del paladar peruano.',
    ingredientsText: 'Azúcar, manteca de cacao, pasta de cacao, maní tostado (12%), leche entera en polvo, suero de leche, grasa vegetal, emulsionante (lecitina de soya - E322, polirricinoleato de poliglicerol - E476) y saborizante artificial (vainillina).',
    mockResult: {
      productName: 'Chocolate Sublime Clásico',
      brand: 'Nestlé Perú',
      nutritionalSummary: 'Golosina a base de grasa vegetal, cacao y maní tostado con altos valores calóricos y azúcares.',
      processingLevel: 'NOVA 4 (Productos ultraprocesados)',
      processingExplanation: 'Contiene ingredientes refinados, azúcares añadidos artificialmente, grasas hidrogenadas fraccionadas y emulsionantes industriales.',
      macronutrients: {
        calories: '162 kcal',
        saturatedFat: '5.8 g',
        sugar: '14.5 g',
        sodium: '28 mg',
        protein: '2.5 g',
        carbohydrates: '17 g'
      },
      octogons: ['ALTO EN AZÚCAR', 'ALTO EN GRASAS SATURADAS'],
      additives: [
        {
          code: 'E-322 (Lecitina de Soya)',
          purpose: 'Emulsionante natural',
          simplifiedRisk: 'Riesgo bajo',
          explanation: 'Emulsionante seguro derivado de la soya que mejora la textura de fundido del chocolate.'
        },
        {
          code: 'E-476 (Polirricinoleato de Poliglicerol)',
          purpose: 'Emulsionante y espesante',
          simplifiedRisk: 'Consumo moderado',
          explanation: 'Se utiliza para reducir la cantidad de manteca de cacao cara. Con exceso puede provocar malestares estomacales.'
        }
      ],
      personalizedWarnings: [
        {
          condition: 'Diabetes',
          severity: 'danger',
          message: 'Contiene alta cantidad de azúcar añadida e índice glucémico rápido. Afecta severamente los niveles de glucosa.'
        },
        {
          condition: 'Lactose Intolerance',
          severity: 'warning',
          message: 'Contiene leche entera en polvo y suero de leche. Puede desencadenar síntomas en personas con intolerancia severa.'
        },
        {
          condition: 'Hipertensión',
          severity: 'info',
          message: 'Su nivel de sodio es bajo (28mg), pero es alto en grasas saturadas, lo que a largo plazo complica el perfil cardiovascular.'
        }
      ],
      recommendation: 'Elige tabletas de chocolate peruano oscuro (dark) con un porcentaje de cacao igual o mayor a 70% sin azúcares añadidos.'
    }
  },
  {
    id: 'sodafield',
    name: 'Galletas de Soda Field',
    brand: 'Mondelēz Perú',
    category: 'Snacks',
    image: 'soda',
    description: 'La mítica e icónica galleta salada del Perú, crocante y tradicional.',
    ingredientsText: 'Harina de trigo enriquecida con hierro y vitaminas, grasa de palma, jarabe de azúcar invertido, sal, gasificantes (bicarbonato de amonio, bicarbonato de sodio), levadura y emulsionante (lecitina de soya).',
    mockResult: {
      productName: 'Galletas de Soda Field',
      brand: 'Mondelēz Perú',
      nutritionalSummary: 'Galletas saladas horneadas hechas principalmente con harina de trigo blanca refinada y elevado contenido de sal gruesa.',
      processingLevel: 'NOVA 3 (Alimentos procesados)',
      processingExplanation: 'Contiene harinas refinadas combinadas con grasas industriales y sal procesada para mejorar la conservación y palatabilidad.',
      macronutrients: {
        calories: '135 kcal',
        saturatedFat: '2.5 g',
        sugar: '1.2 g',
        sodium: '310 mg',
        protein: '2.8 g',
        carbohydrates: '24 g'
      },
      octogons: ['ALTO EN SODIO'],
      additives: [
        {
          code: 'E-500ii (Bicarbonato de Sodio)',
          purpose: 'Gasificante natural',
          simplifiedRisk: 'Riesgo bajo',
          explanation: 'Compuesto mineral completamente inofensivo que reacciona con la humedad para inflar la galleta.'
        },
        {
          code: 'E-503ii (Bicarbonato de Amonio)',
          purpose: 'Agente leudante',
          simplifiedRisk: 'Riesgo bajo',
          explanation: 'Seguro en panadería. Se evapora totalmente previo al consumo dejando una textura porosa.'
        }
      ],
      personalizedWarnings: [
        {
          condition: 'Hipertensión',
          severity: 'danger',
          message: '¡Advertencia crítica! Supera los límites recomendados de sodio diarios por empaque (310mg). Eleva la presión arterial.'
        },
        {
          condition: 'Alergia al Gluten',
          severity: 'danger',
          message: '¡Contiene Trigo! Contiene gluten de forma directa en su composición. Absolutamente prohibido para celíacos.'
        }
      ],
      recommendation: 'Elige galletas de arroz inflado integral, totopos horneados de maíz andino o galletas de avena 100% caseras libres de gluten y sal añadida.'
    }
  },
  {
    id: 'gloriaazul',
    name: 'Leche Evaporada Gloria Azul',
    brand: 'Grupo Gloria Perú',
    category: 'Lácteos',
    image: 'leche',
    description: 'La leche evaporada de etiqueta azul indispensable en los desayunos peruanos.',
    ingredientsText: 'Leche entera de vaca, estabilizadores (ortofosfato disódico, carregenina - E407), vitaminas A, C y D.',
    mockResult: {
      productName: 'Leche Evaporada Gloria Azul',
      brand: 'Grupo Gloria Perú',
      nutritionalSummary: 'Leche de vaca sometida a evaporación y enriquecida con vitaminas. Contiene un aditivo estabilizante discutido.',
      processingLevel: 'NOVA 3 (Alimentos procesados)',
      processingExplanation: 'Sometido a pasteurización y proceso tecnológico de deshidratación parcial, con aditivos de estabilización física mineral.',
      macronutrients: {
        calories: '110 kcal',
        saturatedFat: '3.8 g',
        sugar: '7.8 g',
        sodium: '115 mg',
        protein: '6.2 g',
        carbohydrates: '9.0 g'
      },
      octogons: [],
      additives: [
        {
          code: 'E-407 (Carragenina)',
          purpose: 'Estabilizante y espesante',
          simplifiedRisk: 'Consumo moderado',
          explanation: 'Extraído de algas rojas. En algunos estudios médicos se ha correlacionado con inflamación intestinal leve y síndrome de colon irritable.'
        },
        {
          code: 'E-339 (Ortofosfato Disódico)',
          purpose: 'Estabilizante y regulador',
          simplifiedRisk: 'Riesgo bajo',
          explanation: 'Controla el pH y evita que la proteína de la leche se corte durante el tratamiento de alta temperatura.'
        }
      ],
      personalizedWarnings: [
        {
          condition: 'Intolerancia a la Lactosa',
          severity: 'danger',
          message: '¡Advertencia de Lactosa! Producto lácteo entero, contiene altos niveles de azúcar lactosa natural. Causará dolor estomacal e hinchazón severa.'
        },
        {
          condition: 'Atleta',
          severity: 'info',
          message: 'Excelente aporte proteico (6.2g) por vaso y calcio biodisponible para la regeneración ósea y muscular.'
        }
      ],
      recommendation: 'Sustituye por leche evaporada Sin Lactosa, o bebidas vegetales fortificadas de almendra, quinua o soya orgánica para evitar inflamación.'
    }
  },
  {
    id: 'papitaslays',
    name: 'Papitas Hojuelas Clásicas Lays',
    brand: 'PepsiCo Perú',
    category: 'Snacks',
    image: 'lays',
    description: 'Papas peruanas seleccionadas, cortadas en finas hojuelas y un toque de sal.',
    ingredientsText: 'Papas peruanas seleccionadas, aceite vegetal de girasol refinado y sal de mesa.',
    mockResult: {
      productName: 'Papas Hojuelas Lays Clásicas',
      brand: 'PepsiCo / Snacks América Latina',
      nutritionalSummary: 'Tubérculo frito en grasa industrial con alta concentración de sal y densidad calórica extrema.',
      processingLevel: 'NOVA 3 (Alimentos procesados)',
      processingExplanation: 'Proceso de fritura profunda industrial donde un alimento natural absorbe elevadas cantidades de grasa y sal añadida.',
      macronutrients: {
        calories: '160 kcal',
        saturatedFat: '4.5 g',
        sugar: '0.1 g',
        sodium: '260 mg',
        protein: '2.0 g',
        carbohydrates: '15 g'
      },
      octogons: ['ALTO EN SODIO', 'ALTO EN GRASAS SATURADAS'],
      additives: [],
      personalizedWarnings: [
        {
          condition: 'Hipertensión',
          severity: 'danger',
          message: 'Contiene una carga concentrada de sodio frito. Aumenta la hipertensión sistólica súbitamente y retiene líquidos corporales.'
        },
        {
          condition: 'Atleta',
          severity: 'warning',
          message: 'Altamente calórico, rico en grasas saturadas inflamatorias que reducen la salud vascular y el transporte idóneo de oxígeno.'
        }
      ],
      recommendation: 'Prepara papas peruanas nativas horneadas (en freidora de aire) condimentadas con finas hierbas y una pizca marginal de sal marina o sal de Maras.'
    }
  }
];

// Additive glossary lists typical additive chemicals from Peruvian labels and simple explanations
export interface GlossaryAdditive {
  name: string;
  code: string;
  risk: 'Riesgo bajo' | 'Consumo moderado' | 'Evitar en niños' | 'Riesgo alto';
  purpose: string;
  explanation: string;
  alternatives: string;
}

export const ADDITIVE_GLOSSARY: GlossaryAdditive[] = [
  {
    name: 'Tartrazina',
    code: 'E-102',
    risk: 'Evitar en niños',
    purpose: 'Colorante artificial amarillo',
    explanation: 'Produce hiperactividad infantil severa e histaminosis artificial (alergias de piel, rinitis o asma). Prohibido o restringido en múltiples países.',
    alternatives: 'Cúrcuma natural, extracto de achiote o betacarotenos naturales.'
  },
  {
    name: 'Carragenina',
    code: 'E-407',
    risk: 'Consumo moderado',
    purpose: 'Gelificante y espesante lácteo',
    explanation: 'Utilizado en leches industrializadas y embutidos para dar textura cremosa. Puede producir micro-abrasiones e inflamación crónica en los intestinos.',
    alternatives: 'Goma guar, goma xantana o pectina natural.'
  },
  {
    name: 'Glutamato Monosódico',
    code: 'E-621',
    risk: 'Riesgo alto',
    purpose: 'Potenciador de sabor (Umami)',
    explanation: 'Engaña a los receptores neuronales del cerebro induciendo antojo insaciable. Relacionado con dolor de cabeza persistente y el \'Síndrome del restaurante chino\'.',
    alternatives: 'Sal marina, ajo en polvo, levadura nutricional, champiñones secos o especias.'
  },
  {
    name: 'Sucralosa',
    code: 'E-955',
    risk: 'Evitar en niños',
    purpose: 'Edulcorante artificial hiper-dulce',
    explanation: 'Sustituto de azúcar que altera la microbiota intestinal del organismo e induce picos secundarios de insulina sutiles. No recomendada en menores de edad.',
    alternatives: 'Fruta del monje pura (Monk Fruit), estevia de hoja verde o canela.'
  },
  {
    name: 'Benzoato de Sodio',
    code: 'E-211',
    risk: 'Consumo moderado',
    purpose: 'Conservante antifúngico',
    explanation: 'Previene moho en jugos y gaseosas. Si entra en contacto con ácido ascórbico (Vitamina C), puede formar benceno, una toxina cancerígena potencial.',
    alternatives: 'Sorbato de potasio, pasteurización física, ácido cítrico natural.'
  },
  {
    name: 'Carmín de Cochinilla',
    code: 'E-120',
    risk: 'Consumo moderado',
    purpose: 'Colorante natural rojo vivo',
    explanation: 'Se extrae triturando insectos (cochinillas). Es seguro para la salud, pero causa reacciones alérgicas asmáticas en personas hipersensibles y no es apto para veganos.',
    alternatives: 'Jugo concentrado de betarraga (remolacha) orgánico.'
  },
  {
    name: 'Aspartamo / Aspartame',
    code: 'E-951',
    risk: 'Riesgo alto',
    purpose: 'Edulcorante sintético artificial',
    explanation: 'Posible carcinógeno según la OMS. Causa migrañas intensas, alteraciones cognitivas en personas sensibles y cambios metabólicos negativos.',
    alternatives: 'Edulcorantes naturales o simplemente educar el paladar a comer sin dulce añadido.'
  },
  {
    name: 'Amaranto / Rojo No. 2',
    code: 'E-123',
    risk: 'Riesgo alto',
    purpose: 'Colorante rojo oscuro sintético',
    explanation: 'Colorante azoico derivado del alquitrán de hulla. Altamente alergénico, potencialmente tóxico y prohibido en EUA y Rusia por riesgos tumorales.',
    alternatives: 'Colorantes de frutas orgánicas naturales.'
  }
];
