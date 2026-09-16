'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-[var(--radius-card)] shadow-[var(--shadow-bar)] max-w-sm w-full">
        <h1 className="font-sans font-bold text-2xl text-ink mb-6 text-center">Coastlane Admin</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-line rounded p-2 focus:outline-none focus:border-azure"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-line rounded p-2 focus:outline-none focus:border-azure"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-azure text-white font-semibold rounded p-3 hover:bg-azure-ink disabled:opacity-50 transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
