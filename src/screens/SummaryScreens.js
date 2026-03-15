import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fmt, monthName, catColors, monthlyHistory, shadow } from '../utils/theme';
import { Card, SectionTitle, KpiCard, EmptyState } from '../components/UI';

const MONTHS = [
  { label: 'March 2026',    value: '2026-03' },
  { label: 'February 2026', value: '2026-02' },
  { label: 'January 2026',  value: '2026-01' },
  { label: 'December 2025', value: '2025-12' },
  { label: 'November 2025', value: '2025-11' },
  { label: 'October 2025',  value: '2025-10' },
];

function Row({ label, value, color, hl }) {
  return (
    <View style={[S.row, hl && S.rowHL]}>
      <Text style={[S.rowLabel, hl && { fontWeight: '500', color: colors.ink }]}>{label}</Text>
      <Text style={[S.rowVal, { color: color || colors.ink2 }]}>{value}</Text>
    </View>
  );
}

export function MonthlySummaryScreen({ navigation }) {
  const { txs, investments, carryFwd } = useApp();
  const [idx, setIdx] = useState(0);
  const sel = MONTHS[idx].value;
  const [yr, mo] = sel.split('-').map(Number);
  const isLive = sel === '2026-03';

  const d = useMemo(() => {
    const hist = monthlyHistory[sel] || { income: 0, expense: 0, invested: 0 };
    const inc = isLive ? txs.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0) : hist.income;
    const exp = isLive ? txs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0) : hist.expense;
    const inv = isLive ? investments.reduce((a, i) => a + i.amt, 0) : hist.invested;
    const saved = inc - exp - inv;
    const cfAmt = carryFwd.filter(c => c.month === sel).reduce((a, c) => a + c.amount, 0);
    const cats = {};
    if (isLive) txs.filter(t => t.type === 'expense').forEach(t => { cats[t.cat] = (cats[t.cat] || 0) + t.amt; });
    return { inc, exp, inv, saved, cfAmt, cats, pct: inc > 0 ? Math.round(saved / inc * 100) : 0 };
  }, [sel, txs, investments, carryFwd]);

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
      {/* Month picker */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, flexGrow: 0 }}>
        {MONTHS.map((m, i) => (
          <TouchableOpacity key={m.value} onPress={() => setIdx(i)}
            style={[S.pill, i === idx && S.pillOn]}>
            <Text style={[S.pillTxt, i === idx && S.pillTxtOn]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 9, marginBottom: 12 }}>
        <View style={[S.miniKpi, shadow]}><Text style={S.miniL}>Income</Text><Text style={[S.miniV, { color: colors.ok }]}>{fmt(d.inc)}</Text></View>
        <View style={[S.miniKpi, shadow]}><Text style={S.miniL}>Expenses</Text><Text style={[S.miniV, { color: colors.danger }]}>{fmt(d.exp)}</Text></View>
        <View style={[S.miniKpi, shadow]}><Text style={S.miniL}>Invested</Text><Text style={[S.miniV, { color: colors.inv }]}>{fmt(d.inv)}</Text></View>
      </View>

      <Card>
        <SectionTitle>{monthName(mo - 1)} {yr} — Breakdown</SectionTitle>
        <Row label="Gross Income"           value={fmt(d.inc)}              color={colors.ok} />
        <Row label="Total Expenses"         value={`−${fmt(d.exp)}`}       color={colors.danger} />
        <Row label="Invested"               value={`−${fmt(d.inv)}`}       color={colors.inv} />
        {d.cfAmt > 0 && <Row label="Carried In" value={`+${fmt(d.cfAmt)}`} color={colors.ok} />}
        <Row label="Net Savings / Remaining"
          value={`${d.saved >= 0 ? '+' : ''}${fmt(d.saved)}  (${d.pct}%)`}
          color={d.saved >= 0 ? colors.ok : colors.danger} hl />
      </Card>

      {Object.keys(d.cats).length > 0 && (
        <Card>
          <SectionTitle>Expense Breakdown</SectionTitle>
          {Object.entries(d.cats).sort((a, b) => b[1] - a[1]).map(([cat, val]) => {
            const pct = d.exp > 0 ? Math.round(val / d.exp * 100) : 0;
            return (
              <View key={cat} style={{ marginBottom: 9 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                  <Text style={{ fontSize: 12, color: colors.ink2 }}>{cat}</Text>
                  <Text style={{ fontSize: 11, color: colors.ink3 }}>{fmt(val)} · {pct}%</Text>
                </View>
                <View style={S.barTrack}><View style={[S.barFill, { width: `${pct}%`, backgroundColor: catColors[cat] || '#90a4ae' }]} /></View>
              </View>
            );
          })}
        </Card>
      )}

      <Card>
        <SectionTitle>Carry Forward</SectionTitle>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 12, color: colors.ink2 }}>Available balance</Text>
            <Text style={{ fontSize: 19, fontWeight: '300', color: d.saved >= 0 ? colors.ok : colors.danger }}>{fmt(d.saved)}</Text>
          </View>
          <TouchableOpacity style={S.cfBtn} onPress={() => navigation.navigate('ManageTab', { screen: 'CarryForward' })}>
            <Text style={S.cfBtnTxt}>Carry Forward →</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
}

export function YearlySummaryScreen() {
  const { txs, investments } = useApp();
  const hist = useMemo(() => {
    const liveInc = txs.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);
    const liveExp = txs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);
    const liveInv = investments.reduce((a, i) => a + i.amt, 0);
    return { ...monthlyHistory, '2026-03': { income: liveInc, expense: liveExp, invested: liveInv } };
  }, [txs, investments]);

  const months = Object.keys(hist).sort();
  const tot = months.reduce((acc, k) => {
    acc.i += hist[k].income; acc.e += hist[k].expense; acc.v += hist[k].invested; return acc;
  }, { i: 0, e: 0, v: 0 });
  const totSav = tot.i - tot.e - tot.v;

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: 9, marginBottom: 9 }}>
        <View style={[S.miniKpi, shadow]}><Text style={S.miniL}>YTD Income</Text><Text style={[S.miniV, { color: colors.ok, fontSize: 15 }]}>{fmt(tot.i)}</Text></View>
        <View style={[S.miniKpi, shadow]}><Text style={S.miniL}>YTD Expenses</Text><Text style={[S.miniV, { color: colors.danger, fontSize: 15 }]}>{fmt(tot.e)}</Text></View>
      </View>
      <View style={{ flexDirection: 'row', gap: 9, marginBottom: 12 }}>
        <View style={[S.miniKpi, shadow]}><Text style={S.miniL}>YTD Invested</Text><Text style={[S.miniV, { color: colors.inv, fontSize: 15 }]}>{fmt(tot.v)}</Text></View>
        <View style={[S.miniKpi, shadow]}><Text style={S.miniL}>YTD Savings</Text><Text style={[S.miniV, { color: totSav >= 0 ? colors.ok : colors.danger, fontSize: 15 }]}>{fmt(totSav)}</Text></View>
      </View>

      <Card>
        <SectionTitle>FY 2025–26 — Month by Month</SectionTitle>
        <View style={S.tblHead}>
          {['Month','Income','Expenses','Rate'].map((h, i) => (
            <Text key={h} style={[S.tblH, i > 0 && { textAlign: 'right' }, i === 0 && { flex: 1.3 }, i === 3 && { flex: 0.7 }]}>{h}</Text>
          ))}
        </View>
        {months.map(key => {
          const { income: i, expense: e, invested: v } = hist[key];
          const s = i - e - v; const p = i > 0 ? Math.round(s / i * 100) : 0;
          const [y, m] = key.split('-');
          const live = key === '2026-03';
          return (
            <View key={key} style={[S.tblRow, live && S.tblRowHL]}>
              <Text style={[S.tblC, { flex: 1.3, fontWeight: live ? '500' : '400' }]}>{monthName(parseInt(m) - 1).slice(0, 3)} {y}</Text>
              <Text style={[S.tblC, { flex: 1, textAlign: 'right', color: colors.ok }]}>{fmt(i)}</Text>
              <Text style={[S.tblC, { flex: 1, textAlign: 'right', color: colors.danger }]}>{fmt(e)}</Text>
              <Text style={[S.tblC, { flex: 0.7, textAlign: 'right', color: p >= 20 ? colors.ok : p >= 10 ? colors.warn : colors.danger }]}>{p}%</Text>
            </View>
          );
        })}
        <View style={[S.tblRow, S.tblRowHL, { marginTop: 4 }]}>
          <Text style={[S.tblC, { flex: 1.3, fontWeight: '600' }]}>Total FY</Text>
          <Text style={[S.tblC, { flex: 1, textAlign: 'right', color: colors.ok, fontWeight: '500' }]}>{fmt(tot.i)}</Text>
          <Text style={[S.tblC, { flex: 1, textAlign: 'right', color: colors.danger, fontWeight: '500' }]}>{fmt(tot.e)}</Text>
          <Text style={[S.tblC, { flex: 0.7, textAlign: 'right', fontWeight: '500', color: tot.i > 0 && Math.round(totSav/tot.i*100) >= 20 ? colors.ok : colors.warn }]}>
            {tot.i > 0 ? Math.round(totSav / tot.i * 100) : 0}%
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  pill: { paddingVertical: 5, paddingHorizontal: 13, borderRadius: 20, borderWidth: 0.5, borderColor: colors.border2, marginRight: 6, backgroundColor: colors.surface },
  pillOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  pillTxt: { fontSize: 12, color: colors.ink3 },
  pillTxtOn: { color: '#fff' },
  miniKpi: { flex: 1, backgroundColor: colors.surface, borderRadius: 10, padding: 11, borderWidth: 0.5, borderColor: colors.border },
  miniL: { fontSize: 9, color: colors.ink3, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '500', marginBottom: 4 },
  miniV: { fontSize: 17, fontWeight: '300' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  rowHL: { backgroundColor: colors.accentBg, marginHorizontal: -14, paddingHorizontal: 14 },
  rowLabel: { fontSize: 12, color: colors.ink2, flex: 1 },
  rowVal: { fontSize: 12, fontWeight: '500' },
  barTrack: { height: 5, backgroundColor: colors.surface3, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  cfBtn: { borderWidth: 0.5, borderColor: colors.border2, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
  cfBtnTxt: { fontSize: 12, color: colors.ink2 },
  tblHead: { flexDirection: 'row', paddingBottom: 7, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: 2 },
  tblH: { flex: 1, fontSize: 9, fontWeight: '600', color: colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  tblRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  tblRowHL: { backgroundColor: colors.accentBg, marginHorizontal: -14, paddingHorizontal: 14 },
  tblC: { flex: 1, fontSize: 11, color: colors.ink2 },
});
