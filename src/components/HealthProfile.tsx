import { HEALTH_CONDITIONS } from '../data';
import { HealthConditionId } from '../types';
import { 
  Droplet, 
  Activity, 
  HeartHandshake, 
  Wheat, 
  Milk, 
  Leaf, 
  Smile, 
  TrendingUp, 
  Check, 
  User, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface HealthProfileProps {
  activeConditions: HealthConditionId[];
  onToggleCondition: (id: HealthConditionId) => void;
}

export default function HealthProfile({ activeConditions, onToggleCondition }: HealthProfileProps) {
  
  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case 'Droplet': return <Droplet {...props} className={`${props.className} text-red-500`} />;
      case 'Activity': return <Activity {...props} className={`${props.className} text-indigo-500`} />;
      case 'HeartHandshake': return <HeartHandshake {...props} className={`${props.className} text-pink-500`} />;
      case 'Wheat': return <Wheat {...props} className={`${props.className} text-amber-500`} />;
      case 'Milk': return <Milk {...props} className={`${props.className} text-blue-500`} />;
      case 'Leaf': return <Leaf {...props} className={`${props.className} text-emerald-500`} />;
      case 'Smile': return <Smile {...props} className={`${props.className} text-yellow-500`} />;
      case 'TrendingUp': return <TrendingUp {...props} className={`${props.className} text-purple-500`} />;
      default: return <User {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50" id="health-profile-view">
      {/* Top Welcome Card */}
      <div className="p-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Tu Perfil Nutricional</h2>
            <p className="text-xs text-slate-500">Selecciona tus filtros de salud para personalizar las alertas de los alimentos.</p>
          </div>
        </div>

        {/* Counter badge summary */}
        <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100/40 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-900">
              {activeConditions.length === 0 
                ? 'Ningún filtro activo (análisis genérico)' 
                : `${activeConditions.length} filtro(s) de salud activo(s)`}
            </span>
          </div>
          {activeConditions.length > 0 && (
            <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Personalizado
            </span>
          )}
        </div>
      </div>

      {/* Conditions Bento Grids */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Restricciones y objetivos de salud</h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {HEALTH_CONDITIONS.map((cond, index) => {
            const isActive = activeConditions.includes(cond.id);
            return (
              <motion.button
                id={`health-option-${cond.id}`}
                key={cond.id}
                onClick={() => onToggleCondition(cond.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`text-left p-3.5 rounded-2xl border transition-all flex gap-3 relative overflow-hidden focus:outline-none ${
                  isActive 
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/10 shadow-sm' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Visual select ribbon */}
                {isActive && (
                  <div className="absolute top-0 right-0 h-full w-1.5 bg-indigo-600" />
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-indigo-50' : 'bg-slate-100'
                }`}>
                  {getIcon(cond.iconName)}
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-800 text-sm leading-tight">{cond.label}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{cond.description}</p>
                </div>

                {/* Tactile check circle */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-sm' 
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isActive ? (
                      <Check className="w-3 h-3 text-white stroke-[3px]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {activeConditions.length === 0 && (
          <div className="mt-4 p-3.5 bg-yellow-50/70 border border-yellow-100 rounded-xl flex gap-2.5">
            <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800 leading-snug">
              <strong>Nota:</strong> Al no tener filtros de salud activos, el escáner analizará los productos de acuerdo a las pautas generales de alimentación, sin emitir advertencias de peligro personalizadas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
