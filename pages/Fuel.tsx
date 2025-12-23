import React, { useState } from 'react';
import { FUEL_LABELS } from '../constants';
import { useData } from '../context/DataContext';
import { FuelLog } from '../types';

export const Fuel: React.FC = () => {
  const { fuelLogs, addFuelLog, removeFuelLog } = useData();
  const [form, setForm] = useState<Omit<FuelLog, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    fuelType: '91',
    amount: 0,
    liters: 0,
    km: 0,
  });

  const submit = () => {
    if (form.liters <= 0 || form.amount <= 0) return;
    addFuelLog({ ...form, date: new Date(form.date).toISOString() });
    setForm((prev) => ({ ...prev, amount: 0, liters: 0, km: 0 }));
  };

  return (
    <div className="split-grid">
      <div className="card-section">
        <h3 style={{ marginTop: 0 }}>تسجيل وقود جديد</h3>
        <div className="form-grid">
          <div className="field">
            <label>التاريخ</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="field">
            <label>نوع الوقود</label>
            <select
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value as FuelLog['fuelType'] })}
            >
              <option value="91">{FUEL_LABELS['91']}</option>
              <option value="95">{FUEL_LABELS['95']}</option>
              <option value="diesel">{FUEL_LABELS.diesel}</option>
            </select>
          </div>
          <div className="field">
            <label>المبلغ (ر.س)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div className="field">
            <label>اللترات</label>
            <input
              type="number"
              value={form.liters}
              onChange={(e) => setForm({ ...form, liters: Number(e.target.value) })}
              min={0}
            />
          </div>
          <div className="field">
            <label>قراءة العداد (كم)</label>
            <input
              type="number"
              value={form.km}
              onChange={(e) => setForm({ ...form, km: Number(e.target.value) })}
              min={0}
            />
          </div>
        </div>
        <button className="primary-btn" onClick={submit} style={{ marginTop: 12 }}>
          إضافة السجل
        </button>
      </div>

      <div className="card-section" style={{ maxHeight: 520, overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>السجلات السابقة</h3>
        <div className="list-stack">
          {fuelLogs.length === 0 && <span className="meta">لا توجد سجلات</span>}
          {fuelLogs.map((log) => (
            <div key={log.id} className="list-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{FUEL_LABELS[log.fuelType]}</strong>
                  <div className="meta">{new Date(log.date).toLocaleString('ar-SA')}</div>
                </div>
                <button className="danger-btn" onClick={() => removeFuelLog(log.id)}>
                  حذف
                </button>
              </div>
              <div className="meta" style={{ marginTop: 4 }}>
                {log.liters} لتر | {log.amount.toFixed(2)} ر.س | {log.km} كم
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
