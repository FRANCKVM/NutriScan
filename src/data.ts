import { HealthCondition } from './types';

export const HEALTH_CONDITIONS: HealthCondition[] = [
  {
    id: 'diabetes',
    label: 'Diabetes / Control glucemico',
    iconName: 'Droplet',
    description: 'Alertar sobre azucares, edulcorantes artificiales e indice glucemico elevado.'
  },
  {
    id: 'hypertension',
    label: 'Hipertension arterial',
    iconName: 'Activity',
    description: 'Control riguroso de sodio y alimentos con octogono ALTO EN SODIO.'
  },
  {
    id: 'pregnancy',
    label: 'Embarazo',
    iconName: 'HeartHandshake',
    description: 'Filtrar exceso de cafeina, edulcorantes dudosos, aditivos y bacterias.'
  },
  {
    id: 'celiac',
    label: 'Alergia al gluten / celiaco',
    iconName: 'Wheat',
    description: 'Detectar presencia de gluten, trigo, cebada, centeno y trazas.'
  },
  {
    id: 'lactose',
    label: 'Intolerancia a la lactosa',
    iconName: 'Milk',
    description: 'Identificar ingredientes lacteos directos o derivados de la leche.'
  },
  {
    id: 'vegan',
    label: 'Estilo vegano',
    iconName: 'Leaf',
    description: 'Identificar ingredientes de origen animal como gelatina, carmin, lacteos o huevo.'
  },
  {
    id: 'child',
    label: 'Nutricion infantil / menores',
    iconName: 'Smile',
    description: 'Evitar edulcorantes quimicos y colorantes sensibles para poblacion infantil.'
  },
  {
    id: 'athlete',
    label: 'Rendimiento deportivo / atleta',
    iconName: 'TrendingUp',
    description: 'Priorizar proteinas de calidad, macronutrientes balanceados y evitar excesos caloricos.'
  }
];

// Additive glossary lists typical additive chemicals from Peruvian labels and simple explanations.
export interface GlossaryAdditive {
  name: string;
  code: string;
  risk: 'Riesgo bajo' | 'Consumo moderado' | 'Evitar en ninos' | 'Riesgo alto';
  purpose: string;
  explanation: string;
  alternatives: string;
}

