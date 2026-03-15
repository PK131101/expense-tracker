import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TXS: '@et_txs',
  RECS: '@et_recs',
  INV: '@et_inv',
  BUD: '@et_bud',
  CF: '@et_cf',
};

const DEFAULT_BUDGETS = {
  Food: 4000, Transport: 1500, Bills: 3000,
  Health: 2000, Entertainment: 2000, Shopping: 3000, Other: 1000,
};

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [txs, setTxsRaw]        = useState([]);
  const [recs, setRecsRaw]       = useState([]);
  const [investments, setInvRaw] = useState([]);
  const [budgets, setBudRaw]     = useState(DEFAULT_BUDGETS);
  const [carryFwd, setCFRaw]     = useState([]);
  const [ready, setReady]        = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [t, r, i, b, c] = await Promise.all(
          Object.values(KEYS).map(k => AsyncStorage.getItem(k))
        );
        if (t) setTxsRaw(JSON.parse(t));
        if (r) setRecsRaw(JSON.parse(r));
        if (i) setInvRaw(JSON.parse(i));
        if (b) setBudRaw(JSON.parse(b));
        if (c) setCFRaw(JSON.parse(c));
      } catch (e) { console.warn('Load error', e); }
      setReady(true);
    })();
  }, []);

  const persist = (key, val) =>
    AsyncStorage.setItem(key, JSON.stringify(val)).catch(() => {});

  const setTxs  = fn => setTxsRaw(p  => { const n = typeof fn === 'function' ? fn(p)  : fn; persist(KEYS.TXS,  n); return n; });
  const setRecs = fn => setRecsRaw(p => { const n = typeof fn === 'function' ? fn(p)  : fn; persist(KEYS.RECS, n); return n; });
  const setInv  = fn => setInvRaw(p  => { const n = typeof fn === 'function' ? fn(p)  : fn; persist(KEYS.INV,  n); return n; });
  const setBud  = fn => setBudRaw(p  => { const n = typeof fn === 'function' ? fn(p)  : fn; persist(KEYS.BUD,  n); return n; });
  const setCF   = fn => setCFRaw(p   => { const n = typeof fn === 'function' ? fn(p)  : fn; persist(KEYS.CF,   n); return n; });

  return (
    <Ctx.Provider value={{ txs, setTxs, recs, setRecs, investments, setInv, budgets, setBud, carryFwd, setCF, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
