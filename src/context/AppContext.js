import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TXS: '@et_txs',
  RECS: '@et_recs',
  INV: '@et_inv',
  BUD: '@et_bud',
  CF: '@et_cf',
};

const SEED_TXS = [
  { id: 1, desc: 'March Salary', amt: 85000, cat: 'Salary', type: 'income', date: '2026-03-01', note: '', recur: false },
  { id: 2, desc: 'Swiggy dinner', amt: 540, cat: 'Food', type: 'expense', date: '2026-03-04', note: '', recur: false },
  { id: 3, desc: 'BEST Bus pass', amt: 450, cat: 'Transport', type: 'expense', date: '2026-03-05', note: '', recur: true },
  { id: 4, desc: 'Tata Power bill', amt: 1640, cat: 'Bills', type: 'expense', date: '2026-03-07', note: '', recur: true },
  { id: 5, desc: 'Practo consult', amt: 800, cat: 'Health', type: 'expense', date: '2026-03-09', note: '', recur: false },
  { id: 6, desc: 'Amazon headphones', amt: 2499, cat: 'Shopping', type: 'expense', date: '2026-03-11', note: '', recur: false },
  { id: 7, desc: 'Zepto groceries', amt: 1180, cat: 'Food', type: 'expense', date: '2026-03-14', note: '', recur: false },
];
const SEED_RECS = [
  { id: 1, name: 'Apartment Rent', amt: 18000, cat: 'Rent', type: 'expense', day: 1, active: true },
  { id: 2, name: 'Home Loan EMI', amt: 12500, cat: 'EMI', type: 'expense', day: 5, active: true },
  { id: 3, name: 'Monthly Salary', amt: 85000, cat: 'Salary', type: 'income', day: 1, active: true },
];
const SEED_INV = [
  { id: 1, name: 'Nifty 50 Index Fund', amt: 10000, type: 'SIP', date: '2026-03-05', lockdate: '', sipdate: '2026-04-05', note: 'Auto-debit 5th every month' },
  { id: 2, name: 'PPF Account', amt: 12500, type: 'PPF', date: '2026-01-01', lockdate: '2041-04-01', sipdate: '', note: '15yr lock-in, tax saving u/s 80C' },
];
const SEED_BUD = { Food: 4000, Transport: 1500, Bills: 3000, Health: 2000, Entertainment: 2000, Shopping: 3000, Other: 1000 };
const SEED_CF  = [{ month: '2026-02', label: 'February Surplus', amount: 18400, note: 'Carried from February' }];

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [txs, setTxsRaw]         = useState(SEED_TXS);
  const [recs, setRecsRaw]        = useState(SEED_RECS);
  const [investments, setInvRaw]  = useState(SEED_INV);
  const [budgets, setBudRaw]      = useState(SEED_BUD);
  const [carryFwd, setCFRaw]      = useState(SEED_CF);
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [t, r, i, b, c] = await Promise.all(Object.values(KEYS).map(k => AsyncStorage.getItem(k)));
        if (t) setTxsRaw(JSON.parse(t));
        if (r) setRecsRaw(JSON.parse(r));
        if (i) setInvRaw(JSON.parse(i));
        if (b) setBudRaw(JSON.parse(b));
        if (c) setCFRaw(JSON.parse(c));
      } catch (e) { console.warn('Load error', e); }
      setReady(true);
    })();
  }, []);

  const persist = (key, val) => AsyncStorage.setItem(key, JSON.stringify(val)).catch(() => {});

  const setTxs = fn => setTxsRaw(p => { const n = typeof fn === 'function' ? fn(p) : fn; persist(KEYS.TXS, n); return n; });
  const setRecs = fn => setRecsRaw(p => { const n = typeof fn === 'function' ? fn(p) : fn; persist(KEYS.RECS, n); return n; });
  const setInv = fn => setInvRaw(p => { const n = typeof fn === 'function' ? fn(p) : fn; persist(KEYS.INV, n); return n; });
  const setBud = fn => setBudRaw(p => { const n = typeof fn === 'function' ? fn(p) : fn; persist(KEYS.BUD, n); return n; });
  const setCF  = fn => setCFRaw(p => { const n = typeof fn === 'function' ? fn(p) : fn; persist(KEYS.CF, n); return n; });

  return (
    <Ctx.Provider value={{ txs, setTxs, recs, setRecs, investments, setInv, budgets, setBud, carryFwd, setCF, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
