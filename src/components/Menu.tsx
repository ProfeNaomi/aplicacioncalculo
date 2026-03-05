import React, { useState, useEffect } from 'react';
import { GameType, World } from '../utils/gameLogic';
import { Plus, Minus, X, Divide, Hash, Layers, Trophy, ArrowLeft, Zap, Box } from 'lucide-react';
import { supabase } from '../lib/supabase';

const gamesNumeros: { type: GameType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'suma', label: 'Suma de naturales', icon: <Plus size={32} />, color: 'bg-blue-500' },
  { type: 'resta', label: 'Resta de naturales', icon: <Minus size={32} />, color: 'bg-red-500' },
  { type: 'multiplicacion', label: 'Multiplicación', icon: <X size={32} />, color: 'bg-green-500' },
  { type: 'division', label: 'División', icon: <Divide size={32} />, color: 'bg-yellow-500' },
  { type: 'factores', label: 'Descomposición', icon: <Hash size={32} />, color: 'bg-purple-500' },
  { type: 'combinada', label: 'Oper. Combinada', icon: <Layers size={32} />, color: 'bg-orange-500' },
  { type: 'potencia', label: 'Potencias', icon: <Zap size={32} />, color: 'bg-indigo-500' },
  { type: 'raiz', label: 'Raíces Cuadradas', icon: <Box size={32} />, color: 'bg-teal-500' },
];

const gamesAlgebra: { type: GameType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'factorizacion', label: 'Transformar a Factorización', icon: <Hash size={32} />, color: 'bg-indigo-500' },
  { type: 'producto_notable', label: 'Transformar a Producto Notable', icon: <Layers size={32} />, color: 'bg-purple-500' }
];

const gamesByWorld: Record<World, { type: GameType; label: string; icon: React.ReactNode; color: string }[]> = {
  numeros: gamesNumeros,
  algebra: gamesAlgebra,
  geometria: [],
  estadistica: []
};

const worldTitles: Record<World, string> = {
  numeros: 'Números Naturales',
  algebra: 'Conceptos Básicos de Álgebra',
  geometria: 'Figuras 2D - Próximamente',
  estadistica: 'Datos y Gráficos - Próximamente'
};

export function Menu({ world, levelId, onStart, onBack }: { world: World, levelId: number, onStart: (type: GameType) => void, onBack: () => void }) {
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('high_scores')
          .select('game_type, score')
          .eq('user_id', user.id)
          .then(({ data }) => {
            if (data) {
              const scores: Record<string, number> = {};
              data.forEach((s: any) => scores[s.game_type] = s.score);
              setHighScores(scores);
            }
          });
      }
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative bg-universe overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full shadow-md transition-all font-semibold border border-white/20 backdrop-blur-md"
        >
          <ArrowLeft size={20} /> Volver al Mapa
        </button>
      </div>

      <div className="text-pink-400 font-bold tracking-widest uppercase mb-2 mt-8 md:mt-0 relative z-10">Nivel {levelId}</div>
      <h1 className="text-4xl md:text-6xl font-black text-white mb-2 text-center tracking-tight drop-shadow-lg relative z-10">
        {worldTitles[world].split(' ').map((word, i) => (
          <span key={i} className={i === 1 ? 'text-pink-400' : ''}>{word} </span>
        ))}
      </h1>
      <p className="text-indigo-200 mb-12 text-center max-w-md relative z-10">
        Mejora tu agilidad mental. Tienes 7 segundos por pregunta y 3 vidas. ¡Elige un modo de juego!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl relative z-10">
        {gamesByWorld[world].length === 0 && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center text-white text-xl p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            Aún estamos construyendo este mundo. ¡Vuelve pronto!
          </div>
        )}
        {gamesByWorld[world].map((game) => (
          <button
            key={game.type}
            onClick={() => onStart(game.type)}
            className={`${game.color} hover:opacity-90 transition-all transform hover:scale-105 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-xl border border-black/10`}
          >
            <div className="bg-white/20 p-4 rounded-full">
              {game.icon}
            </div>
            <span className="font-bold text-xl text-center">{game.label}</span>
            <div className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full text-sm font-semibold">
              <Trophy size={14} className="text-yellow-300" />
              <span>Récord: {highScores[game.type] || 0}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
