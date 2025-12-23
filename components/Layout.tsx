import React from 'react';
import { useData } from '../context/DataContext';

const tabs: { key: string; label: string; description: string }[] = [
  { key: 'home', label: 'الرئيسية', description: 'نظرة عامة على الأداء' },
  { key: 'inventory', label: 'المخزون', description: 'إدارة الشرائح والأجهزة' },
  { key: 'fuel', label: 'الوقود', description: 'مصروفات الوقود اليومية' },
  { key: 'reports', label: 'التقارير', description: 'قوائم العمليات' },
  { key: 'settings', label: 'الإعدادات', description: 'تخصيص النظام' },
];

interface LayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const { currentUser, logout, lastSync, isSyncing, syncToCloud } = useData();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #020617)',
      color: '#e2e8f0',
      fontFamily: 'Arial, sans-serif',
      padding: '24px',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '16px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>لوحة إدارة المبيعات</h1>
          <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>أهلاً {currentUser?.name}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastSync && (
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>
              آخر مزامنة: {new Date(lastSync).toLocaleString('ar-SA')}
            </span>
          )}
          <button
            onClick={syncToCloud}
            disabled={isSyncing}
            style={{
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isSyncing ? 'جاري المزامنة...' : 'مزامنة سحابية'}
          </button>
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '10px 14px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <nav style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              textAlign: 'right',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: activeTab === tab.key ? 'rgba(14,165,233,0.12)' : 'rgba(15,23,42,0.6)',
              color: '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{tab.label}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>{tab.description}</div>
          </button>
        ))}
      </nav>

      <main style={{
        background: 'rgba(15,23,42,0.65)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '18px',
        padding: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {children}
      </main>
    </div>
  );
};
