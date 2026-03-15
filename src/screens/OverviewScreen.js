import React, { useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fmt, catColors, shadow } from '../utils/theme';
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

  const maxCat = catTotals[0]?.[1] || 1;

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
      <KpiGrid>
        <KpiCard label="Income"         value={fmt(stats.inc)} color={colors.ok}     sub="This month" />
        <KpiCard label="Expenses"       value={fmt(stats.exp)} color={colors.danger}  sub="This month" />
        <KpiCard label="Net Balance"    value={fmt(stats.bal)} color={stats.bal >= 0 ? colors.ok : colors.danger} sub="Running" />
        <KpiCard label="Invested"       value={fmt(stats.inv)} color={colors.inv}     sub="Committed" />
        <KpiCard label="Carried Fwd"   value={fmt(stats.cf)}  color={colors.ok}     sub="Prev months" />
      </KpiGrid>

      {catTotals.length > 0 && (
        <Card>
          <SectionTitle>Spending by Category</SectionTitle>
          {catTotals.map(([cat, val]) => (
            <BarRow key={cat} label={cat} value={val} max={maxCat} color={catColors[cat] || '#90a4ae'} />
          ))}
        </Card>
      )}

      {alerts.length > 0 && (
        <Card>
          <SectionTitle>Budget Alerts</SectionTitle>
          {alerts.map(a => (
            <View key={a.cat} style={S.alertRow}>
              <View style={S.alertTop}>
                <Text style={S.alertCat}>{a.cat}</Text>
                <Text style={[S.alertPct, { color: a.pct >= 100 ? colors.danger : colors.warn }]}>{a.pct}%</Text>
              </View>
              <View style={S.barTrack}>
                <View style={[S.barFill, { width: `${Math.min(a.pct, 100)}%`, backgroundColor: a.pct >= 100 ? colors.danger : colors.warn }]} />
              </View>
              <Text style={{ fontSize: 11, color: a.pct >= 100 ? colors.danger : colors.warn, marginTop: 3 }}>
                {a.pct >= 100 ? `Over by ${fmt(a.spent - a.lim)}` : `${fmt(a.lim - a.spent)} remaining`}
              </Text>
            </View>
          ))}
        </Card>
      )}

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={S.panelTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ManageTab', { screen: 'Ledger' })}>
            <Text style={{ fontSize: 12, color: colors.accent }}>View all →</Text>
          </TouchableOpacity>
        </View>
        {txs.length === 0
          ? <EmptyState text="No transactions yet. Tap ＋ to add one." />
          : txs.slice(0, 8).map(tx => <TxRow key={tx.id} tx={tx} />)}
      </Card>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  panelTitle: { fontSize: 10, fontWeight: '600', color: colors.ink, letterSpacing: 0.7, textTransform: 'uppercase' },
  alertRow: { marginBottom: 10 },
  alertTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  alertCat: { fontSize: 12, color: colors.ink2 },
  alertPct: { fontSize: 12, fontWeight: '500' },
  barTrack: { height: 5, backgroundColor: colors.surface3, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
});
