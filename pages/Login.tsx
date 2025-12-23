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
    <div className="app-shell" style={{ justifyContent: 'center' }}>
      <div className="card" style={{ width: 'min(420px, 100%)', margin: '0 auto' }}>
        <form onSubmit={submit} className="page-stack">
          <div>
            <p className="eyebrow">نظام المبيعات</p>
            <h2 style={{ margin: '4px 0 8px' }}>تسجيل الدخول</h2>
            <p className="meta">استخدم بيانات المشرف الافتراضية: admin / password</p>
          </div>
          <div className="field">
            <label>اسم المستخدم</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label>كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: '#f87171', fontSize: 14 }}>{error}</div>}
          <button className="primary-btn" type="submit">
            دخول
          </button>
        </form>
      </div>
    </div>
  );
};