export const ADDITIVE_GLOSSARY: GlossaryAdditive[] = [
  {
    name: 'Tartrazina',
    code: 'E-102',
    risk: 'Evitar en ninos',
    purpose: 'Colorante artificial amarillo',
    explanation: 'Puede asociarse a reacciones de sensibilidad en algunas personas. Se recomienda limitarla en ninos.',
    alternatives: 'Curcuma natural, extracto de achiote o betacarotenos naturales.'
  },
  {
    name: 'Carragenina',
    code: 'E-407',
    risk: 'Consumo moderado',
    purpose: 'Gelificante y espesante lacteo',
    explanation: 'Se usa para dar textura cremosa. En personas sensibles puede relacionarse con molestias digestivas.',
    alternatives: 'Goma guar, goma xantana o pectina natural.'
  },
  {
    name: 'Glutamato monosodico',
    code: 'E-621',
    risk: 'Riesgo alto',
    purpose: 'Potenciador de sabor umami',
    explanation: 'Puede favorecer consumo excesivo por intensificar el sabor. Algunas personas reportan sensibilidad.',
    alternatives: 'Sal marina, ajo en polvo, levadura nutricional, hongos secos o especias.'
  },
  {
    name: 'Sucralosa',
    code: 'E-955',
    risk: 'Evitar en ninos',
    purpose: 'Edulcorante artificial',
    explanation: 'Endulzante intenso sin azucar. Conviene moderarlo, especialmente en menores.',
    alternatives: 'Estevia de hoja verde, canela o reduccion gradual del dulzor.'
  },
  {
    name: 'Benzoato de sodio',
    code: 'E-211',
    risk: 'Consumo moderado',
    purpose: 'Conservante antifungico',
    explanation: 'Previene moho en bebidas y productos acidos. Es mejor evitar consumo frecuente de ultraprocesados que lo incluyan.',
    alternatives: 'Sorbato de potasio, pasteurizacion fisica o acido citrico natural.'
  },
  {
    name: 'Carmin de cochinilla',
    code: 'E-120',
    risk: 'Consumo moderado',
    purpose: 'Colorante natural rojo',
    explanation: 'Colorante de origen animal. Puede causar sensibilidad en algunas personas y no es apto para veganos.',
    alternatives: 'Jugo concentrado de betarraga.'
  },
  {
    name: 'Aspartamo',
    code: 'E-951',
    risk: 'Riesgo alto',
    purpose: 'Edulcorante artificial',
    explanation: 'Edulcorante intenso que debe evitarse en personas con fenilcetonuria y moderarse en consumo general.',
    alternatives: 'Edulcorantes naturales o alimentos menos dulces.'
  },
  {
    name: 'Amaranto / Rojo No. 2',
    code: 'E-123',
    risk: 'Riesgo alto',
    purpose: 'Colorante rojo sintetico',
    explanation: 'Colorante azoico con restricciones en algunos mercados. Conviene priorizar colorantes naturales.',
    alternatives: 'Colorantes de frutas o vegetales.'
  },
  {
    name: 'Caramelo IV',
    code: 'E-150d',
    risk: 'Consumo moderado',
    purpose: 'Colorante marron oscuro',
    explanation: 'Usado en gaseosas cola, salsas y bebidas oscuras. No aporta valor nutricional y suele aparecer en productos de consumo ocasional.',
    alternatives: 'Infusiones, cacao natural o formulaciones sin colorantes.'
  },
  {
    name: 'Acido citrico',
    code: 'E-330',
    risk: 'Riesgo bajo',
    purpose: 'Acidulante y regulador de acidez',
    explanation: 'Ajusta el sabor acido y ayuda a conservar bebidas, mermeladas y productos envasados. En exceso puede irritar a personas sensibles.',
    alternatives: 'Jugo de limon, fermentacion natural o menor acidez formulada.'
  },
  {
    name: 'Acido fosforico',
    code: 'E-338',
    risk: 'Consumo moderado',
    purpose: 'Acidulante en bebidas oscuras',
    explanation: 'Aporta acidez y estabilidad en gaseosas. El consumo frecuente puede desplazar bebidas mas nutritivas.',
    alternatives: 'Agua con gas, bebidas sin fosfatos o acidulantes naturales.'
  },
  {
    name: 'Ortofosfato disodico',
    code: 'E-339',
    risk: 'Riesgo bajo',
    purpose: 'Estabilizante y regulador de pH',
    explanation: 'Ayuda a mantener la estabilidad de lacteos y alimentos procesados. Conviene revisar el conjunto de fosfatos si el producto se consume a diario.',
    alternatives: 'Procesos termicos controlados o formulaciones con menos estabilizantes.'
  },
  {
    name: 'Lecitina de soya',
    code: 'E-322',
    risk: 'Riesgo bajo',
    purpose: 'Emulsionante',
    explanation: 'Ayuda a mezclar grasas y agua para mejorar textura en chocolates, galletas y productos de panificacion.',
    alternatives: 'Lecitina de girasol o recetas con menos emulsionantes.'
  },
  {
    name: 'Polirricinoleato de poliglicerol',
    code: 'E-476',
    risk: 'Consumo moderado',
    purpose: 'Emulsionante para chocolates',
    explanation: 'Mejora la fluidez y textura del chocolate. Es mejor moderarlo dentro de un consumo ocasional de golosinas.',
    alternatives: 'Chocolate con mayor porcentaje de cacao y lista corta de ingredientes.'
  },
  {
    name: 'Bicarbonato de sodio',
    code: 'E-500ii',
    risk: 'Riesgo bajo',
    purpose: 'Gasificante y agente leudante',
    explanation: 'Se usa en galletas, panes y masas para generar volumen. Puede sumar sodio al producto final.',
    alternatives: 'Fermentacion con levadura o formulaciones bajas en sodio.'
  },
  {
    name: 'Bicarbonato de amonio',
    code: 'E-503ii',
    risk: 'Riesgo bajo',
    purpose: 'Agente leudante',
    explanation: 'Da textura crocante en galletas y crackers. Suele evaporarse durante el horneado cuando se usa correctamente.',
    alternatives: 'Levadura, polvo de hornear o recetas menos procesadas.'
  },
  {
    name: 'Goma xantana',
    code: 'E-415',
    risk: 'Riesgo bajo',
    purpose: 'Espesante y estabilizante',
    explanation: 'Aporta viscosidad en salsas, bebidas, helados y productos sin gluten. En personas sensibles puede causar gases si se consume mucho.',
    alternatives: 'Pectina, almidon natural o reduccion de espesantes.'
  },
  {
    name: 'Goma guar',
    code: 'E-412',
    risk: 'Riesgo bajo',
    purpose: 'Espesante vegetal',
    explanation: 'Fibra usada para dar cuerpo y estabilidad. Puede generar molestias digestivas en consumos altos.',
    alternatives: 'Pectina, fibra natural de frutas o menor cantidad de estabilizantes.'
  },
  {
    name: 'Pectina',
    code: 'E-440',
    risk: 'Riesgo bajo',
    purpose: 'Gelificante natural',
    explanation: 'Fibra presente en frutas, usada para dar textura a mermeladas, yogures y rellenos.',
    alternatives: 'Fruta entera, chia hidratada o cocciones con reduccion natural.'
  },
  {
    name: 'Sorbato de potasio',
    code: 'E-202',
    risk: 'Consumo moderado',
    purpose: 'Conservante antifungico',
    explanation: 'Inhibe mohos y levaduras en bebidas, salsas y panificados. Es preferible no depender de productos conservados a diario.',
    alternatives: 'Refrigeracion, pasteurizacion o preparaciones frescas.'
  },
  {
    name: 'Nitrito de sodio',
    code: 'E-250',
    risk: 'Riesgo alto',
    purpose: 'Conservante en carnes curadas',
    explanation: 'Ayuda a conservar color y seguridad microbiologica en embutidos. Conviene limitar carnes procesadas, especialmente en consumo frecuente.',
    alternatives: 'Carnes frescas, legumbres o proteinas sin curado.'
  },
  {
    name: 'Metabisulfito de potasio',
    code: 'E-224',
    risk: 'Consumo moderado',
    purpose: 'Conservante antioxidante',
    explanation: 'Se usa en frutas secas, jugos y vinos para evitar oxidacion. Puede causar sensibilidad en algunas personas, especialmente asmaticas.',
    alternatives: 'Productos sin sulfitos, refrigeracion o consumo fresco.'
  },
  {
    name: 'TBHQ',
    code: 'E-319',
    risk: 'Consumo moderado',
    purpose: 'Antioxidante para grasas y aceites',
    explanation: 'Retrasa la rancidez en snacks fritos y aceites. Su presencia suele indicar productos grasos de larga vida util.',
    alternatives: 'Snacks frescos, frutos secos sin aditivos o aceites mejor conservados.'
  },
  {
    name: 'Dioxido de silicio',
    code: 'E-551',
    risk: 'Riesgo bajo',
    purpose: 'Antiaglomerante',
    explanation: 'Evita que polvos, sales y condimentos se apelmacen. Normalmente se usa en cantidades pequenas.',
    alternatives: 'Envases con mejor control de humedad o mezclas frescas.'
  },
  {
    name: 'Acesulfame K',
    code: 'E-950',
    risk: 'Consumo moderado',
    purpose: 'Edulcorante artificial',
    explanation: 'Endulza sin aportar azucar. Conviene moderarlo y no usarlo como base diaria para mantener preferencia por sabores muy dulces.',
    alternatives: 'Reduccion gradual del dulzor, frutas enteras o canela.'
  },
  {
    name: 'Ciclamato de sodio',
    code: 'E-952',
    risk: 'Consumo moderado',
    purpose: 'Edulcorante artificial',
    explanation: 'Endulzante intenso frecuente en bebidas light o sin azucar. Es mejor revisar el consumo total de edulcorantes del dia.',
    alternatives: 'Agua saborizada con frutas, infusiones frias o menos dulzor.'
  },
  {
    name: 'Glucosidos de esteviol',
    code: 'E-960',
    risk: 'Riesgo bajo',
    purpose: 'Edulcorante de origen vegetal',
    explanation: 'Endulzante sin azucar derivado de la estevia. Aunque suele ser bien tolerado, mantiene el habito de dulzor intenso.',
    alternatives: 'Estevia de hoja, fruta entera o reduccion progresiva de dulzor.'
  },
  {
    name: 'Amarillo ocaso',
    code: 'E-110',
    risk: 'Evitar en ninos',
    purpose: 'Colorante sintetico naranja',
    explanation: 'Colorante azoico usado en bebidas, gelatinas y golosinas. Se recomienda limitarlo en poblacion infantil y personas sensibles.',
    alternatives: 'Achiote, curcuma o extractos naturales.'
  },
  {
    name: 'Rojo allura',
    code: 'E-129',
    risk: 'Evitar en ninos',
    purpose: 'Colorante sintetico rojo',
    explanation: 'Usado en dulces, bebidas y postres. Conviene limitar colorantes artificiales en menores.',
    alternatives: 'Betarraga, frutos rojos o extractos vegetales.'
  },
  {
    name: 'Azul brillante FCF',
    code: 'E-133',
    risk: 'Consumo moderado',
    purpose: 'Colorante sintetico azul',
    explanation: 'Aporta color intenso en bebidas, caramelos y helados. No tiene valor nutricional y suele acompanar productos azucarados.',
    alternatives: 'Colorantes naturales o productos sin color artificial.'
  },
  {
    name: 'Vainillina',
    code: 'Aroma identico al natural',
    risk: 'Riesgo bajo',
    purpose: 'Saborizante',
    explanation: 'Aporta sabor a vainilla en chocolates, galletas y postres. No es un problema por si sola, pero suele aparecer en productos dulces.',
    alternatives: 'Vainilla natural, cacao real o recetas con menos aromatizantes.'
  },
  {
    name: 'Cafeina',
    code: 'Sin codigo E',
    risk: 'Consumo moderado',
    purpose: 'Estimulante',
    explanation: 'Presente en gaseosas, energizantes, cafe y te. Debe moderarse en ninos, embarazo, ansiedad o sensibilidad a estimulantes.',
    alternatives: 'Agua, infusiones sin cafeina o bebidas sin estimulantes.'
  }
];
