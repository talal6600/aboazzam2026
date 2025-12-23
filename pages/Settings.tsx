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
    <div className="split-grid">
      <div className="card-section">
        <h3 style={{ marginTop: 0 }}>إعدادات التطبيق</h3>
        <div className="form-grid">
          <div className="field">
            <label>اسم المنشأة</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>الهدف الأسبوعي (ر.س)</label>
            <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))} />
          </div>
          <div className="field">
            <label>السمة</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">فاتح</option>
              <option value="dark">داكن</option>
            </select>
          </div>
          <div className="field">
            <label>الوقود المفضل</label>
            <select value={preferredFuel} onChange={(e) => setPreferredFuel(e.target.value)}>
              <option value="91">{FUEL_LABELS['91']}</option>
              <option value="95">{FUEL_LABELS['95']}</option>
              <option value="diesel">{FUEL_LABELS.diesel}</option>
            </select>
          </div>
        </div>
        <button className="primary-btn" onClick={saveSettings} style={{ marginTop: 12 }}>
          حفظ الإعدادات
        </button>
      </div>

      <div className="card-section">
        <h3 style={{ marginTop: 0 }}>النسخ الاحتياطي</h3>
        <div className="button-row" style={{ marginBottom: 12 }}>
          <button className="ghost-btn" onClick={() => navigator.clipboard.writeText(exportData())}>
            نسخ بياناتي
          </button>
          <button className="ghost-btn" onClick={saveNow}>
            حفظ محلي الآن
          </button>
        </div>
        <textarea
          placeholder="ألصق بيانات JSON هنا لاستيرادها"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          style={{ width: '100%', minHeight: 160, borderRadius: 12, padding: 12, background: 'rgba(255,255,255,0.03)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)' }}
        />
        <button className="primary-btn" onClick={() => importData(importText)} style={{ marginTop: 8 }}>
          استيراد البيانات
        </button>
      </div>
    </div>
  );
};
