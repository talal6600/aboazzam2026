import React from 'react';
import { SIM_LABELS } from '../constants';
import { useData } from '../context/DataContext';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '14px',
  padding: '16px',
};

export const Dashboard: React.FC = () => {
  const { transactions, fuelLogs, stock, settings } = useData();

  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalQuantity = transactions.reduce((sum, t) => sum + t.quantity, 0);
  const fuelSpend = fuelLogs.reduce((sum, f) => sum + f.amount, 0);
  const progress = settings.weeklyTarget
    ? Math.min(100, Math.round((totalSales / settings.weeklyTarget) * 100))
    : 0;

  const latestTransactions = transactions.slice(0, 5);
  const latestFuel = fuelLogs.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>إجمالي المبيعات</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px' }}>{totalSales.toFixed(2)} ر.س</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>عدد الشرائح المباعة</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px' }}>{totalQuantity}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>مصروف الوقود</div>
          <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '6px' }}>{fuelSpend.toFixed(2)} ر.س</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>تحقيق الهدف الأسبوعي</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
            <div style={{ flex: 1, height: '8px', background: '#1f2937', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, background: '#0ea5e9', height: '100%' }} />
            </div>
            <span style={{ fontWeight: 700 }}>{progress}%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>آخر العمليات</h3>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{transactions.length} عملية</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {latestTransactions.length === 0 && <span style={{ color: '#94a3b8' }}>لا توجد بيانات بعد</span>}
            {latestTransactions.map((t) => (
              <div key={t.id} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(14,165,233,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{SIM_LABELS[t.type]}</strong>
                  <span>{new Date(t.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  الكمية: {t.quantity} | المبلغ: {t.amount.toFixed(2)} ر.س
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>حالة المخزون</h3>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>جاهز للتسليم</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
            {(['jawwy', 'sawa', 'multi'] as const).map((type) => (
              <div key={type} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{SIM_LABELS[type]}</div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>{stock[type]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>آخر سجلات الوقود</h3>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{fuelLogs.length} سجل</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {latestFuel.length === 0 && <span style={{ color: '#94a3b8' }}>لا توجد سجلات</span>}
            {latestFuel.map((log) => (
              <div key={log.id} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(148,163,184,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>وقود {log.fuelType}</strong>
                  <span>{new Date(log.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                  {log.liters} لتر | {log.amount.toFixed(2)} ر.س | {log.km} كم
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
