import React from 'react';
import { Lock, Play, Map as MapIcon, LogOut, Trophy } from 'lucide-react';
import { supabase } from '../lib/supabase';

export type World = 'numeros' | 'algebra' | 'geometria' | 'estadistica';

const worldsData: Record<World, { id: number, name: string, locked: boolean }[]> = {
  numeros: [
    { id: 1, name: 'Números Naturales', locked: false },
    { id: 2, name: 'Números Enteros', locked: true },
    { id: 3, name: 'Números Racionales', locked: true },
    { id: 4, name: 'Números Irracionales', locked: true },
    { id: 5, name: 'Números Reales', locked: true },
    { id: 6, name: 'Números Complejos', locked: true },
  ],
  algebra: [
    { id: 1, name: 'Conceptos Básicos', locked: false },
    { id: 2, name: 'Ecuaciones y Desigualdades', locked: true },
    { id: 3, name: 'Sistemas de Ecuaciones', locked: true },
    { id: 4, name: 'Polinomios y Funciones', locked: true },
  ],
  geometria: [
    { id: 1, name: 'Figuras 2D', locked: false },
    { id: 2, name: 'Figuras 3D', locked: true },
    { id: 3, name: 'Trigonometría Básica', locked: true },
    { id: 4, name: 'Geometría Analítica', locked: true },
  ],
  estadistica: [
    { id: 1, name: 'Datos y Gráficos', locked: false },
    { id: 2, name: 'Medidas de Tendencia', locked: true },
    { id: 3, name: 'Probabilidad Básica', locked: true },
    { id: 4, name: 'Distribuciones', locked: true },
  ],
};

const worldNames: Record<World, string> = {
  numeros: 'Números',
  algebra: 'Álgebra',
  geometria: 'Geometría',
  estadistica: 'Estadística'
};

export function Map({ userName, userAvatar, onSelectLevel, onOpenRanking }: { userName: string, userAvatar: string, onSelectLevel: (world: World, levelId: number) => void, onOpenRanking: () => void }) {
  const [currentWorld, setCurrentWorld] = React.useState<World>('numeros');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 py-8 overflow-y-auto w-full relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={onOpenRanking}
          className="flex items-center gap-2 bg-yellow-400/90 hover:bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full shadow-md transition-all font-semibold border border-yellow-500"
          title="Ver Ranking"
        >
          <Trophy size={20} /> <span className="hidden md:inline">Ranking</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-stone-800 px-4 py-2 rounded-full shadow-md transition-all font-semibold border border-stone-200"
          title="Cerrar sesión"
        >
          <LogOut size={20} /> <span className="hidden md:inline">Salir</span>
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {/* Selector de Planetas/Mundos */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(Object.keys(worldNames) as World[]).map((w) => (
            <button
              key={w}
              onClick={() => setCurrentWorld(w)}
              className={`px-6 py-3 rounded-2xl font-black text-lg shadow-md transition-all flex items-center gap-2 border-2 ${currentWorld === w
                ? 'bg-pink-500 text-white border-pink-600 scale-105 shadow-pink-500/50'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:scale-105'
                }`}
            >
              Planeta {worldNames[w]}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <MapIcon className="text-pink-500" size={32} />
          <h2 className="text-3xl md:text-3xl font-black text-stone-800 text-center">
            Mapa de <span className="text-pink-500">{worldNames[currentWorld]}</span>
          </h2>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <p className="text-stone-600 text-xl m-0 leading-tight text-center">
            Hola <span className="font-bold text-stone-800 text-2xl">{userName}</span>,<br />tu <span className="text-3xl">{userAvatar || '🦊'}</span> te espera en los planetas descubiertos.
          </p>
        </div>

        <div className="flex flex-col gap-8 relative px-4 md:px-0">
          {/* Línea conectora central (visible en desktop) */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-2 bg-stone-300 rounded-full -ml-1 z-0"></div>
          {/* Línea conectora lateral (visible en móvil) */}
          <div className="md:hidden absolute left-12 top-8 bottom-8 w-2 bg-stone-300 rounded-full z-0"></div>

          {worldsData[currentWorld].map((level, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={level.id} className={`relative z-10 flex items-center gap-6 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} w-full`}>

                {/* Nodo Circular (Planetita) */}
                <div
                  className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full flex items-center justify-center shadow-xl border-4 z-10 overflow-hidden
                    ${level.locked
                      ? 'bg-stone-300 border-stone-400'
                      : 'bg-gradient-to-br from-indigo-400 to-purple-600 border-indigo-300 cursor-pointer hover:scale-110 transition-transform hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]'
                    } md:mx-auto`}
                  onClick={() => !level.locked && onSelectLevel(currentWorld, level.id)}
                >
                  {/* Detalles de iluminación para que parezca un planeta */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4)_0%,_transparent_60%)]"></div>

                  {level.locked ? (
                    <Lock className="text-stone-500 z-10" size={32} />
                  ) : (
                    <div className="z-10 text-5xl md:text-6xl drop-shadow-md animate-bounce-slow">
                      {userAvatar || '🦊'}
                    </div>
                  )}
                </div>

                {/* Tarjeta de Nivel */}
                <div className={`flex-1 ${isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                  <div
                    className={`p-6 rounded-2xl backdrop-blur-md border shadow-md
                      ${level.locked
                        ? 'bg-white/50 border-stone-200'
                        : 'bg-white border-stone-200 cursor-pointer hover:bg-stone-50 transition-colors'
                      }`}
                    onClick={() => !level.locked && onSelectLevel(currentWorld, level.id)}
                  >
                    <div className="text-sm font-bold text-indigo-500 mb-1 tracking-widest uppercase">Nivel {level.id}</div>
                    <h3 className={`text-2xl font-black ${level.locked ? 'text-stone-400' : 'text-stone-800'}`}>
                      {level.name}
                    </h3>
                    {level.locked && (
                      <p className="text-stone-500 text-sm mt-2">Bloqueado. Supera los niveles anteriores.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
