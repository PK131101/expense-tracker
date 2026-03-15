import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fmt, monthName, shadow } from '../utils/theme';
import { TxRow, EmptyState } from '../components/UI';

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

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  const rem = (firstDay + daysInMonth) % 7;
  if (rem) for (let i = 1; i <= 7 - rem; i++) cells.push({ day: i, cur: false });

  const selTxs = sel ? (dayMap[sel] || []) : [];
  const selExp = selTxs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);
  const selInc = selTxs.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>
      <View style={[S.calCard, shadow]}>
        {/* Nav */}
        <View style={S.nav}>
          <TouchableOpacity onPress={prev} style={S.navBtn}>
            <Text style={S.navBtnTxt}>‹</Text>
          </TouchableOpacity>
          <Text style={S.navTitle}>{monthName(month)} {year}</Text>
          <TouchableOpacity onPress={next} style={S.navBtn}>
            <Text style={S.navBtnTxt}>›</Text>
          </TouchableOpacity>
        </View>

        {/* DOW row */}
        <View style={S.dowRow}>
          {DOW.map((d, i) => <Text key={i} style={S.dow}>{d}</Text>)}
        </View>

        {/* Grid */}
        <View style={S.grid}>
          {cells.map((cell, idx) => {
            if (!cell.cur) return (
              <View key={`x${idx}`} style={S.cellGhost}>
                <Text style={S.cellNumGhost}>{cell.day}</Text>
              </View>
            );
            const ds = `${year}-${pad(month + 1)}-${pad(cell.day)}`;
            const dt = dayMap[ds] || [];
            const dayExp = dt.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);
            const dayInc = dt.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);
            const isToday = cell.day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const isSel = sel === ds;
            const hasTxs = dt.length > 0;
            return (
              <TouchableOpacity
                key={ds} activeOpacity={0.7}
                style={[S.cell, isToday && S.cellToday, isSel && S.cellSel, hasTxs && S.cellHasTxs]}
                onPress={() => setSel(isSel ? null : ds)}>
                <View style={isToday ? S.todayBadge : null}>
                  <Text style={[S.cellNum, isToday && S.cellNumToday, isSel && S.cellNumSel]}>{cell.day}</Text>
                </View>
                {hasTxs && (
                  <View style={S.dotRow}>
                    {dayInc > 0 && <View style={[S.dot, { backgroundColor: colors.ok }]} />}
                    {dayExp > 0 && <View style={[S.dot, { backgroundColor: colors.danger }]} />}
                  </View>
                )}
                {dayExp > 0 && <Text style={S.cellAmt} numberOfLines={1}>-{fmt(dayExp)}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Day detail */}
      {sel && (
        <View style={[S.detailCard, shadow]}>
          <View style={S.detailHeader}>
            <Text style={S.detailDate}>{sel}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {selInc > 0 && <Text style={{ fontSize: 12, color: colors.ok, fontWeight: '600' }}>+{fmt(selInc)}</Text>}
              {selExp > 0 && <Text style={{ fontSize: 12, color: colors.danger, fontWeight: '600' }}>-{fmt(selExp)}</Text>}
            </View>
          </View>
          {selTxs.length > 0
            ? selTxs.map(tx => <TxRow key={tx.id} tx={tx} />)
            : <EmptyState icon="📅" text="No transactions on this day." />}
        </View>
      )}
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  calCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  navBtnTxt: { fontSize: 18, color: colors.ink2, fontWeight: '400' },
  navTitle: { fontSize: 17, fontWeight: '600', color: colors.ink },
  dowRow: { flexDirection: 'row', marginBottom: 8 },
  dow: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.ink3, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.28%', minHeight: 52, padding: 4, borderRadius: 8, alignItems: 'center' },
  cellToday: { backgroundColor: colors.accent + '10' },
  cellSel: { backgroundColor: colors.accent, borderRadius: 10 },
  cellHasTxs: {},
  cellGhost: { width: '14.28%', minHeight: 52, padding: 4, opacity: 0.2 },
  cellNum: { fontSize: 13, fontWeight: '500', color: colors.ink2, textAlign: 'center' },
  cellNumToday: { color: colors.accent, fontWeight: '700' },
  cellNumSel: { color: '#fff' },
  todayBadge: {},
  dotRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  cellAmt: { fontSize: 8, color: colors.danger, marginTop: 1, fontWeight: '500' },
  cellNumGhost: { fontSize: 13, color: colors.ink3 },
  detailCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailDate: { fontSize: 13, fontWeight: '600', color: colors.ink },
});
