export const colors = {
  bg: '#F0F2F8',
  surface: '#FFFFFF',
  surface2: '#F7F8FC',
  surface3: '#ECEEF5',
  header: '#0F1B3D',
  headerText: '#FFFFFF',
  ink: '#0D1117',
  ink2: '#3D4558',
  ink3: '#8892A4',
  border: '#E4E7F0',
  border2: '#CBD0DE',
  accent: '#1A56DB',
  accentBg: '#EBF0FD',
  accentLight: '#D6E4FF',
  ok: '#0A7C4E',
  okBg: '#E3F5EE',
  okLight: '#C6EDD9',
  warn: '#B45309',
  warnBg: '#FEF3C7',
  danger: '#C53030',
  dangerBg: '#FEE8E8',
  inv: '#6D28D9',
  invBg: '#EDE9FE',
  food: '#F97316',
  transport: '#3B82F6',
  bills: '#8B5CF6',
  health: '#EC4899',
  entertainment: '#10B981',
  shopping: '#F59E0B',
  salary: '#059669',
};

export const catColors = {
  Food: '#F97316', Transport: '#3B82F6', Bills: '#8B5CF6',
  Health: '#EC4899', Entertainment: '#10B981', Shopping: '#F59E0B',
  Other: '#6B7280', Salary: '#059669', EMI: '#3B82F6',
  Rent: '#8B5CF6', Freelance: '#059669',
};

export const invTypeColors = {
  SIP: '#7C3AED', 'Mutual Fund': '#2563EB', Stocks: '#059669',
  FD: '#D97706', PPF: '#1D4ED8', NPS: '#7C2D12',
  Gold: '#B45309', 'Real Estate': '#4B5563', Insurance: '#DC2626', Other: '#6B7280',
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
  '2026-03': { income: 0, expense: 0, invested: 0 },
  '2026-02': { income: 80000, expense: 39200, invested: 15000 },
  '2026-01': { income: 82000, expense: 45100, invested: 10000 },
  '2025-12': { income: 95000, expense: 61300, invested: 20000 },
  '2025-11': { income: 78000, expense: 42800, invested: 10000 },
  '2025-10': { income: 72000, expense: 38600, invested: 10000 },
};

export const shadow = {
  shadowColor: '#1A2440',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};

export const shadowSm = {
  shadowColor: '#1A2440',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
};
