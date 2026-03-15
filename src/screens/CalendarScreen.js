import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fmt, monthName, shadow } from '../utils/theme';
import { Card, TxRow, EmptyState } from '../components/UI';

const DOW = ['S','M','T','W','T','F','S'];
const pad = n => String(n).padStart(2, '0');

export default function CalendarScreen() {
  const { txs } = useApp();
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sel, setSel]     = useState(null);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSel(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSel(null); };

  const dayMap = useMemo(() => {
    const m = {};
    txs.forEach(t => { if (!m[t.date]) m[t.date] = []; m[t.date].push(t); });
    return m;
  }, [txs]);

  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  const rem = (firstDay + daysInMonth) % 7;
  if (rem) for (let i = 1; i <= 7 - rem; i++) cells.push({ day: i, cur: false });

  const selTxs = sel ? (dayMap[sel] || []) : [];

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
      <Card>
        {/* Nav */}
        <View style={S.nav}>
          <TouchableOpacity onPress={prev} style={S.navBtn}><Text style={S.navTxt}>‹</Text></TouchableOpacity>
          <Text style={S.navTitle}>{monthName(month)} {year}</Text>
          <TouchableOpacity onPress={next} style={S.navBtn}><Text style={S.navTxt}>›</Text></TouchableOpacity>
        </View>
        {/* DOW */}
        <View style={S.dowRow}>{DOW.map((d, i) => <Text key={i} style={S.dow}>{d}</Text>)}</View>
        {/* Grid */}
        <View style={S.grid}>
          {cells.map((cell, idx) => {
            if (!cell.cur) return <View key={`x${idx}`} style={S.cellOther}><Text style={S.cellNumOther}>{cell.day}</Text></View>;
            const ds = `${year}-${pad(month + 1)}-${pad(cell.day)}`;
            const dt = dayMap[ds] || [];
            const exp = dt.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);
            const inc = dt.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);
            const isToday = cell.day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const isSel = sel === ds;
            return (
              <TouchableOpacity key={ds} activeOpacity={0.75}
                style={[S.cell, isToday && S.cellToday, isSel && S.cellSel]}
                onPress={() => setSel(isSel ? null : ds)}>
                <Text style={[S.cellNum, isToday && { color: colors.accent }]}>{cell.day}</Text>
                {dt.length > 0 && (
                  <View style={S.dotRow}>
                    {dt.slice(0, 3).map((t, i) => (
                      <View key={i} style={[S.dot, { backgroundColor: t.type === 'income' ? colors.ok : colors.danger }]} />
                    ))}
                  </View>
                )}
                {exp > 0 && <Text style={S.cellExp} numberOfLines={1}>-{fmt(exp)}</Text>}
                {inc > 0 && <Text style={S.cellInc} numberOfLines={1}>+{fmt(inc)}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {sel && (
        <Card>
          <Text style={S.detTitle}>{sel} — {selTxs.length} transaction{selTxs.length !== 1 ? 's' : ''}</Text>
          {selTxs.length > 0
            ? selTxs.map(tx => <TxRow key={tx.id} tx={tx} />)
            : <EmptyState text="No transactions on this day." />}
        </Card>
      )}
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  navBtn: { paddingVertical: 5, paddingHorizontal: 14, borderWidth: 0.5, borderColor: colors.border2, borderRadius: 6 },
  navTxt: { fontSize: 17, color: colors.ink2 },
  navTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  dowRow: { flexDirection: 'row', marginBottom: 4 },
  dow: { flex: 1, textAlign: 'center', fontSize: 9, fontWeight: '600', color: colors.ink3, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', minHeight: 58, borderWidth: 0.5, borderColor: colors.border, padding: 3, borderRadius: 4 },
  cellToday: { borderColor: colors.accent, backgroundColor: colors.accentBg },
  cellSel: { borderColor: colors.accent, backgroundColor: colors.accentBg },
  cellOther: { width: '14.28%', minHeight: 58, padding: 3, opacity: 0.28 },
  cellNum: { fontSize: 10, fontWeight: '500', color: colors.ink2 },
  cellNumOther: { fontSize: 10, color: colors.ink3 },
  dotRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  cellExp: { fontSize: 8, color: colors.danger, marginTop: 1 },
  cellInc: { fontSize: 8, color: colors.ok, marginTop: 1 },
  detTitle: { fontSize: 10, fontWeight: '600', color: colors.ink, letterSpacing: 0.7, marginBottom: 12, textTransform: 'uppercase' },
});
