import React from 'react';
import {
  BarChart3,
  Boxes,
  CloudCog,
  Fuel,
  Home,
  LogOut,
  Settings,
} from 'lucide-react';
import { useData } from '../context/DataContext';

const tabs: { key: string; label: string; description: string; icon: React.ElementType }[] = [
  { key: 'home', label: 'الرئيسية', description: 'نظرة عامة على الأداء', icon: Home },
  { key: 'inventory', label: 'المخزون', description: 'إدارة الشرائح والأجهزة', icon: Boxes },
  { key: 'fuel', label: 'الوقود', description: 'مصروفات الوقود اليومية', icon: Fuel },
  { key: 'reports', label: 'التقارير', description: 'قوائم العمليات', icon: BarChart3 },
  { key: 'settings', label: 'الإعدادات', description: 'تخصيص النظام', icon: Settings },
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
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
          >
            <div className="tab-header">
              <span className="tab-icon">
                <Icon size={18} />
              </span>
              <div className="tab-copy">
                <span className="label">{tab.label}</span>
                <span className="hint">{tab.description}</span>
              </div>
            </div>
            <span className="tab-caret">›</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="top-bar">
          <div className="top-meta">
            <p className="eyebrow">لوحة إدارة المبيعات</p>
            <div className="title-row">
              <h1 className="title">أهلاً {currentUser?.name}</h1>
              <span className="chip chip-success">نشط الآن</span>
            </div>
            <div className="meta-row">
              <span className="meta">جاهز للعمل اليومي والميداني</span>
              <span className="separator">•</span>
              <span className="meta">تحكم كامل في المبيعات والمخزون</span>
            </div>
          </div>
          <div className="action-group">
            <div className="sync-pill">
              <span className={`status-dot ${isSyncing ? 'syncing' : 'synced'}`} />
              <CloudCog size={16} />
              <div className="sync-copy">
                <span className="label">مزامنة ذكية</span>
                <span className="hint">
                  {isSyncing
                    ? 'جارٍ إرسال البيانات'
                    : lastSync
                    ? `آخر مزامنة: ${new Date(lastSync).toLocaleString('ar-SA')}`
                    : 'لم تتم المزامنة بعد'}
                </span>
              </div>
            </div>
            <button className="primary-btn" onClick={syncToCloud} disabled={isSyncing}>
              {isSyncing ? 'جاري المزامنة...' : 'مزامنة سحابية'}
            </button>
            <button className="ghost-btn" onClick={logout}>
              <LogOut size={16} />
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
