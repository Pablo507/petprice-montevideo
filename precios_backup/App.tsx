import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, Globe, Store, ArrowUpDown, ExternalLink, Loader2, Info, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { searchPricesInMontevideo } from './services/geminiService';
import { ComparisonData, StoreType, PriceResult } from './types';
import PriceChart from './components/PriceChart';
import { generateSearchUrl } from './services/urlUtils';
import localData from './petprice_data.json';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComparisonData | null>(null);
  const [filter, setFilter] = useState<StoreType>(StoreType.ALL);
  const [error, setError] = useState<string | null>(null);

  // Optimización: Función de búsqueda mejorada
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      // 1. Llamada a la IA (Gemini)
      const results = await searchPricesInMontevideo(query);

      // 2. INTEGRACIÓN LOCAL OPTIMIZADA (Fix para "Frost 1.5 kg")
      const q = query.toLowerCase().trim();
      const queryWords = q.split(' ').filter(word => word.length > 0);
      
      const matchedLocal = localData.filter((item: any) => {
        const productName = item.Product_Name.toLowerCase();
        const storeName = item.Source.toLowerCase();
        // Verifica que TODAS las palabras buscadas existan en el nombre o la tienda
        return queryWords.every(word => productName.includes(word) || storeName.includes(word));
      }).map((item: any) => ({
        storeName: item.Source,
        productName: item.Product_Name,
        price: parseFloat(item.Price_Actual_UYU),
        currency: '$U',
        isOnline: true,
        // Detecta si es físico basado en la tienda
        isPhysical: /tienda inglesa|disco|devoto|mundo mascota/i.test(item.Source),
        lastUpdated: '15 Feb 2026',
        // USA LA UTILIDAD PARA EVITAR 404
        link: generateSearchUrl(item.Source, item.Product_Name),
        location: 'Montevideo'
      }));

      // Fusionar resultados priorizando locales si hay coincidencia exacta
      if (matchedLocal.length > 0) {
        // Filtramos duplicados que la IA podría haber traído de la misma tienda
        const aiResults = results.results.filter(aiItem => 
          !matchedLocal.some(localItem => 
            localItem.storeName === aiItem.storeName && 
            localItem.productName.toLowerCase().includes(queryWords[0])
          )
        );
        results.results = [...matchedLocal, ...aiResults];
      }

      setData(results);
    } catch (err) {
      setError('Error al conectar con el índice 2026. Revisa tu conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sugerencia: Efecto para buscar automáticamente al hacer click en tendencias
  useEffect(() => {
    if (query === 'Frost Adulto 15kg' || query === 'Royal Canin Mini Adult' || query === 'Pro Plan Adulto') {
      handleSearch();
    }
  }, [query]);

  const filteredResults = data?.results.filter(item => {
    if (filter === StoreType.ALL) return true;
    if (filter === StoreType.PHYSICAL) return item.isPhysical;
    if (filter === StoreType.ONLINE) return item.isOnline && !item.isPhysical;
    return true;
  }) || [];

  return (
    <div className="min-h-screen pb-12 bg-slate-50 selection:bg-violet-200">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-200">
              <ShoppingCart className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-800">Pet<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Price</span> <span className="text-slate-400">Montevideo</span></span>
          </div>
          <div className="hidden sm:flex items-center text-xs font-bold text-slate-500 gap-1 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            Montevideo 2026
          </div>
        </div>
      </nav>

      <div className="bg-white pt-12 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold mb-6 border border-violet-100">
            <Sparkles className="w-3 h-3" />
            Índice de Precios 2026 Actualizado
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Tus compras en Montevideo, <span className="text-violet-600">inteligentes.</span>
          </h1>
          
          <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca comida: Frost, Royal Canin, Pro Plan..."
              className="w-full pl-14 pr-36 py-5 bg-white border-2 border-slate-100 rounded-3xl shadow-2xl shadow-orange-100/40 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-lg"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold text-slate-400">
            <span className="text-slate-300">Tendencias:</span>
            <button onClick={() => setQuery('Frost Adulto 15kg')} className="hover:text-violet-600 transition-colors">Frost</button>
            <button onClick={() => setQuery('Royal Canin Mini Adult')} className="hover:text-violet-600 transition-colors">Royal Canin</button>
            <button onClick={() => setQuery('Pro Plan Adulto')} className="hover:text-violet-600 transition-colors">Pro Plan</button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-2xl flex items-center gap-4 mb-8">
            <AlertCircle className="w-6 h-6 shrink-0 text-rose-500" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-[2rem] p-16 shadow-2xl border border-slate-100 text-center">
            <Loader2 className="w-20 h-20 text-violet-600 animate-spin mx-auto mb-8" />
            <h3 className="text-2xl font-black text-slate-800">Escaneando Montevideo 2026</h3>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Análisis y Gráfico */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-[2rem] p-8 shadow-2xl">
              <div className="flex items-start gap-6">
                <Info className="w-8 h-8 text-white shrink-0" />
                <div>
                  <h2 className="text-2xl font-black mb-3">Análisis del Mercado</h2>
                  <p className="text-violet-50 text-lg font-medium">{data.analysis}</p>
                </div>
              </div>
            </div>

            <PriceChart data={data.results} />

            {/* Listado de Resultados */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                Resultados encontrados
                <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded-full">{filteredResults.length}</span>
              </h2>
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
                {(['ALL', 'PHYSICAL', 'ONLINE'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(StoreType[t as keyof typeof StoreType])}
                    className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${filter === StoreType[t as keyof typeof StoreType] ? 'bg-white text-violet-600 shadow-md' : 'text-slate-500'}`}
                  >
                    {t === 'ALL' ? 'TODOS' : t === 'PHYSICAL' ? 'FÍSICO' : 'ONLINE'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResults.map((item, idx) => (
                <div key={idx} className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-violet-200 transition-all flex flex-col justify-between group">
                  <div>
                    <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-xl ${item.isOnline && !item.isPhysical ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.isOnline && !item.isPhysical ? 'DIGITAL' : 'PRESENCIAL'}
                    </span>
                    <div className="mt-4 mb-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.storeName}</h3>
                      <p className="text-xl font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors">
                        {item.productName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mb-6 pt-2 border-t border-slate-50">
                      <span className="text-3xl font-black text-slate-900">
                        <span className="text-violet-600 text-xl mr-1">{item.currency}</span>
                        {item.price.toLocaleString('es-UY')}
                      </span>
                    </div>
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 hover:bg-violet-600 text-white rounded-2xl text-sm font-black transition-all"
                  >
                    Ir a la tienda <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-20 shadow-2xl border border-slate-100 text-center max-w-2xl mx-auto">
            <ArrowUpDown className="w-12 h-12 text-violet-500 mx-auto mb-8" />
            <h3 className="text-3xl font-black text-slate-800 mb-4">Ahorra en 2026</h3>
            <p className="text-slate-500 text-lg leading-relaxed">
              Busca cualquier alimento para mascotas. Escaneamos precios en tiempo real para Montevideo.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
