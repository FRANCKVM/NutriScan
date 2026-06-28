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
  simplifiedRisk: 'Riesgo bajo' | 'Consumo moderado' | 'Evitar en ninos' | 'Riesgo alto';
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
  barcode?: string;
  barcodes?: string[];
  ingredientsText: string;
  image: string;
  category: 'Bebidas' | 'Snacks' | 'Lacteos' | 'Cereales' | 'Otros';
  description: string;
  analysis: AnalysisResult;
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
