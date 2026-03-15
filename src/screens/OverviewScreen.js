import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fmt, catColors, shadow, shadowSm } from '../utils/theme';
import { Card, SectionTitle, KpiGrid, KpiCard, BarRow, TxRow, EmptyState } from '../components/UI';

export default function OverviewScreen({ navigation }) {
  const { txs, budgets, carryFwd, investments } = useApp();

  const stats = useMemo(() => {
    const inc = txs.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);
    const exp = txs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);
    const inv = investments.reduce((a, i) => a + i.amt, 0);
    const cf  = carryFwd.reduce((a, c) => a + c.amount, 0);
    return { inc, exp, bal: inc - exp, inv, cf };
  }, [txs, investments, carryFwd]);

  const catTotals = useMemo(() => {
    const m = {};
    txs.filter(t => t.type === 'expense').forEach(t => { m[t.cat] = (m[t.cat] || 0) + t.amt; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [txs]);

  const alerts = useMemo(() => {
    const spent = {};
    txs.filter(t => t.type === 'expense').forEach(t => { spent[t.cat] = (spent[t.cat] || 0) + t.amt; });
    return Object.entries(budgets)
      .map(([cat, lim]) => ({ cat, lim, spent: spent[cat] || 0, pct: Math.round((spent[cat] || 0) / lim * 100) }))
      .filter(a => a.pct >= 80 && a.spent > 0)
      .sort((a, b) => b.pct - a.pct);
  }, [txs, budgets]);

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
      {/* Hero balance card */}
      <View style={[S.heroCard, shadow]}>
        <Text style={S.heroLabel}>Net Balance</Text>
        <Text style={[S.heroValue, { color: stats.bal >= 0 ? '#4ADE80' : '#FC8181' }]}>
          {fmt(stats.bal)}
        </Text>
        <Text style={S.heroSub}>After all expenses this month</Text>
        <View style={S.heroRow}>
          <View style={S.heroStat}>
            <Text style={S.heroStatLabel}>Income</Text>
            <Text style={[S.heroStatVal, { color: '#4ADE80' }]}>{fmt(stats.inc)}</Text>
          </View>
          <View style={S.heroDivider} />
          <View style={S.heroStat}>
            <Text style={S.heroStatLabel}>Expenses</Text>
            <Text style={[S.heroStatVal, { color: '#FC8181' }]}>{fmt(stats.exp)}</Text>
          </View>
          <View style={S.heroDivider} />
          <View style={S.heroStat}>
            <Text style={S.heroStatLabel}>Invested</Text>
            <Text style={[S.heroStatVal, { color: '#C4B5FD' }]}>{fmt(stats.inv)}</Text>
          </View>
        </View>
      </View>

      {/* Spending by category */}
      {catTotals.length > 0 && (
        <Card>
          <SectionTitle>Spending by Category</SectionTitle>
          {catTotals.map(([cat, val]) => (
            <BarRow key={cat} label={cat} value={val} max={catTotals[0][1]} color={catColors[cat] || colors.other} />
          ))}
        </Card>
      )}

      {/* Budget alerts */}
      {alerts.length > 0 && (
        <Card>
          <SectionTitle>Budget Alerts</SectionTitle>
          {alerts.map(a => (
            <View key={a.cat} style={S.alertRow}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: 13, color: colors.ink2, fontWeight: '500' }}>{a.cat}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: a.pct >= 100 ? colors.danger : colors.warn }}>
                  {a.pct}%
                </Text>
              </View>
              <View style={S.barTrack}>
                <View style={[S.barFill, {
                  width: `${Math.min(a.pct, 100)}%`,
                  backgroundColor: a.pct >= 100 ? colors.danger : colors.warn,
                }]} />
              </View>
              <Text style={{ fontSize: 11, color: a.pct >= 100 ? colors.danger : colors.warn, marginTop: 4 }}>
                {a.pct >= 100 ? `Over budget by ${fmt(a.spent - a.lim)}` : `${fmt(a.lim - a.spent)} remaining`}
              </Text>
            </View>
          ))}
        </Card>
      )}

      {/* Recent transactions */}
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={S.panelTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ManageTab', { screen: 'Ledger' })}>
            <Text style={{ fontSize: 13, color: colors.accent, fontWeight: '500' }}>View all →</Text>
          </TouchableOpacity>
        </View>
        {txs.length === 0
          ? <EmptyState icon="💸" text={'No transactions yet.\nTap + below to add your first one.'} />
          : txs.slice(0, 8).map(tx => <TxRow key={tx.id} tx={tx} />)}
      </Card>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  heroCard: {
    backgroundColor: colors.header,
    borderRadius: 20,
    padding: 22,
    marginBottom: 14,
  },
  heroLabel: { fontSize: 12, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
  heroValue: { fontSize: 38, fontWeight: '200', letterSpacing: -1, marginTop: 4, marginBottom: 4 },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20 },
  heroRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 14 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  heroStatVal: { fontSize: 15, fontWeight: '500' },
  heroDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 4 },
  panelTitle: { fontSize: 11, fontWeight: '700', color: colors.ink3, letterSpacing: 0.8, textTransform: 'uppercase' },
  alertRow: { marginBottom: 12 },
  barTrack: { height: 6, backgroundColor: colors.surface3, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
});
