import { useState } from 'react';
import { ADDITIVE_GLOSSARY, GlossaryAdditive } from '../data';
import { Search, ShieldCheck, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdditiveGlossary() {
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('todos');

  const filtered = ADDITIVE_GLOSSARY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.code.toLowerCase().includes(search.toLowerCase()) ||
                          item.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = selectedRisk === 'todos' || item.risk === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Riesgo alto':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Evitar en ninos':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Consumo moderado':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Riesgo alto':
        return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
      case 'Evitar en ninos':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'Consumo moderado':
        return <Info className="w-4 h-4 text-yellow-600 shrink-0" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50" id="additive-glossary-view">
      {/* Upper info card */}
      <div className="p-4 bg-white border-b border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Glosario de Aditivos peruanos
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Traducimos la nomenclatura compleja de conservantes, espesantes y colorantes de los empaques peruanos a un nivel de riesgo comprensible.
        </p>

        {/* Search */}
        <div className="relative mt-3">
          <input
            type="text"
            placeholder="Buscar por nombre, codigo (E-102) o funcion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-slate-100 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-transparent"
          />
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Filter categories */}
        <div className="flex gap-1 overflow-x-auto pb-1 mt-3 scrollbar-none">
          {['todos', 'Riesgo alto', 'Evitar en ninos', 'Consumo moderado', 'Riesgo bajo'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors border ${
                selectedRisk === risk
                  ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {risk === 'todos' ? 'Todos' : risk}
            </button>
          ))}
        </div>
      </div>

      {/* Main Glossary list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item, index) => (
            <motion.div
              id={`glossary-item-${item.code.replace(/\s+/g, '-').toLowerCase()}`}
              key={item.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    <h3 className="font-semibold text-slate-800 text-base">{item.name}</h3>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">{item.purpose}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskColor(item.risk)}`}>
                  {getRiskIcon(item.risk)}
                  <span>{item.risk}</span>
                </div>
              </div>

              <div className="mt-2.5">
                <p className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 leading-relaxed">
                  {item.explanation}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[11px]">
                <span className="text-slate-400 font-medium leading-none">Reemplazo saludable:</span>
                <span className="text-indigo-600 font-medium leading-none">{item.alternatives}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-500">No se encontraron aditivos</p>
            <p className="text-xs text-slate-400 mt-1">Prueba con otro termino de busqueda o categoria</p>
          </div>
        )}
      </div>
    </div>
  );
}
