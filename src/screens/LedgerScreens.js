import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fmt, catColors, expenseCats, incomeCats, todayStr, shadow } from '../utils/theme';
import { Card, SectionTitle, TypeToggle, FieldLabel, SubmitBtn, TxRow, EmptyState } from '../components/UI';

const FILTS = ['All','Expenses','Income','Recurring'];

export function LedgerScreen() {
  const { txs, setTxs } = useApp();
  const [filt, setFilt] = useState('All');

  const shown = useMemo(() => txs.filter(t => {
    if (filt === 'Expenses')  return t.type === 'expense';
    if (filt === 'Income')    return t.type === 'income';
    if (filt === 'Recurring') return t.recur;
    return true;
  }), [txs, filt]);

  const del = id => Alert.alert('Delete', 'Remove this transaction?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => setTxs(p => p.filter(t => t.id !== id)) },
  ]);

  return (
    <View style={S.screen}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={S.filtScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}>
        {FILTS.map(f => (
          <TouchableOpacity key={f} style={[S.filt, filt === f && S.filtOn]} onPress={() => setFilt(f)}>
            <Text style={[S.filtTxt, filt === f && S.filtTxtOn]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={S.content}>
        <Card>
          {shown.length === 0
            ? <EmptyState icon="📋" text="No entries found." />
            : shown.map(tx => <TxRow key={tx.id} tx={tx} onDelete={() => del(tx.id)} />)}
        </Card>
      </ScrollView>
    </View>
  );
}

export function AddTransactionScreen({ navigation }) {
  const { setTxs } = useApp();
  const [type, setType] = useState('expense');
  const [desc, setDesc] = useState('');
  const [amt,  setAmt]  = useState('');
  const [cat,  setCat]  = useState('Food');
  const [date, setDate] = useState(todayStr());
  const [note, setNote] = useState('');

  const cats = type === 'income' ? incomeCats : expenseCats;
  const switchType = t => { setType(t); setCat(t === 'income' ? 'Salary' : 'Food'); };

  const submit = () => {
    if (!desc.trim() || !parseFloat(amt) || !date) {
      Alert.alert('Missing fields', 'Please enter description, amount and date.'); return;
    }
    setTxs(p => [{
      id: Date.now(), desc: desc.trim(), amt: parseFloat(amt),
      cat, type, date, note: note.trim(), recur: false,
    }, ...p]);
    navigation.goBack();
  };

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} keyboardShouldPersistTaps="handled">
      <Card>
        <SectionTitle>New Transaction</SectionTitle>
        <TypeToggle value={type} onChange={switchType} />

        <FieldLabel>Description</FieldLabel>
        <TextInput style={S.inp} value={desc} onChangeText={setDesc}
          placeholder="What was this for?" placeholderTextColor={colors.ink3} />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <FieldLabel>Amount (₹)</FieldLabel>
            <TextInput style={S.inp} value={amt} onChangeText={setAmt}
              keyboardType="decimal-pad" placeholder="0" placeholderTextColor={colors.ink3} />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>Date</FieldLabel>
            <TextInput style={S.inp} value={date} onChangeText={setDate}
              placeholder="YYYY-MM-DD" placeholderTextColor={colors.ink3} />
          </View>
        </View>

        <FieldLabel>Category</FieldLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {cats.map(c => (
            <TouchableOpacity key={c}
              style={[S.catPill, cat === c && { backgroundColor: catColors[c] || colors.accent, borderColor: catColors[c] || colors.accent }]}
              onPress={() => setCat(c)}>
              <Text style={[S.catPillTxt, cat === c && { color: '#fff' }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FieldLabel>Note (optional)</FieldLabel>
        <TextInput style={S.inp} value={note} onChangeText={setNote}
          placeholder="Optional note" placeholderTextColor={colors.ink3} />

        <SubmitBtn onPress={submit}>{type === 'income' ? 'Add Income' : 'Add Expense'}</SubmitBtn>
      </Card>
    </ScrollView>
  );
}

export function BudgetsScreen() {
  const { txs, budgets, setBud } = useApp();

  const spent = useMemo(() => {
    const m = {};
    txs.filter(t => t.type === 'expense').forEach(t => { m[t.cat] = (m[t.cat] || 0) + t.amt; });
    return m;
  }, [txs]);

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content}>
      <Card>
        <SectionTitle>Category Budgets</SectionTitle>
        <Text style={{ fontSize: 12, color: colors.ink3, marginBottom: 16 }}>
          Edit the monthly limit for each category.
        </Text>
        {Object.entries(budgets).map(([cat, lim]) => {
          const s = spent[cat] || 0;
          const pct = Math.min(Math.round(s / lim * 100), 100);
          const bc = pct >= 100 ? colors.danger : pct >= 80 ? colors.warn : colors.ok;
          return (
            <View key={cat} style={S.budRow}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[S.catDot, { backgroundColor: catColors[cat] || colors.other }]} />
                  <Text style={{ fontSize: 14, color: colors.ink2, fontWeight: '500' }}>{cat}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 11, color: colors.ink3 }}>{fmt(s)} /</Text>
                  <TextInput
                    style={S.budInp}
                    defaultValue={String(lim)}
                    keyboardType="numeric"
                    onEndEditing={e => setBud(p => ({ ...p, [cat]: Math.max(parseInt(e.nativeEvent.text) || 0, 0) }))}
                  />
                </View>
              </View>
              <View style={S.barTrack}>
                <View style={[S.barFill, { width: `${pct}%`, backgroundColor: bc }]} />
              </View>
              <Text style={{ fontSize: 11, color: bc, marginTop: 4 }}>
                {pct}% used · {fmt(Math.max(lim - s, 0))} remaining
              </Text>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  filtScroll: { flexGrow: 0, paddingVertical: 12 },
  filt: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border2, backgroundColor: colors.surface },
  filtOn: { backgroundColor: colors.header, borderColor: colors.header },
  filtTxt: { fontSize: 13, color: colors.ink3, fontWeight: '500' },
  filtTxtOn: { color: '#fff' },
  inp: { borderWidth: 1, borderColor: colors.border2, borderRadius: 10, paddingVertical: 11, paddingHorizontal: 13, fontSize: 14, color: colors.ink, backgroundColor: colors.surface, marginBottom: 14 },
  catPill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1.5, borderColor: colors.border2, marginRight: 8, backgroundColor: colors.surface },
  catPillTxt: { fontSize: 13, color: colors.ink2, fontWeight: '500' },
  budRow: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  budInp: { borderWidth: 1, borderColor: colors.border2, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, fontSize: 13, color: colors.ink, width: 88, textAlign: 'right', backgroundColor: colors.surface },
  barTrack: { height: 7, backgroundColor: colors.surface3, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
});
