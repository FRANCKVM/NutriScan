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
  }
];
