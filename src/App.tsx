/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Map } from './components/Map';
import { Menu } from './components/Menu';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';
import { Footer } from './components/Footer';
import { Ranking } from './components/Ranking';
import { MusicPlayer } from './components/MusicPlayer';
import { GameType, World } from './utils/gameLogic';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [gameState, setGameState] = useState<'login' | 'map' | 'menu' | 'playing' | 'gameover' | 'ranking'>('login');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('🦊');
  const [selectedWorld, setSelectedWorld] = useState<World>('numeros');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [gameType, setGameType] = useState<GameType>('suma');
  const [score, setScore] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatePasswordMsg, setUpdatePasswordMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveringPassword(true);
      } else if (session && !isRecoveringPassword) {
        fetchProfile(session.user.id);
      } else if (!session) {
        setGameState('login');
        setUserName('');
        setUserAvatar('🦊');
        setIsRecoveringPassword(false);
      }
    });

    // Check URL for recovery explicitly as well
    if (window.location.hash.includes('type=recovery')) {
      setIsRecoveringPassword(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('name, avatar').eq('id', userId).single();
    if (data) {
      setUserName(data.name);
      if (data.avatar) setUserAvatar(data.avatar);
      setGameState('map');
    }
  };

  const handleSelectLevel = (world: World, levelId: number) => {
    if (levelId === 1) { // Current restriction: only level 1 is accessible
      setSelectedWorld(world);
      setSelectedLevel(levelId);
      setGameState('menu');
    }
  };

  const startGame = (type: GameType) => {
    setGameType(type);
    setScore(0);
    setGameState('playing');
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState('gameover');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatePasswordMsg('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setUpdatePasswordMsg(error.message);
    } else {
      alert('Contraseña actualizada exitosamente');
      setIsRecoveringPassword(false);
      if (session) fetchProfile(session.user.id);
      else setGameState('login');
      // Remove hash from URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  if (isRecoveringPassword) {
    return (
      <div className="min-h-screen bg-math-pattern flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl border border-stone-200 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-black text-stone-800 mb-6 tracking-tight">Recuperar Contraseña</h2>
          {updatePasswordMsg && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-semibold">{updatePasswordMsg}</div>}
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña..."
              className="px-4 py-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg font-medium shadow-inner"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all text-lg mt-2"
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-math-pattern flex flex-col font-sans pb-24 relative">
      <MusicPlayer />
      {gameState === 'login' && <Login onLogin={() => { }} />}
      {gameState === 'map' && <Map userName={userName} userAvatar={userAvatar} onSelectLevel={handleSelectLevel} onOpenRanking={() => setGameState('ranking')} />}
      {gameState === 'ranking' && <Ranking onBack={() => setGameState('map')} />}
      {gameState === 'menu' && <Menu world={selectedWorld} levelId={selectedLevel} onStart={startGame} onBack={() => setGameState('map')} />}
      {gameState === 'playing' && <Game type={gameType} onGameOver={handleGameOver} onQuit={() => setGameState('menu')} onRestart={() => startGame(gameType)} />}
      {gameState === 'gameover' && <GameOver score={score} type={gameType} onRestart={() => startGame(gameType)} onQuitToMenu={() => setGameState('menu')} />}
      <Footer />
    </div>
  );
}
