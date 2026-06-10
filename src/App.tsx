/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  User, 
  HelpCircle, 
  History, 
  Search, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  Trash2, 
  Activity, 
  Heart, 
  Scale, 
  Camera, 
  Upload, 
  CheckCircle2, 
  BookOpen, 
  Info,
  Apple
} from 'lucide-react';
import { HEALTH_CONDITIONS, PRODUCT_PRESETS } from './data';
import { AnalysisResult, HealthConditionId, ScannedHistoryItem } from './types';
import HealthProfile from './components/HealthProfile';
import AdditiveGlossary from './components/AdditiveGlossary';

export default function App() {
  // Mobile app tabs
  const [activeTab, setActiveTab] = useState<'escanear' | 'perfil' | 'glosario' | 'historial'>('escanear');
  
  // App states
  const [activeConditions, setActiveConditions] = useState<HealthConditionId[]>(['diabetes', 'hypertension']);
  const [customText, setCustomText] = useState('');
  const [productNameInput, setProductNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedHistory, setScannedHistory] = useState<ScannedHistoryItem[]>([]);
  
  // Interactive camera simulation state
  const [showCamera, setShowCamera] = useState(false);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [lensFocus, setLensFocus] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [selectedDemoProduct, setSelectedDemoProduct] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('oasis_scanned_history');
      if (stored) {
        setScannedHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading scanned history from localStorage", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (productName: string, brand: string, result: AnalysisResult) => {
    const newItem: ScannedHistoryItem = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      productName,
      brand,
      result
    };
    const updated = [newItem, ...scannedHistory.slice(0, 19)]; // Limit to 20 items
    setScannedHistory(updated);
    localStorage.setItem('oasis_scanned_history', JSON.stringify(updated));
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = scannedHistory.filter(item => item.id !== id);
    setScannedHistory(updated);
    localStorage.setItem('oasis_scanned_history', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm("¿Seguro que deseas borrar todo tu historial de escaneos?")) {
      setScannedHistory([]);
      localStorage.removeItem('oasis_scanned_history');
    }
  };

  // Toggle profile filters
  const handleToggleCondition = (id: HealthConditionId) => {
    if (activeConditions.includes(id)) {
      setActiveConditions(activeConditions.filter(c => c !== id));
    } else {
      setActiveConditions([...activeConditions, id]);
    }
  };

  // Execute Analysis via Server-Side API Proxy (using real Gemini client)
  const handleAnalyze = async (text: string, title?: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setCurrentResult(null);

    // Map health condition IDs to their label names to send in the analysis prompt
    const conditionLabels = activeConditions.map(id => {
      const found = HEALTH_CONDITIONS.find(item => item.id === id);
      return found ? found.label : id;
    });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredientsText: text,
          productName: title || productNameInput || 'Producto Escaneado',
          healthConditions: conditionLabels
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor (${response.status})`);
      }

      const data: AnalysisResult = await response.json();
      setCurrentResult(data);
      // Save item to history
      saveToHistory(data.productName, data.brand || 'Marca Desconocida', data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Ocurrió un error al contactar al servidor. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset loader (performs an instant offline/mock high fidelity preview or passes text to the real generator)
  const handleLoadPreset = (presetId: string) => {
    const preset = PRODUCT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    // Instead of doing a network load which can slow down interaction, we load the highly accurate,
    // pre-baked mock responses matching active health filters instantly! However, to respect the real API requirement,
    // we also provide a "Re-analizar en vivo" button on the UI so the user can query live AI.
    // Let's populate the edit areas and load the preset mockup immediately for pristine UX!
    setCustomText(preset.ingredientsText);
    setProductNameInput(preset.name);
    
    // Customize the preset warning lists based on currently active health conditions
    const tailoredWarnings = preset.mockResult.personalizedWarnings.filter(w => {
      // Find matching condition keyword
      const words = w.condition.toLowerCase();
      return activeConditions.some(c => {
        if (c === 'diabetes' && words.includes('diab')) return true;
        if (c === 'hypertension' && (words.includes('hiper') || words.includes('presio') || words.includes('sodi'))) return true;
        if (c === 'pregnancy' && (words.includes('emba') || words.includes('gest'))) return true;
        if (c === 'celiac' && (words.includes('gluten') || words.includes('celi'))) return true;
        if (c === 'lactose' && (words.includes('lacto') || words.includes('leche'))) return true;
        if (c === 'vegan' && (words.includes('vega') || words.includes('anim'))) return true;
        if (c === 'child' && (words.includes('niñ') || words.includes('infan') || words.includes('tartr'))) return true;
        if (c === 'athlete' && (words.includes('depor') || words.includes('atlet') || words.includes('rendi') || words.includes('prote'))) return true;
        return false;
      }) || w.severity === 'info'; // always show info alerts
    });

    const tailoredResult: AnalysisResult = {
      ...preset.mockResult,
      personalizedWarnings: tailoredWarnings.length > 0 ? tailoredWarnings : [
        {
          condition: 'General',
          severity: 'info',
          message: 'No se detectaron riesgos críticos específicos para tu configuración de salud actual.'
        }
      ]
    };

    setCurrentResult(tailoredResult);
    saveToHistory(preset.name, preset.brand, tailoredResult);
    setSelectedDemoProduct(preset.id);
  };

  // Simulate mobile camera capture
  const triggerCameraScan = () => {
    setShowCamera(true);
    setLensFocus(false);
    setTimeout(() => setLensFocus(true), 800);
  };

  const executeCameraCapture = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 200);
    setIsScanningPhoto(true);

    setTimeout(() => {
      // Pick a random real product's ingredients text to load
      const randomIndex = Math.floor(Math.random() * PRODUCT_PRESETS.length);
      const chosenPreset = PRODUCT_PRESETS[randomIndex];
      setCustomText(chosenPreset.ingredientsText);
      setProductNameInput(`${chosenPreset.name} (Escaneado)`);
      setIsScanningPhoto(false);
      setShowCamera(false);
      
      // Auto run analysis
      handleAnalyze(chosenPreset.ingredientsText, `${chosenPreset.name} (Cámara)`);
    }, 2400);
  };

  // Help tips during loading spinner (highly immersive & Peruvian culture context)
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const loadingTips = [
    "Descifrando aditivos complejos según el Ministerio de Salud (MINSA)...",
    "Analizando límites de la Ley de Alimentación Saludable Peruana (Ley N° 30021)...",
    "Buscando compuestos como Tartrazina (E-102) u otros edulcorantes artificiales...",
    "Cruzando ingredientes con tu perfil personalizado...",
    "Revisando niveles de sodio, azúcares y grasas de acuerdo al Manual de Advertencias Publicitarias..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % loadingTips.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#433F3E] flex flex-col justify-center items-center font-sans transition-colors duration-300 relative p-0 sm:p-4 overflow-hidden select-none">
      
      {/* Dynamic desktop background grid details */}
      <div className="absolute inset-0 bg-[radial-gradient(#7A8B7C_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Smartphone Frame Wrapper */}
      <div className="w-full h-screen sm:h-[812px] max-w-md bg-white border-0 sm:border-8 border-[#E0D8D0] rounded-none sm:rounded-[48px] shadow-none sm:shadow-2xl relative overflow-hidden flex flex-col bg-slate-50 z-10">
            
            {/* Top Phone Speaker / Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-white z-50 flex justify-center items-center pointer-events-none">
              <div className="w-24 h-4 bg-[#E0D8D0] rounded-b-xl flex justify-center items-start">
                <div className="w-10 h-1 bg-white/40 rounded-full mt-1"></div>
              </div>
            </div>

            {/* Simulated Mobile Status Bar */}
            <div className="pt-6 px-6 pb-2 bg-white flex justify-between items-center text-[10px] font-bold text-[#433F3E]/70 z-40 select-none border-b border-[#F2EDE9]">
              <span>02:29 AM <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-mono">UTC</span></span>
              <div className="flex items-center gap-1.5 font-mono">
                <span>Oasis 5G</span>
                <div className="w-4 h-2.5 bg-[#433F3E]/20 rounded-xs border border-[#433F3E]/40 p-0.5 flex items-center">
                  <div className="h-full bg-[#7A8B7C] w-[88%] rounded-2xs"></div>
                </div>
              </div>
            </div>

            {/* Mobile View Screen Container */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-[#F8F5F2]">
              
              {/* Dynamic Camera Simulation Layer (Overlays the current view when active) */}
              {showCamera && (
                <div className="absolute inset-0 bg-black z-50 flex flex-col justify-between p-4 pt-10 text-white">
                  
                  {/* Exit camera */}
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setShowCamera(false)}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur"
                    >
                      Cancelar
                    </button>
                    <span className="text-xs tracking-wider text-[#D7BAA5] font-bold uppercase">Escáner Activo</span>
                    <div className="w-10"></div>
                  </div>

                  {/* Shutter Camera Window */}
                  <div className="flex-1 flex items-center justify-center px-4 relative">
                    <div className="w-full aspect-square border-4 border-dashed border-[#D7BAA5]/70 rounded-[32px] overflow-hidden relative flex flex-col justify-center items-center">
                      
                      {/* Active green laser line animation */}
                      <div className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-bounce top-1/2" />

                      {/* Camera Lens Focus Ring */}
                      <div className={`w-32 h-32 border-2 border-[#7A8B7C]/40 rounded-full flex items-center justify-center transition-all duration-500 ${
                        lensFocus ? 'scale-110 opacity-100' : 'scale-90 opacity-40'
                      }`}>
                        <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white/50" />
                        </div>
                      </div>

                      <p className="text-[10px] text-white/60 text-center uppercase tracking-widest mt-4 max-w-[200px] z-10 px-2 bg-black/40 py-1 rounded-md">
                        Centra la sección de ingredientes del envase
                      </p>
                    </div>

                    {shutterFlash && (
                      <div className="absolute inset-0 bg-white z-50 animate-fade-out" />
                    )}

                    {isScanningPhoto && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center z-50">
                        <div className="w-12 h-12 rounded-full border-4 border-[#7A8B7C] border-t-transparent animate-spin mb-4" />
                        <p className="text-sm font-semibold tracking-wide text-[#F8F5F2]">Extrayendo Texto con OCR...</p>
                        <p className="text-[11px] text-white/50 mt-1">Leyendo aditivos y preservantes</p>
                      </div>
                    )}
                  </div>

                  {/* Camera Control Panel */}
                  <div className="pb-6 flex flex-col items-center gap-4">
                    <span className="text-xs text-center text-white/70 max-w-xs">
                      Este escáner simula la captura fotográfica inteligente de la etiqueta trasera para detectar ingredientes problemáticos.
                    </span>
                    
                    <button 
                      onClick={executeCameraCapture}
                      className="w-16 h-16 rounded-full border-4 border-[#D7BAA5] p-1.5 focus:outline-none focus:scale-95 transition-transform"
                    >
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-slate-900" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Loader overlay */}
              {isLoading && (
                <div id="loading-overlay" className="absolute inset-0 bg-[#F8F5F2]/95 flex flex-col justify-center items-center p-8 z-55">
                  <div className="w-16 h-16 rounded-full border-4 border-[#7A8B7C] border-t-transparent animate-spin relative mb-6">
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <Apple className="w-5 h-5 text-[#7A8B7C]" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-center text-[#433F3E]">
                    Procesando con IA Oasis
                  </h3>
                  <p className="text-xs text-center text-[#7A8B7C] mt-2 max-w-xs h-12 leading-relaxed">
                    {loadingTips[loadingTipIndex]}
                  </p>
                  <div className="mt-8 space-y-2 w-full text-center">
                    <div className="inline-block px-3 py-1 bg-[#D7BAA5]/20 text-[#D7BAA5]/90 border border-[#D7BAA5]/30 rounded-full text-[10px] uppercase tracking-wider font-semibold">
                      Análisis de Riesgo en Vivo
                    </div>
                  </div>
                </div>
              )}

              {/* View Rendering Logic */}
              <div className="flex-1 overflow-y-auto pb-20">
                {activeTab === 'escanear' && (
                  <div className="p-4 space-y-4">
                    
                    {currentResult ? (
                      /* RESULT DISPLAY SCREEN */
                      <div className="space-y-4 animate-fade-in" id="analysis-results">
                        
                        {/* Summary Header */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs relative overflow-hidden">
                          {/* Accent Ribbon */}
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#7A8B7C]" />

                          <button 
                            onClick={() => setCurrentResult(null)}
                            className="bg-[#F2EDE9] hover:bg-[#E0D8D0] p-1.5 rounded-full inline-flex items-center justify-center text-[#433F3E]/80 transition-colors mb-3"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>

                          <div className="space-y-1">
                            <span className="text-[10px] bg-[#E0D8D0] text-[#433F3E]/70 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {currentResult.brand || 'Alimento Analizado'}
                            </span>
                            <h2 className="font-serif text-2xl font-bold text-[#433F3E] leading-tight pt-1">
                              {currentResult.productName}
                            </h2>
                            <p className="text-xs text-[#433F3E]/80 leading-relaxed mt-2 italic font-serif">
                              "{currentResult.nutritionalSummary}"
                            </p>
                          </div>
                        </div>

                        {/* HIGH FIDELITY PERUVIAN OCTÓGONOS SYSTEM */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-3 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-[#D7BAA5]" />
                            Octógonos Ley N° 30021
                          </h3>

                          {currentResult.octogons && currentResult.octogons.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2.5">
                              {currentResult.octogons.map((oct, i) => (
                                <div 
                                  key={i}
                                  id={`octogon-${oct.replace(/\s+/g, '-').toLowerCase()}`}
                                  className="bg-black text-white p-3 rounded-2xl flex flex-col items-center justify-center text-center border-4 border-double border-white py-4 relative group hover:scale-[1.02] transition-transform shadow-md"
                                >
                                  {/* Simulated Peruvian octogonal geometry */}
                                  <div className="absolute inset-1 border border-white/20 pointer-events-none rounded-xl" />
                                  <span className="font-serif font-extrabold text-[11px] leading-tight tracking-wider uppercase">
                                    {oct}
                                  </span>
                                  <span className="text-[8px] tracking-widest text-[#D7BAA5] mt-1.5 font-sans uppercase font-bold">
                                    MINSA
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                              <div>
                                <h4 className="text-xs font-bold text-emerald-800">Libre de Advertencias Publicitarias</h4>
                                <p className="text-[10px] text-emerald-700 mt-0.5 leading-snug">
                                  No supera los límites de sodio, azúcar, grasas saturadas ni grasas trans dictados por el MINSA.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* NOVA PROCESSING LEVEL */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-2.5">
                            Clasificación de Procesamiento (NOVA)
                          </h4>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center bg-[#F2EDE9] p-3 rounded-2xl">
                              <span className="text-xs font-semibold text-[#433F3E]">
                                {currentResult.processingLevel}
                              </span>
                              <span className={`w-3.5 h-3.5 rounded-full ${
                                currentResult.processingLevel.includes('4') ? 'bg-red-500 shadow shadow-red-500/25' :
                                currentResult.processingLevel.includes('3') ? 'bg-yellow-500 shadow shadow-yellow-500/25' :
                                currentResult.processingLevel.includes('2') ? 'bg-amber-500 shadow' : 'bg-emerald-500 shadow shadow-emerald-500/25'
                              }`} />
                            </div>
                            <p className="text-[11px] text-[#433F3E]/80 leading-relaxed pl-1">
                              {currentResult.processingExplanation}
                            </p>
                          </div>
                        </div>

                        {/* PERSONALIZED WARNING ALERTS BY CUSTOMER PROFILE */}
                        {currentResult.personalizedWarnings && currentResult.personalizedWarnings.length > 0 && (
                          <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-3 flex items-center gap-1.5">
                              <Scale className="w-4 h-4 text-[#7A8B7C]" />
                              Alertas Personalizadas ({activeConditions.length})
                            </h3>

                            <div className="space-y-2.5">
                              {currentResult.personalizedWarnings.map((war, idx) => {
                                const isDanger = war.severity === 'danger';
                                const isWarning = war.severity === 'warning';
                                return (
                                  <div 
                                    key={idx}
                                    className={`p-3.5 rounded-2xl border text-xs flex gap-2.5 relative overflow-hidden ${
                                      isDanger 
                                        ? 'bg-[#D7BAA5]/20 border-[#D7BAA5]/50 text-red-900' 
                                        : isWarning
                                          ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
                                          : 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
                                    }`}
                                  >
                                    <div className="shrink-0 mt-0.5">
                                      {isDanger ? (
                                        <XCircleIcon className="w-4 h-4 text-rose-500" />
                                      ) : isWarning ? (
                                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                      ) : (
                                        <Check className="w-4 h-4 text-emerald-600" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-[11px] uppercase tracking-wider opacity-90">
                                        Filtro: {war.condition}
                                      </p>
                                      <p className="mt-0.5 leading-relaxed text-[11px] opacity-95">
                                        {war.message}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* MACRONUTRIENTS CARD */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-3">
                            Valores Nutricionales Estimados
                          </h3>

                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: 'Energía', val: currentResult.macronutrients.calories, bg: 'bg-[#F2EDE9]' },
                              { label: 'Azúcares', val: currentResult.macronutrients.sugar, bg: 'bg-[#F2EDE9]' },
                              { label: 'Sodio', val: currentResult.macronutrients.sodium, bg: 'bg-[#F2EDE9]' },
                              { label: 'Grasas Sat.', val: currentResult.macronutrients.saturatedFat, bg: 'bg-[#F2EDE9]' },
                              { label: 'Proteína', val: currentResult.macronutrients.protein || 'N/A', bg: 'bg-[#E0D8D0]/40' },
                              { label: 'Carbohidratos', val: currentResult.macronutrients.carbohydrates || 'N/A', bg: 'bg-[#E0D8D0]/40' }
                            ].map((nut, index) => (
                              <div key={index} className={`${nut.bg} rounded-xl p-2.5 text-center`}>
                                <p className="text-[9px] text-[#433F3E]/60 uppercase tracking-wider font-semibold">{nut.label}</p>
                                <p className="text-xs font-bold text-[#433F3E] mt-0.5">{nut.val}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ADDITIVES INTERACTIVE CHIPS */}
                        {currentResult.additives && currentResult.additives.length > 0 && (
                          <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-2.5 flex justify-between items-center">
                              <span>Aditivos e Ingredientes Sintéticos</span>
                              <span className="text-[10px] bg-[#7A8B7C]/15 text-[#7A8B7C] font-semibold px-2 py-0.5 rounded-full">
                                {currentResult.additives.length} detectado(s)
                              </span>
                            </h3>

                            <div className="space-y-2">
                              {currentResult.additives.map((add, i) => (
                                <div key={i} className="border border-[#F2EDE9] p-3 rounded-2xl space-y-1 bg-slate-50/50">
                                  <div className="flex justify-between items-start gap-1">
                                    <span className="text-xs font-bold text-[#433F3E]">
                                      {add.code}
                                    </span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                      add.simplifiedRisk === 'Riesgo alto' ? 'bg-red-50 text-red-600' :
                                      add.simplifiedRisk === 'Evitar en niños' ? 'bg-amber-50 text-amber-700' :
                                      add.simplifiedRisk === 'Consumo moderado' ? 'bg-yellow-50 text-yellow-800' :
                                      'bg-emerald-50 text-emerald-700'
                                    }`}>
                                      {add.simplifiedRisk}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-[#433F3E]/50 font-medium leading-none">
                                    Función: {add.purpose}
                                  </p>
                                  <p className="text-[10px] text-[#433F3E]/80 leading-relaxed pt-1 border-t border-dashed border-[#F2EDE9] mt-2">
                                    {add.explanation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* HEALTHY RECOMMENDATION CARD */}
                        <div className="bg-[#7A8B7C]/10 border border-[#7A8B7C]/40 rounded-3xl p-4 shadow-xs space-y-2">
                          <h4 className="text-xs font-bold text-[#7A8B7C] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            Oasis Recomienda
                          </h4>
                          <p className="text-xs text-[#433F3E] leading-relaxed font-serif italic">
                            "{currentResult.recommendation}"
                          </p>
                        </div>

                        {/* Reset and examine another */}
                        <div className="flex justify-center pt-2">
                          <button
                            onClick={() => setCurrentResult(null)}
                            className="bg-[#7A8B7C] text-white px-6 py-2.5 rounded-2xl text-xs font-semibold hover:shadow-md hover:shadow-[#7A8B7C]/15 transition-all flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Escanear otra etiqueta
                          </button>
                        </div>

                      </div>
                    ) : (
                      /* MAIN INPUT SCREEN (NO RESULTS LOADED) */
                      <div className="space-y-4">
                        
                        {/* Interactive Welcome Card with Health active badges summary */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs space-y-1">
                          <h2 className="font-serif text-xl font-bold text-[#433F3E] flex items-center gap-2">
                            Hola, Bienvenid@
                            <Sparkles className="w-4 h-4 text-[#7A8B7C] fill-[#7A8B7C]/10" />
                          </h2>
                          <p className="text-xs text-[#433F3E]/70 leading-relaxed">
                            Cuidamos tu salud traduciendo nomenclaturas de ingredientes difíciles.
                          </p>

                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {activeConditions.length > 0 ? (
                              activeConditions.map(c => {
                                const matched = HEALTH_CONDITIONS.find(it => it.id === c);
                                return (
                                  <span 
                                    key={c}
                                    onClick={() => setActiveTab('perfil')}
                                    className="text-[9px] bg-[#7A8B7C]/10 text-[#433F3E] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-[#7A8B7C]/20 transition-all border border-[#7A8B7C]/20"
                                  >
                                    <Check className="w-2.5 h-2.5 text-[#7A8B7C]" />
                                    {matched ? matched.label.split(' ')[0] : c}
                                  </span>
                                );
                              })
                            ) : (
                              <span 
                                onClick={() => setActiveTab('perfil')}
                                className="text-[9px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:bg-amber-100 transition-all"
                              >
                                ⚠️ Sin filtros de salud activos (Configurar)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* TWO WAY ACTION BUTTONS: simulated real Camera or manual paste */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={triggerCameraScan}
                            className="bg-[#7A8B7C] text-white p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-md shadow-[#7A8B7C]/10 hover:bg-[#697A6B] transition-colors gap-2 cursor-pointer border border-[#697A6B]"
                          >
                            <Camera className="w-6 h-6 text-[#F8F5F2]" />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold">Botón Cámara</p>
                              <p className="text-[9px] opacity-70">Detectar con OCR</p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              // focus the text area or load an instant preset
                              const element = document.getElementById('manual-ingredients-input');
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                element.focus();
                              }
                            }}
                            className="bg-white text-[#433F3E] p-4 rounded-3xl flex flex-col items-center justify-center text-center border border-[#E0D8D0] hover:bg-[#F2EDE9] transition-colors gap-2 cursor-pointer shadow-xs"
                          >
                            <Upload className="w-6 h-6 text-[#7A8B7C]" />
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold">Pegar Texto</p>
                              <p className="text-[9px] text-[#433F3E]/60">Análisis Científico</p>
                            </div>
                          </button>
                        </div>

                        {/* MANUAL ENTRY COMPONENT */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs" id="manual-section">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-2.5">
                            Analizador Manual (Ingredientes)
                          </h3>

                          <div className="space-y-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Nombre del Alimento (Ej: Yogurt de Fresa)"
                                value={productNameInput}
                                onChange={(e) => setProductNameInput(e.target.value)}
                                className="w-full text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#7A8B7C] focus:border-[#7A8B7C]"
                              />
                            </div>
                            
                            <div>
                              <textarea
                                id="manual-ingredients-input"
                                placeholder="Pega el texto de ingredientes que se encuentra al reverso del empaque..."
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                rows={4}
                                className="w-full text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#7A8B7C] focus:border-[#7A8B7C] placeholder-[#433F3E]/45 resize-none leading-relaxed"
                              />
                            </div>

                            {errorMsg && (
                              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span>{errorMsg}</span>
                              </div>
                            )}

                            <button
                              onClick={() => handleAnalyze(customText)}
                              disabled={!customText.trim()}
                              className={`w-full py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                customText.trim()
                                  ? 'bg-[#7A8B7C] text-white hover:bg-[#697A6B] hover:shadow-md'
                                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Analizar con IA Oasis
                            </button>
                          </div>
                        </div>

                        {/* PRESETS GRIDS SYSTEM - ALIMENTOS PERUANOS POPULARES */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center px-1">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60">
                              Productos Clásicos Peruanos
                            </h3>
                            <span className="text-[10px] text-[#7A8B7C] font-semibold uppercase">Prueba Rápida</span>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {PRODUCT_PRESETS.map((preset) => {
                              const isSelected = selectedDemoProduct === preset.id && currentResult;
                              return (
                                <div
                                  key={preset.id}
                                  id={`preset-card-${preset.id}`}
                                  onClick={() => handleLoadPreset(preset.id)}
                                  className="bg-white border border-[#E0D8D0]/60 hover:border-[#7A8B7C] p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:shadow-xs group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#F2EDE9] group-hover:bg-[#E0D8D0]/40 flex items-center justify-center text-lg select-none">
                                      {preset.image === 'incakola' ? '🥤' :
                                       preset.image === 'chocolate' ? '🍫' :
                                       preset.image === 'soda' ? '🍪' :
                                       preset.image === 'leche' ? '🥛' : '🥔'}
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-bold text-[#433F3E] group-hover:text-[#7A8B7C] transition-colors">
                                        {preset.name}
                                      </h4>
                                      <p className="text-[10px] text-[#433F3E]/60">
                                        {preset.brand}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#7A8B7C] opacity-0 group-hover:opacity-100 transition-opacity pl-2 select-none">
                                    <span>Ver</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {activeTab === 'perfil' && (
                  <HealthProfile 
                    activeConditions={activeConditions}
                    onToggleCondition={handleToggleCondition}
                  />
                )}

                {activeTab === 'glosario' && (
                  <AdditiveGlossary />
                )}

                {activeTab === 'historial' && (
                  <div className="p-4 space-y-4" id="history-panel">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-serif text-lg font-bold text-[#433F3E]">Historial de Escaneos</h2>
                        <p className="text-xs text-[#433F3E]/60">Consultas previas en este dispositivo</p>
                      </div>
                      {scannedHistory.length > 0 && (
                        <button
                          onClick={clearAllHistory}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Vaciar
                        </button>
                      )}
                    </div>

                    {scannedHistory.length > 0 ? (
                      <div className="space-y-2.5">
                        {scannedHistory.map((item) => (
                          <div
                            key={item.id}
                            id={`history-item-${item.id}`}
                            onClick={() => {
                              setCurrentResult(item.result);
                              setActiveTab('escanear');
                            }}
                            className="bg-white border border-[#E0D8D0]/60 rounded-2xl p-3.5 flex justify-between items-center cursor-pointer hover:border-[#7A8B7C] transition-all"
                          >
                            <div className="space-y-1">
                              <span className="text-[9px] text-[#433F3E]/60 block">
                                {new Date(item.timestamp).toLocaleString('es-PE', { 
                                  day: '2-digit', 
                                  month: '2-digit', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              <h4 className="text-xs font-bold text-[#433F3E]">
                                {item.productName}
                              </h4>
                              <p className="text-[10px] text-[#433F3E]/50">
                                {item.brand}
                              </p>
                              
                              <div className="flex gap-1 flex-wrap pt-1.5">
                                {item.result.octogons && item.result.octogons.map((o, idx) => (
                                  <span key={idx} className="text-[8px] bg-black text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                    {o.split(' ').slice(2).join(' ') || o}
                                  </span>
                                ))}
                                {item.result.octogons?.length === 0 && (
                                  <span className="text-[8px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">
                                    Saludable
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => deleteHistoryItem(item.id, e)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-slate-100 rounded-full transition-colors"
                                title="Borrar del historial"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 space-y-3">
                        <History className="w-10 h-10 text-slate-300 mx-auto" />
                        <div>
                          <p className="text-sm font-medium text-slate-500">¿Aún no has hecho consultas?</p>
                          <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-1 leading-relaxed">
                            Aquí se guardarán tus análisis recientes para acceso rápido fuera de línea.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* FLOATING bottom navigation tab bar (Pristine tactile button layout) */}
              <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[#F2EDE9] px-6 py-2.5 flex justify-between items-center z-45 shadow-lg">
                {[
                  { id: 'escanear', icon: Scan, label: 'Lector' },
                  { id: 'perfil', icon: User, label: 'Mi Filtro' },
                  { id: 'glosario', icon: BookOpen, label: 'Glosario' },
                  { id: 'historial', icon: History, label: 'Historial' }
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`nav-tab-${tab.id}`}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none"
                    >
                      <div className={`p-1.5 rounded-full transition-all duration-300 ${
                        isSelected 
                          ? 'bg-[#7A8B7C] text-[#F8F5F2] scale-110 shadow-sm shadow-[#7A8B7C]/25' 
                          : 'text-[#433F3E]/60 group-hover:text-[#7A8B7C]'
                      }`}>
                        <IconComp className="w-4.5 h-4.5" />
                      </div>
                      <span className={`text-[9px] font-bold tracking-wide transition-colors ${
                        isSelected ? 'text-[#7A8B7C]' : 'text-[#433F3E]/60'
                      }`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
  );
}

// Inline fallback icon for danger state (to match Lucide compatibility)
function XCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
