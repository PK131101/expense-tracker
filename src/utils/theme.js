export const colors = {
  bg: '#f5f6f8',
  surface: '#ffffff',
  surface2: '#f5f6f8',
  surface3: '#edeef2',
  ink: '#0f1117',
  ink2: '#4a4f5e',
  ink3: '#9098ab',
  border: '#e2e4ea',
  border2: '#c8ccd8',
  accent: '#1a56db',
  accentBg: '#e8efff',
  ok: '#0d7a4e',
  okBg: '#e6f7f0',
  warn: '#b45309',
  warnBg: '#fef3c7',
  danger: '#c0392b',
  dangerBg: '#fdf0ee',
  inv: '#6d28d9',
  invBg: '#ede9fe',
};

export const catColors = {
  Food: '#ff9800', Transport: '#2196f3', Bills: '#9c27b0',
  Health: '#e91e63', Entertainment: '#4caf50', Shopping: '#ffc107',
  Other: '#90a4ae', Salary: '#0d7a4e', EMI: '#2196f3', Rent: '#9c27b0',
  Freelance: '#0d7a4e',
};

export const invTypeColors = {
  SIP: '#6d28d9', 'Mutual Fund': '#1a56db', Stocks: '#0d7a4e',
  FD: '#b45309', PPF: '#1565c0', NPS: '#880e4f',
  Gold: '#f57f17', 'Real Estate': '#546e7a', Insurance: '#e65100', Other: '#90a4ae',
};

export const fmt = n => '₹' + Math.round(n).toLocaleString('en-IN');

export const monthName = m =>
  ['January','February','March','April','May','June',
   'July','August','September','October','November','December'][m];

export const expenseCats = ['Food','Transport','Bills','Health','Entertainment','Shopping','Other'];
export const incomeCats  = ['Salary','Freelance','Other'];
export const invTypes    = ['Mutual Fund','SIP','Stocks','FD','PPF','NPS','Gold','Real Estate','Insurance','Other'];

export const todayStr = () => new Date().toISOString().slice(0, 10);

export const daysUntil = dateStr => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
};

export const monthlyHistory = {
  '2026-03': { income: 85000, expense: 0,     invested: 10000 },
  '2026-02': { income: 80000, expense: 39200,  invested: 15000 },
  '2026-01': { income: 82000, expense: 45100,  invested: 10000 },
  '2025-12': { income: 95000, expense: 61300,  invested: 20000 },
  '2025-11': { income: 78000, expense: 42800,  invested: 10000 },
  '2025-10': { income: 72000, expense: 38600,  invested: 10000 },
};

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};
