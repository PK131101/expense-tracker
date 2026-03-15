import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, shadow, shadowSm } from '../utils/theme';

export function Card({ children, style }) {
  return <View style={[S.card, shadow, style]}>{children}</View>;
}

export function SectionTitle({ children, style }) {
  return <Text style={[S.sectionTitle, style]}>{children}</Text>;
}

export function KpiGrid({ children }) {
  return <View style={S.kpiGrid}>{children}</View>;
}

export function KpiCard({ label, value, color, sub, accent }) {
  return (
    <View style={[S.kpi, shadowSm, accent && { borderLeftWidth: 3, borderLeftColor: color }]}>
      <Text style={S.kpiLabel}>{label}</Text>
      <Text style={[S.kpiValue, { color }]}>{value}</Text>
      {sub ? <Text style={S.kpiSub}>{sub}</Text> : null}
    </View>
  );
}

export function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <View style={S.barRow}>
      <Text style={S.barLabel} numberOfLines={1}>{label}</Text>
      <View style={S.barTrack}>
        <View style={[S.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export function TypeToggle({ value, onChange }) {
  return (
    <View style={S.toggle}>
      <TouchableOpacity
        style={[S.toggleBtn, value === 'expense' && S.toggleBtnExp]}
        onPress={() => onChange('expense')} activeOpacity={0.8}>
        <Text style={[S.toggleTxt, value === 'expense' && S.toggleTxtExp]}>Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[S.toggleBtn, value === 'income' && S.toggleBtnInc]}
        onPress={() => onChange('income')} activeOpacity={0.8}>
        <Text style={[S.toggleTxt, value === 'income' && S.toggleTxtInc]}>Income</Text>
      </TouchableOpacity>
    </View>
  );
}

export function FieldLabel({ children }) {
  return <Text style={S.fieldLabel}>{children}</Text>;
}

export function Input({ style, ...props }) {
  return <View style={[S.inputWrap, style]}><Text style={S.inputInner} {...props} /></View>;
}

export function SubmitBtn({ onPress, children, color }) {
  return (
    <TouchableOpacity
      style={[S.submitBtn, color && { backgroundColor: color }]}
      onPress={onPress} activeOpacity={0.85}>
      <Text style={S.submitTxt}>{children}</Text>
    </TouchableOpacity>
  );
}

export function TxRow({ tx, onDelete }) {
  const isInc = tx.type === 'income';
  const dotColor = isInc ? colors.ok : colors.danger;
  return (
    <View style={S.txRow}>
      <View style={[S.txDot, { backgroundColor: dotColor + '22' }]}>
        <View style={[S.txDotInner, { backgroundColor: dotColor }]} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={S.txDesc} numberOfLines={1}>{tx.desc}{tx.recur ? ' ↻' : ''}</Text>
          <Text style={[S.txAmt, { color: isInc ? colors.ok : colors.danger }]}>
            {isInc ? '+' : '-'}₹{Math.round(tx.amt).toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View style={[S.catChip, { backgroundColor: dotColor + '15' }]}>
              <Text style={[S.catChipTxt, { color: dotColor }]}>{tx.cat}</Text>
            </View>
            <Text style={S.txDate}>{tx.date}</Text>
          </View>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={{ color: colors.border2, fontSize: 16, fontWeight: '300' }}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export function EmptyState({ text, icon }) {
  return (
    <View style={S.emptyWrap}>
      {icon ? <Text style={{ fontSize: 32, marginBottom: 8 }}>{icon}</Text> : null}
      <Text style={S.emptyTxt}>{text}</Text>
    </View>
  );
}

export function AddButton({ onPress, label }) {
  return (
    <TouchableOpacity style={S.addBtn} onPress={onPress} activeOpacity={0.85}>
      <Text style={S.addBtnTxt}>+ {label}</Text>
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink3,
    letterSpacing: 0.8,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  kpi: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiLabel: {
    fontSize: 10,
    color: colors.ink3,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: '600',
    marginBottom: 6,
  },
  kpiValue: { fontSize: 22, fontWeight: '300', letterSpacing: -0.5 },
  kpiSub: { fontSize: 10, color: colors.ink3, marginTop: 3 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  barLabel: { width: 88, fontSize: 12, color: colors.ink2 },
  barTrack: { flex: 1, height: 6, backgroundColor: colors.surface3, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  toggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: colors.surface },
  toggleBtnExp: { backgroundColor: colors.dangerBg },
  toggleBtnInc: { backgroundColor: colors.okBg },
  toggleTxt: { fontSize: 14, color: colors.ink3, fontWeight: '500' },
  toggleTxtExp: { color: colors.danger },
  toggleTxtInc: { color: colors.ok },
  fieldLabel: {
    fontSize: 11,
    color: colors.ink3,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
    marginBottom: 6,
  },
  submitBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitTxt: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.3 },
  txRow: {
    flexDirection: 'row',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
    alignItems: 'center',
  },
  txDot: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txDotInner: { width: 8, height: 8, borderRadius: 4 },
  txDesc: { fontSize: 14, color: colors.ink, fontWeight: '500', flex: 1, marginRight: 8 },
  txAmt: { fontSize: 14, fontWeight: '600' },
  txDate: { fontSize: 11, color: colors.ink3 },
  catChip: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
  catChipTxt: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  emptyWrap: { alignItems: 'center', paddingVertical: 28 },
  emptyTxt: { fontSize: 13, color: colors.ink3, textAlign: 'center' },
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 14,
  },
  addBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
