import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadow } from '../utils/theme';

export function Card({ children, style }) {
  return <View style={[card.wrap, shadow, style]}>{children}</View>;
}

export function SectionTitle({ children }) {
  return <Text style={card.title}>{children}</Text>;
}

export function KpiGrid({ children }) {
  return <View style={card.kpiGrid}>{children}</View>;
}

export function KpiCard({ label, value, color, sub }) {
  return (
    <View style={[card.kpi, shadow]}>
      <Text style={card.kpiLabel}>{label}</Text>
      <Text style={[card.kpiValue, { color }]}>{value}</Text>
      {sub ? <Text style={card.kpiSub}>{sub}</Text> : null}
    </View>
  );
}

export function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <View style={bar.row}>
      <Text style={bar.label}>{label}</Text>
      <View style={bar.track}>
        <View style={[bar.fill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function TypeToggle({ value, onChange }) {
  return (
    <View style={tog.wrap}>
      <TouchableOpacity
        style={[tog.btn, value === 'expense' && { backgroundColor: colors.dangerBg }]}
        onPress={() => onChange('expense')}>
        <Text style={[tog.txt, value === 'expense' && { color: colors.danger }]}>Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[tog.btn, value === 'income' && { backgroundColor: colors.okBg }]}
        onPress={() => onChange('income')}>
        <Text style={[tog.txt, value === 'income' && { color: colors.ok }]}>Income</Text>
      </TouchableOpacity>
    </View>
  );
}

export function FieldLabel({ children }) {
  return <Text style={field.label}>{children}</Text>;
}

export function SubmitBtn({ onPress, children }) {
  return (
    <TouchableOpacity style={field.submit} onPress={onPress} activeOpacity={0.8}>
      <Text style={field.submitTxt}>{children}</Text>
    </TouchableOpacity>
  );
}

export function TxRow({ tx, onDelete }) {
  const isInc = tx.type === 'income';
  return (
    <View style={txr.row}>
      {tx.recur && <View style={txr.recurBar} />}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={txr.desc} numberOfLines={1}>{tx.desc}{tx.recur ? ' ↻' : ''}</Text>
          <Text style={[txr.amt, { color: isInc ? colors.ok : colors.danger }]}>
            {isInc ? '+' : '-'}₹{Math.round(tx.amt).toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Text style={txr.cat}>{tx.cat}</Text>
            <Text style={txr.date}>{tx.date}</Text>
          </View>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ color: colors.border2, fontSize: 13 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export function EmptyState({ text }) {
  return <Text style={{ textAlign: 'center', color: colors.ink3, fontSize: 13, paddingVertical: 20 }}>{text}</Text>;
}

const card = StyleSheet.create({
  wrap: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, marginBottom: 12, borderWidth: 0.5, borderColor: colors.border },
  title: { fontSize: 10, fontWeight: '600', color: colors.ink, letterSpacing: 0.7, marginBottom: 12, textTransform: 'uppercase' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 12 },
  kpi: { backgroundColor: colors.surface, borderRadius: 10, padding: 12, flex: 1, minWidth: '45%', borderWidth: 0.5, borderColor: colors.border },
  kpiLabel: { fontSize: 9, color: colors.ink3, textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: '500', marginBottom: 4 },
  kpiValue: { fontSize: 19, fontWeight: '300' },
  kpiSub: { fontSize: 9, color: colors.ink3, marginTop: 2 },
});

const bar = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  label: { width: 90, fontSize: 11, color: colors.ink2 },
  track: { flex: 1, height: 5, backgroundColor: colors.surface3, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});

const tog = StyleSheet.create({
  wrap: { flexDirection: 'row', borderWidth: 0.5, borderColor: colors.border2, borderRadius: 6, overflow: 'hidden', marginBottom: 14 },
  btn: { flex: 1, paddingVertical: 9, alignItems: 'center', backgroundColor: colors.surface },
  txt: { fontSize: 13, color: colors.ink3 },
});

const field = StyleSheet.create({
  label: { fontSize: 10, color: colors.ink3, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '500', marginBottom: 5 },
  submit: { backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  submitTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

const txr = StyleSheet.create({
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border, gap: 6 },
  recurBar: { width: 2, backgroundColor: colors.accent, borderRadius: 1, marginRight: 2 },
  desc: { fontSize: 13, color: colors.ink, flex: 1 },
  amt: { fontSize: 13, fontWeight: '500' },
  cat: { fontSize: 10, color: colors.ink3, backgroundColor: colors.surface3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  date: { fontSize: 11, color: colors.ink3 },
});
