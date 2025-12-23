import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export const Login: React.FC = () => {
  const { login } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (!ok) setError('بيانات الدخول غير صحيحة');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a, #0b1132)', color: '#e2e8f0' }}>
      <form onSubmit={submit} style={{
        width: '360px',
        background: 'rgba(15,23,42,0.8)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 16px' }}>تسجيل الدخول</h2>
        <p style={{ textAlign: 'center', marginTop: 0, color: '#94a3b8' }}>استخدم بيانات المشرف الافتراضية: admin / password</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>اسم المستخدم</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '10px', borderRadius: '10px' }}
              required
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>كلمة المرور</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px', borderRadius: '10px' }}
              required
            />
          </label>
          {error && <div style={{ color: '#f87171', fontSize: '14px' }}>{error}</div>}
          <button type="submit" style={{ padding: '12px', borderRadius: '12px', background: '#0ea5e9', color: 'white', border: 'none', fontWeight: 700 }}>
            دخول
          </button>
        </div>
      </form>
    </div>
  );
};
