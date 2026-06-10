export interface Macronutrients {
  calories: string;
  saturatedFat: string;
  sugar: string;
  sodium: string;
  protein: string;
  carbohydrates: string;
}

export interface Additive {
  code: string;
  purpose: string;
  simplifiedRisk: 'Riesgo bajo' | 'Consumo moderado' | 'Evitar en niños' | 'Riesgo alto';
  explanation: string;
}

export interface PersonalizedWarning {
  condition: string;
  severity: 'danger' | 'warning' | 'info';
  message: string;
}

export interface AnalysisResult {
  productName: string;
  brand?: string;
  nutritionalSummary: string;
  processingLevel: string;
  processingExplanation: string;
  macronutrients: Macronutrients;
  octogons: string[];
  additives: Additive[];
  personalizedWarnings: PersonalizedWarning[];
  recommendation: string;
}

export interface ProductPreset {
  id: string;
  name: string;
  brand: string;
  ingredientsText: string;
  image: string; // A placeholder identifier or description
  category: 'Bebidas' | 'Snacks' | 'Lácteos' | 'Cereales' | 'Otros';
  description: string;
  mockResult: AnalysisResult; // Prepopulated mock analyses for instant offline high-fidelity preview
}

export interface ScannedHistoryItem {
  id: string;
  timestamp: number;
  productName: string;
  brand: string;
  result: AnalysisResult;
}

export type HealthConditionId = 
  | 'diabetes'
  | 'hypertension'
  | 'pregnancy'
  | 'celiac'
  | 'lactose'
  | 'vegan'
  | 'child'
  | 'athlete';

export interface HealthCondition {
  id: HealthConditionId;
  label: string;
  iconName: string;
  description: string;
}
