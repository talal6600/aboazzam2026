import React, { useState } from 'react';
import { FUEL_LABELS } from '../constants';
import { useData } from '../context/DataContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, exportData, importData, saveNow } = useData();
  const [target, setTarget] = useState(settings.weeklyTarget);
  const [name, setName] = useState(settings.name);
  const [theme, setTheme] = useState(settings.theme);
  const [preferredFuel, setPreferredFuel] = useState(settings.preferredFuelType);
  const [importText, setImportText] = useState('');

  const saveSettings = () => {
    updateSettings({
      weeklyTarget: target,
      name,
      theme: theme as 'light' | 'dark',
      preferredFuelType: preferredFuel,
    });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '16px',
      }}>
        <h3 style={{ marginTop: 0 }}>إعدادات التطبيق</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>اسم المنشأة</span>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '10px', borderRadius: '10px' }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>الهدف الأسبوعي (ر.س)</span>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              style={{ padding: '10px', borderRadius: '10px' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>السمة</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ padding: '10px', borderRadius: '10px' }}>
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>الوقود المفضل</span>
            <select value={preferredFuel} onChange={(e) => setPreferredFuel(e.target.value)} style={{ padding: '10px', borderRadius: '10px' }}>
              <option value="91">{FUEL_LABELS['91']}</option>
              <option value="95">{FUEL_LABELS['95']}</option>
              <option value="diesel">{FUEL_LABELS.diesel}</option>
            </select>
          </label>
        </div>
        <button onClick={saveSettings} style={{ marginTop: '12px', padding: '12px', borderRadius: '12px', background: '#0ea5e9', color: 'white', border: 'none', width: '100%', fontWeight: 700 }}>
          حفظ الإعدادات
        </button>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '16px',
      }}>
        <h3 style={{ marginTop: 0 }}>النسخ الاحتياطي</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={() => navigator.clipboard.writeText(exportData())}
            style={{ padding: '12px', borderRadius: '12px', background: 'rgba(14,165,233,0.12)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            نسخ بياناتي
          </button>
          <button
            onClick={saveNow}
            style={{ padding: '12px', borderRadius: '12px', background: 'rgba(34,197,94,0.12)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            حفظ محلي الآن
          </button>
        </div>
        <textarea
          placeholder="ألصق بيانات JSON هنا لاستيرادها"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          style={{ width: '100%', minHeight: '160px', borderRadius: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)' }}
        />
        <button
          onClick={() => importData(importText)}
          style={{ marginTop: '8px', padding: '12px', borderRadius: '12px', background: '#f59e0b', color: '#0f172a', border: 'none', width: '100%', fontWeight: 700 }}
        >
          استيراد البيانات
        </button>
      </div>
    </div>
  );
};
