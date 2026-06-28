/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
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
  Apple,
  LogOut
} from 'lucide-react';
import { HEALTH_CONDITIONS } from './data';
import productsData from './products.json';
import { AnalysisResult, HealthConditionId, ProductPreset, ScannedHistoryItem } from './types';
import HealthProfile from './components/HealthProfile';
import AdditiveGlossary from './components/AdditiveGlossary';

const PRODUCT_CATALOG: ProductPreset[] = productsData.products as ProductPreset[];
const DEFAULT_SCANNED_PRODUCT = PRODUCT_CATALOG[0];
const AUTH_STORAGE_KEY = 'nutriscan_auth_session';
const PRODUCT_BADGES: Record<string, string> = {
  cocacola: 'CC',
  incakola: 'IK',
  chocolate: 'CH',
  soda: 'GF',
  leche: 'LG',
  lays: 'LY'
};

interface AuthSession {
  name: string;
  email: string;
  createdAt: number;
}

export default function App() {
  // Mobile app tabs
  const [activeTab, setActiveTab] = useState<'escanear' | 'perfil' | 'glosario' | 'historial'>('escanear');
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading auth session from localStorage', error);
      return null;
    }
  });
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // App states
  const [activeConditions, setActiveConditions] = useState<HealthConditionId[]>(['diabetes', 'hypertension']);
  const [customText, setCustomText] = useState('');
  const [productNameInput, setProductNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedHistory, setScannedHistory] = useState<ScannedHistoryItem[]>([]);
  
  // EscÃƒÂ¡ner de cÃƒÂ³digos de barras en frontend
  const [showCamera, setShowCamera] = useState(false);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState('Listo para escanear');
  const [scanError, setScanError] = useState<string | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);

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
    setScannedHistory((prev) => {
      const updated = [newItem, ...prev.slice(0, 19)];
      localStorage.setItem('oasis_scanned_history', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = scannedHistory.filter(item => item.id !== id);
    setScannedHistory(updated);
    localStorage.setItem('oasis_scanned_history', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    if (window.confirm("Ã‚Â¿Seguro que deseas borrar todo tu historial de escaneos?")) {
      setScannedHistory([]);
      localStorage.removeItem('oasis_scanned_history');
    }
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = loginName.trim();
    const trimmedEmail = loginEmail.trim();

    if (!trimmedName || !trimmedEmail) {
      setLoginError('Ingresa tu nombre y correo para continuar.');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setLoginError('Ingresa un correo valido para iniciar sesion.');
      return;
    }

    const nextSession: AuthSession = {
      name: trimmedName,
      email: trimmedEmail,
      createdAt: Date.now()
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    setAuthSession(nextSession);
    setLoginError(null);
  };

  // Toggle profile filters
  const handleToggleCondition = (id: HealthConditionId) => {
    if (activeConditions.includes(id)) {
      setActiveConditions(activeConditions.filter(c => c !== id));
    } else {
      setActiveConditions([...activeConditions, id]);
    }
  };

  const applyProduct = (product: ProductPreset) => {
    const tailoredWarnings = product.analysis.personalizedWarnings.filter((warning) => {
      const words = warning.condition.toLowerCase();
      return activeConditions.some((condition) => {
        if (condition === 'diabetes' && words.includes('diab')) return true;
        if (condition === 'hypertension' && (words.includes('hiper') || words.includes('presio') || words.includes('sodi'))) return true;
        if (condition === 'pregnancy' && (words.includes('emba') || words.includes('gest'))) return true;
        if (condition === 'celiac' && (words.includes('gluten') || words.includes('celi'))) return true;
        if (condition === 'lactose' && (words.includes('lacto') || words.includes('leche'))) return true;
        if (condition === 'vegan' && (words.includes('vega') || words.includes('anim'))) return true;
        if (condition === 'child' && (words.includes('niÃƒÂ±') || words.includes('infan') || words.includes('tartr'))) return true;
        if (condition === 'athlete' && (words.includes('depor') || words.includes('atlet') || words.includes('rendi') || words.includes('prote'))) return true;
        return false;
      }) || warning.severity === 'info';
    });

    const tailoredResult: AnalysisResult = {
      ...product.analysis,
      personalizedWarnings: tailoredWarnings.length > 0 ? tailoredWarnings : [
        {
          condition: 'General',
          severity: 'info',
          message: 'No se detectaron riesgos crÃƒÂ­ticos especÃƒÂ­ficos para tu configuraciÃƒÂ³n de salud actual.'
        }
      ]
    };

    setCurrentResult(tailoredResult);
    setCustomText(product.ingredientsText);
    setProductNameInput(product.name);
    saveToHistory(product.name, product.brand, tailoredResult);
    setSelectedProductId(product.id);
  };

  const getGenericScannedProduct = (): ProductPreset => {
    return DEFAULT_SCANNED_PRODUCT;
  };

  const handleAnalyze = async () => {

    setIsLoading(true);
    setErrorMsg(null);
    setCurrentResult(null);

    try {
      const selectedProduct = getGenericScannedProduct();
      applyProduct(selectedProduct);
      setScanStatus(`Mostrando analisis nutricional para ${selectedProduct.name}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Ocurrio un error al preparar el analisis del producto.');
    } finally {
      window.setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PRODUCT_CATALOG.find((product) => product.id === presetId);
    if (!preset) return;
    applyProduct(preset);
  };

  const triggerCameraScan = () => {
    setShowCamera(true);
    setScanError(null);
    setScanStatus('Solicitando acceso a la cÃƒÂ¡mara...');
    setIsScanningPhoto(false);
  };

  const stopCameraScan = () => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    setShowCamera(false);
    setIsScanningPhoto(false);
    setScanStatus('EscÃƒÂ¡ner detenido');
  };

  const handleLogout = () => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthSession(null);
    setShowCamera(false);
    setIsScanningPhoto(false);
    setCurrentResult(null);
    setActiveTab('escanear');
  };

  // Help tips during loading spinner (highly immersive & Peruvian culture context)
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const loadingTips = [
    "Leyendo la informacion nutricional...",
    "Preparando octogonos y advertencias personalizadas...",
    "Cruzando el producto con tu perfil de salud...",
    "Revisando azucares, sodio, cafeina y aditivos..."
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

  useEffect(() => {
    if (!showCamera) {
      return;
    }

    let cancelled = false;

    const startScanner = async () => {
      try {
        const reader = new BrowserMultiFormatReader();

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (cancelled) return;

        if (!devices.length) {
          throw new Error('No se encontrÃƒÂ³ una cÃƒÂ¡mara disponible.');
        }

        const controls = await reader.decodeFromVideoDevice(devices[0].deviceId, videoRef.current ?? undefined, (result, error) => {
          if (cancelled) return;

          if (result) {
            const barcode = result.getText();
            setLastScannedBarcode(barcode);
            setScanStatus(`CÃƒÂ³digo detectado: ${barcode}`);
            setIsScanningPhoto(true);

            const selectedProduct = getGenericScannedProduct();
            applyProduct(selectedProduct);
            setScanError(null);

            window.setTimeout(() => {
              if (!cancelled) {
                scannerControlsRef.current?.stop();
                scannerControlsRef.current = null;
                setShowCamera(false);
                setIsScanningPhoto(false);
              }
            }, 800);
          } else if (error && error.name !== 'NotFoundException') {
            console.debug(error);
          }
        });

        scannerControlsRef.current = controls;
        setScanStatus('Apunta la cÃƒÂ¡mara al cÃƒÂ³digo de barras');
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'No se pudo iniciar el escÃƒÂ¡ner.';
          setScanError(message);
          setScanStatus('No se pudo iniciar el escÃƒÂ¡ner');
        }
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      scannerControlsRef.current?.stop();
      scannerControlsRef.current = null;
    };
  }, [showCamera]);

  if (!authSession) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] text-[#433F3E] flex flex-col justify-center items-center font-sans relative p-0 sm:p-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#7A8B7C_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="w-full h-screen sm:h-[812px] max-w-md bg-[#F8F5F2] border-0 sm:border-8 border-[#E0D8D0] rounded-none sm:rounded-[48px] shadow-none sm:shadow-2xl relative overflow-hidden flex flex-col z-10">
          <div className="flex-1 flex flex-col justify-center px-6 py-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#7A8B7C] text-white flex items-center justify-center shadow-sm">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="font-serif text-3xl font-bold text-[#433F3E] leading-tight">NutriScan</h1>
                  <p className="text-xs text-[#433F3E]/65 leading-relaxed mt-2">
                    Inicia sesion para acceder al escaner, tu perfil de salud y tu historial personal.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="bg-white border border-[#E0D8D0]/70 rounded-3xl p-4 shadow-xs space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#433F3E]/55">Nombre</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(event) => setLoginName(event.target.value)}
                    placeholder="Ej: Valeria"
                    className="w-full text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#7A8B7C] focus:border-[#7A8B7C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#433F3E]/55">Correo</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#7A8B7C] focus:border-[#7A8B7C]"
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#7A8B7C] text-white hover:bg-[#697A6B] hover:shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  Entrar a la app
                </button>
              </form>

              <p className="text-[10px] text-center text-[#433F3E]/45 leading-relaxed">
                Tu sesion se mantendra activa en este dispositivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] text-[#433F3E] flex flex-col justify-center items-center font-sans transition-colors duration-300 relative p-0 sm:p-4 overflow-hidden select-none">
      
      {/* Dynamic desktop background grid details */}
      <div className="absolute inset-0 bg-[radial-gradient(#7A8B7C_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Smartphone Frame Wrapper */}
      <div className="w-full h-screen sm:h-[812px] max-w-md bg-white border-0 sm:border-8 border-[#E0D8D0] rounded-none sm:rounded-[48px] shadow-none sm:shadow-2xl relative overflow-hidden flex flex-col bg-slate-50 z-10">
            
            {/* Mobile View Screen Container */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-[#F8F5F2]">
              
              {/* EscÃƒÂ¡ner de cÃƒÂ³digos de barras en vivo */}
              {showCamera && (
                <div className="absolute inset-0 bg-black z-50 flex flex-col justify-between p-4 pt-10 text-white">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={stopCameraScan}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur"
                    >
                      Cancelar
                    </button>
                    <span className="text-xs tracking-wider text-[#D7BAA5] font-bold uppercase">EscÃƒÂ¡ner Activo</span>
                    <div className="w-10"></div>
                  </div>

                  <div className="flex-1 flex items-center justify-center px-4 relative">
                    <div className="w-full aspect-square border-4 border-dashed border-[#D7BAA5]/70 rounded-[32px] overflow-hidden relative flex flex-col justify-center items-center bg-slate-900">
                      <video
                        ref={videoRef}
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 border-[24px] border-black/20 rounded-[32px]" />
                      <p className="absolute bottom-4 text-[10px] text-white/70 text-center uppercase tracking-widest z-10 px-2 bg-black/40 py-1 rounded-md">
                        {scanStatus}
                      </p>
                    </div>

                    {isScanningPhoto && (
                      <div className="absolute inset-0 bg-black/90 flex flex-col justify-center items-center z-50">
                        <div className="w-12 h-12 rounded-full border-4 border-[#7A8B7C] border-t-transparent animate-spin mb-4" />
                        <p className="text-sm font-semibold tracking-wide text-[#F8F5F2]">Procesando cÃƒÂ³digo detectado...</p>
                        <p className="text-[11px] text-white/50 mt-1">Cargando informaciÃƒÂ³n del producto</p>
                      </div>
                    )}
                  </div>

                  <div className="pb-6 flex flex-col items-center gap-4">
                    <span className="text-xs text-center text-white/70 max-w-xs">
                      {scanError ? scanError : (lastScannedBarcode ? `ÃƒÅ¡ltimo cÃƒÂ³digo: ${lastScannedBarcode}` : 'Apunta la cÃƒÂ¡mara al cÃƒÂ³digo de barras del producto para ver el anÃƒÂ¡lisis.')}
                    </span>
                    
                    <button 
                      onClick={stopCameraScan}
                      className="w-16 h-16 rounded-full border-4 border-[#D7BAA5] p-1.5 focus:outline-none focus:scale-95 transition-transform"
                    >
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-slate-900 font-bold">
                        Ã¢Å“â€¢
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
                    Analizando producto
                  </h3>
                  <p className="text-xs text-center text-[#7A8B7C] mt-2 max-w-xs h-12 leading-relaxed">
                    {loadingTips[loadingTipIndex]}
                  </p>
                  <div className="mt-8 space-y-2 w-full text-center">
                    <div className="inline-block px-3 py-1 bg-[#D7BAA5]/20 text-[#D7BAA5]/90 border border-[#D7BAA5]/30 rounded-full text-[10px] uppercase tracking-wider font-semibold">
                      Analisis nutricional
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

                        {/* HIGH FIDELITY PERUVIAN OCTÃƒâ€œGONOS SYSTEM */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-3 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-[#D7BAA5]" />
                            OctÃƒÂ³gonos Ley NÃ‚Â° 30021
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
                                  No supera los lÃƒÂ­mites de sodio, azÃƒÂºcar, grasas saturadas ni grasas trans dictados por el MINSA.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* NOVA PROCESSING LEVEL */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-2.5">
                            ClasificaciÃƒÂ³n de Procesamiento (NOVA)
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
                              { label: 'EnergÃƒÂ­a', val: currentResult.macronutrients.calories, bg: 'bg-[#F2EDE9]' },
                              { label: 'AzÃƒÂºcares', val: currentResult.macronutrients.sugar, bg: 'bg-[#F2EDE9]' },
                              { label: 'Sodio', val: currentResult.macronutrients.sodium, bg: 'bg-[#F2EDE9]' },
                              { label: 'Grasas Sat.', val: currentResult.macronutrients.saturatedFat, bg: 'bg-[#F2EDE9]' },
                              { label: 'ProteÃƒÂ­na', val: currentResult.macronutrients.protein || 'N/A', bg: 'bg-[#E0D8D0]/40' },
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
                              <span>Aditivos e Ingredientes SintÃƒÂ©ticos</span>
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
                                      add.simplifiedRisk === 'Evitar en ninos' ? 'bg-amber-50 text-amber-700' :
                                      add.simplifiedRisk === 'Consumo moderado' ? 'bg-yellow-50 text-yellow-800' :
                                      'bg-emerald-50 text-emerald-700'
                                    }`}>
                                      {add.simplifiedRisk}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-[#433F3E]/50 font-medium leading-none">
                                    FunciÃƒÂ³n: {add.purpose}
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
                          <div className="flex items-start justify-between gap-3">
                            <h2 className="font-serif text-xl font-bold text-[#433F3E] flex items-center gap-2 min-w-0">
                              Hola, {authSession.name}
                              <Sparkles className="w-4 h-4 text-[#7A8B7C] fill-[#7A8B7C]/10 shrink-0" />
                            </h2>
                            <button
                              onClick={handleLogout}
                              className="p-2 rounded-full text-[#433F3E]/55 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                              title="Cerrar sesion"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-[#433F3E]/70 leading-relaxed">
                            Cuidamos tu salud traduciendo nomenclaturas de ingredientes difÃƒÂ­ciles.
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
                                Ã¢Å¡Â Ã¯Â¸Â Sin filtros de salud activos (Configurar)
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
                              <p className="text-xs font-bold">Escanear codigo</p>
                              <p className="text-[9px] opacity-70">ZXing en navegador</p>
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
                              <p className="text-xs font-bold">Consultar producto</p>
                              <p className="text-[9px] text-[#433F3E]/60">Busqueda guiada</p>
                            </div>
                          </button>
                        </div>

                        {/* MANUAL ENTRY COMPONENT */}
                        <div className="bg-white border border-[#E0D8D0]/60 rounded-3xl p-4 shadow-xs" id="manual-section">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60 mb-2.5">
                            Consulta nutricional
                          </h3>

                          <div className="space-y-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Codigo o nombre del producto (opcional)"
                                value={productNameInput}
                                onChange={(e) => setProductNameInput(e.target.value)}
                                className="w-full text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#7A8B7C] focus:border-[#7A8B7C]"
                              />
                            </div>
                            
                            <div>
                              <textarea
                                id="manual-ingredients-input"
                                placeholder="Ingresa el codigo, nombre del producto u observaciones de la etiqueta."
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
                              onClick={() => handleAnalyze()}
                              className="w-full py-3 rounded-2xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#7A8B7C] text-white hover:bg-[#697A6B] hover:shadow-md"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Analizar producto
                            </button>
                          </div>
                        </div>

                        {/* PRESETS GRIDS SYSTEM - ALIMENTOS PERUANOS POPULARES */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center px-1">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#433F3E]/60">
                              Productos destacados
                            </h3>
                            <span className="text-[10px] text-[#7A8B7C] font-semibold uppercase">Explorar</span>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {PRODUCT_CATALOG.map((preset) => {
                              const isSelected = selectedProductId === preset.id && currentResult;
                              return (
                                <div
                                  key={preset.id}
                                  id={`preset-card-${preset.id}`}
                                  onClick={() => handleLoadPreset(preset.id)}
                                  className="bg-white border border-[#E0D8D0]/60 hover:border-[#7A8B7C] p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:shadow-xs group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#F2EDE9] group-hover:bg-[#E0D8D0]/40 flex items-center justify-center text-lg select-none">
                                      {PRODUCT_BADGES[preset.image] ?? 'PR'}
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
                          <p className="text-sm font-medium text-slate-500">Ã‚Â¿AÃƒÂºn no has hecho consultas?</p>
                          <p className="text-xs text-slate-400 max-w-[200px] mx-auto mt-1 leading-relaxed">
                            AquÃƒÂ­ se guardarÃƒÂ¡n tus anÃƒÂ¡lisis recientes para acceso rÃƒÂ¡pido fuera de lÃƒÂ­nea.
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
