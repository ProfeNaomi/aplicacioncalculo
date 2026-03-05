import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const avatars = ['🦊', '🐱', '🐼', '🐨', '🦁', '🐰', '🐯', '🐻'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setErrorMsg(error.message);
    } else {
      if (!name.trim()) {
        setErrorMsg('El nombre es requerido');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, name: name.trim(), avatar }
          ]);
          if (profileError) console.error(profileError);
        }
        await supabase.auth.signOut();
        setIsLogin(true);
        setPassword('');
        alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Por favor, ingresa tu email primero para recuperar la contraseña.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname + '#type=recovery',
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg('');
      alert('Te hemos enviado un correo. Revisa tu bandeja de entrada o spam.');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl border border-stone-200 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl md:text-5xl font-black text-stone-800 mb-2 tracking-tight drop-shadow-sm">
          Cálculo Mental <span className="text-pink-500">Pro</span>
        </h1>
        <p className="text-stone-600 mb-8 text-sm">
          Guarda todo tu progreso en la nube
        </p>

        {errorMsg && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-sm font-semibold">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo..."
                className="px-4 py-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg font-medium shadow-inner"
                required={!isLogin}
                maxLength={40}
              />

              <div>
                <p className="text-stone-600 mb-2 mt-2 text-sm font-semibold">Elige tu Avatar:</p>
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {avatars.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`text-3xl p-2 rounded-full transition-all ${avatar === a ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110 shadow-md' : 'bg-stone-50 hover:bg-stone-200 hover:scale-105 border border-stone-100'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu email..."
            className="px-4 py-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg font-medium shadow-inner"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña..."
            className="px-4 py-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg font-medium shadow-inner"
            required
            minLength={6}
          />

          {isLogin && (
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-indigo-500 hover:text-indigo-700 font-semibold transition-colors disabled:opacity-50"
                disabled={loading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg mt-2"
          >
            {loading ? 'Cargando...' : isLogin ? <><LogIn size={24} /> Entrar</> : <><UserPlus size={24} /> Registrarme</>}
          </button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            className="text-indigo-600 hover:text-pink-500 font-semibold text-sm transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
