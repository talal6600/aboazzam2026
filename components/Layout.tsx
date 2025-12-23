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

  const renderTabs = (className?: string) => (
    <nav className={className}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
        >
          <span className="label">{tab.label}</span>
          <span className="hint">{tab.description}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="top-bar">
          <div>
            <p className="eyebrow">لوحة إدارة المبيعات</p>
            <h1 className="title">أهلاً {currentUser?.name}</h1>
            <p className="meta">جاهز للعمل اليومي والميداني</p>
          </div>
          <div className="action-group">
            {lastSync && <span className="meta">آخر مزامنة: {new Date(lastSync).toLocaleString('ar-SA')}</span>}
            <button className="primary-btn" onClick={syncToCloud} disabled={isSyncing}>
              {isSyncing ? 'جاري المزامنة...' : 'مزامنة سحابية'}
            </button>
            <button className="ghost-btn" onClick={logout}>
              تسجيل الخروج
            </button>
          </div>
        </header>

        {renderTabs('nav-grid desktop-nav')}

        <main className="content-panel">
          {children}
          <div className="sticky-footer-space" />
        </main>
      </div>

      {renderTabs('mobile-nav')}
    </div>
  );
};
