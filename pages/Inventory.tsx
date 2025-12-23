import React, { useState } from 'react';
import { SIM_COLORS, SIM_LABELS } from '../constants';
import { useData } from '../context/DataContext';
import { SimType, StockLog } from '../types';

export const Inventory: React.FC = () => {
  const { stock, damaged, stockLogs, updateStock } = useData();
  const [type, setType] = useState<SimType>('jawwy');
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState<StockLog['action']>('add');

  const submit = () => {
    if (quantity <= 0) return;
    updateStock(type, quantity, action);
    setQuantity(1);
  };

  return (
    <div className="split-grid">
      <div className="card-section">
        <h3 style={{ marginTop: 0 }}>إدارة المخزون</h3>
        <div className="form-grid" style={{ marginBottom: 12 }}>
          <div className="field">
            <label>نوع الشريحة</label>
            <select value={type} onChange={(e) => setType(e.target.value as SimType)}>
              <option value="jawwy">{SIM_LABELS.jawwy}</option>
              <option value="sawa">{SIM_LABELS.sawa}</option>
              <option value="multi">{SIM_LABELS.multi}</option>
            </select>
          </div>
          <div className="field">
            <label>الكمية</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>
        <div className="button-row" style={{ marginBottom: 12 }}>
          {[
            { key: 'add', label: 'إضافة' },
            { key: 'return_company', label: 'إرجاع' },
            { key: 'to_damaged', label: 'تالف' },
            { key: 'recover', label: 'استرجاع التالف' },
            { key: 'flush', label: 'إتلاف نهائي' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setAction(btn.key as StockLog['action'])}
              className={`ghost-btn ${action === btn.key ? 'active' : ''}`}
              style={{ borderColor: action === btn.key ? 'rgba(14,165,233,0.8)' : undefined }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <button className="primary-btn" onClick={submit} style={{ width: '100%' }}>
          حفظ الحركة
        </button>

        <div className="items-grid" style={{ marginTop: 16 }}>
          {(['jawwy', 'sawa', 'multi'] as const).map((sim) => (
            <div key={sim} className="list-card">
              <div className="meta">{SIM_LABELS[sim]}</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{stock[sim]} متاح</div>
              <div style={{ fontSize: 12, color: '#f97316' }}>{damaged[sim]} تالف</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-section" style={{ maxHeight: 520, overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>سجل المخزون</h3>
        <div className="list-stack">
          {stockLogs.length === 0 && <span className="meta">لا توجد سجلات</span>}
          {stockLogs.map((log) => (
            <div
              key={log.id}
              className="list-card"
              style={{ borderRight: `4px solid ${SIM_COLORS[log.type]}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{SIM_LABELS[log.type]}</strong>
                <span className="meta">{new Date(log.date).toLocaleString('ar-SA')}</span>
              </div>
              <div className="meta" style={{ marginTop: 4 }}>
                {log.quantity} شريحة | نوع الإجراء: {log.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
