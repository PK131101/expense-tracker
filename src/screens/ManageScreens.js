import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { colors, fmt, invTypes, invTypeColors, daysUntil, todayStr, shadow } from '../utils/theme';
import { Card, SectionTitle, TypeToggle, FieldLabel, SubmitBtn, EmptyState } from '../components/UI';

// ── RECURRING ──────────────────────────────────────────────────────────────
export function RecurringScreen({ navigation }) {
  const { recs, setRecs } = useApp();
  const todayDay = new Date().getDate();
  const upcoming = recs.filter(r => r.active && r.day >= todayDay).sort((a, b) => a.day - b.day);

  const toggle = id => setRecs(p => p.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const del = id => Alert.alert('Remove', 'Remove this recurring transaction?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Remove', style: 'destructive', onPress: () => setRecs(p => p.filter(r => r.id !== id)) },
  ]);

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content}>
      <TouchableOpacity style={S.addBtn} onPress={() => navigation.navigate('AddRecurring')}>
        <Text style={S.addBtnTxt}>+ Add Recurring Transaction</Text>
      </TouchableOpacity>
      {recs.length === 0 && <EmptyState text="No recurring transactions yet." />}
      {recs.map(r => (
        <View key={r.id} style={[S.recCard, !r.active && { opacity: 0.5 }, shadow]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <View style={{ flex: 1 }}>
              <Text style={S.recName}>{r.name}</Text>
              <Text style={S.recMeta}>{r.cat} · Day {r.day} every month</Text>
            </View>
            <View style={[S.recBadge, { backgroundColor: r.active ? colors.okBg : colors.surface3 }]}>
              <Text style={[S.recBadgeTxt, { color: r.active ? colors.ok : colors.ink3 }]}>{r.active ? 'Active' : 'Paused'}</Text>
            </View>
          </View>
          <Text style={[S.recAmt, { color: r.type === 'income' ? colors.ok : colors.danger }]}>{r.type === 'income' ? '+' : '-'}{fmt(r.amt)}</Text>
          <Text style={S.recNext}>{r.active ? (r.day >= todayDay ? `Next: ${r.day} Apr` : 'Processed this month') : 'Paused'}</Text>
          <View style={S.recActions}>
            <TouchableOpacity style={S.recBtn} onPress={() => toggle(r.id)}>
              <Text style={S.recBtnTxt}>{r.active ? 'Pause' : 'Resume'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[S.recBtn, { borderColor: colors.dangerBg }]} onPress={() => del(r.id)}>
              <Text style={[S.recBtnTxt, { color: colors.danger }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {upcoming.length > 0 && (
        <Card>
          <SectionTitle>Upcoming This Month</SectionTitle>
          {upcoming.map(r => (
            <View key={r.id} style={S.upRow}>
              <Text style={S.upDate}>{r.day} Apr</Text>
              <Text style={S.upName}>{r.name}</Text>
              <Text style={[S.upAmt, { color: r.type === 'income' ? colors.ok : colors.danger }]}>{r.type === 'income' ? '+' : '-'}{fmt(r.amt)}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

export function AddRecurringScreen({ navigation }) {
  const { setRecs } = useApp();
  const [type, setType] = useState('expense');
  const [name, setName] = useState('');
  const [amt,  setAmt]  = useState('');
  const [cat,  setCat]  = useState('Bills');
  const [day,  setDay]  = useState('');
  const CATS = type === 'income' ? ['Salary','Freelance','Other'] : ['Rent','EMI','Bills','Entertainment','Other'];

  const submit = () => {
    const d = parseInt(day);
    if (!name.trim() || !amt || !d || d < 1 || d > 28) { Alert.alert('Missing fields', 'Fill name, amount and a valid day (1–28).'); return; }
    setRecs(p => [...p, { id: Date.now(), name: name.trim(), amt: parseFloat(amt), cat, type, day: d, active: true }]);
    navigation.goBack();
  };

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} keyboardShouldPersistTaps="handled">
      <Card>
        <SectionTitle>New Recurring Transaction</SectionTitle>
        <TypeToggle value={type} onChange={t => { setType(t); setCat(t === 'income' ? 'Salary' : 'Bills'); }} />
        <FieldLabel>Name</FieldLabel>
        <TextInput style={S.inp} value={name} onChangeText={setName} placeholder="e.g. Rent, Netflix, Salary" placeholderTextColor={colors.ink3} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><FieldLabel>Amount (₹)</FieldLabel><TextInput style={S.inp} value={amt} onChangeText={setAmt} keyboardType="decimal-pad" placeholderTextColor={colors.ink3} /></View>
          <View style={{ flex: 1 }}><FieldLabel>Day of Month</FieldLabel><TextInput style={S.inp} value={day} onChangeText={setDay} keyboardType="number-pad" placeholder="1–28" placeholderTextColor={colors.ink3} /></View>
        </View>
        <FieldLabel>Category</FieldLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {CATS.map(c => (
            <TouchableOpacity key={c} style={[S.catPill, cat === c && { backgroundColor: colors.accent }]} onPress={() => setCat(c)}>
              <Text style={[S.catPillTxt, cat === c && { color: '#fff' }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <SubmitBtn onPress={submit}>Add Recurring</SubmitBtn>
      </Card>
    </ScrollView>
  );
}

// ── INVESTMENTS ────────────────────────────────────────────────────────────
export function InvestmentsScreen({ navigation }) {
  const { investments, setInv } = useApp();
  const total = investments.reduce((a, i) => a + i.amt, 0);
  const byType = {};
  investments.forEach(i => { byType[i.type] = (byType[i.type] || 0) + i.amt; });
  const upSIP = investments.filter(i => { const d = daysUntil(i.sipdate); return d !== null && d >= 0; }).length;
  const matur = investments.filter(i => { const d = daysUntil(i.lockdate); return d !== null && d >= 0 && d <= 30; }).length;

  const del = id => Alert.alert('Remove', 'Remove this investment entry?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Remove', style: 'destructive', onPress: () => setInv(p => p.filter(i => i.id !== id)) },
  ]);

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content}>
      <TouchableOpacity style={S.addBtn} onPress={() => navigation.navigate('AddInvestment')}>
        <Text style={S.addBtnTxt}>+ Add Investment</Text>
      </TouchableOpacity>
      <Card>
        <SectionTitle>Portfolio Summary</SectionTitle>
        <View style={{ flexDirection: 'row', gap: 9, marginBottom: 14 }}>
          <View style={S.miniStat}><Text style={S.msL}>Committed</Text><Text style={[S.msV, { color: colors.inv }]}>{fmt(total)}</Text><Text style={S.msSub}>{investments.length} entries</Text></View>
          <View style={S.miniStat}><Text style={S.msL}>Upcoming SIPs</Text><Text style={[S.msV, { color: upSIP > 0 ? colors.accent : colors.ink3 }]}>{upSIP}</Text><Text style={S.msSub}>scheduled</Text></View>
          <View style={S.miniStat}><Text style={S.msL}>Maturing Soon</Text><Text style={[S.msV, { color: matur > 0 ? colors.warn : colors.ink3 }]}>{matur}</Text><Text style={S.msSub}>in 30 days</Text></View>
        </View>
        {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([type, amt]) => {
          const pct = total > 0 ? Math.round(amt / total * 100) : 0;
          return (
            <View key={type} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <Text style={{ width: 88, fontSize: 11, color: colors.ink2 }}>{type}</Text>
              <View style={{ flex: 1, height: 5, backgroundColor: colors.surface3, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ width: `${pct}%`, height: '100%', backgroundColor: invTypeColors[type] || '#90a4ae', borderRadius: 3 }} />
              </View>
              <Text style={{ fontSize: 11, color: colors.ink3, width: 58, textAlign: 'right' }}>{fmt(amt)}</Text>
              <Text style={{ fontSize: 10, color: colors.ink3, width: 30, textAlign: 'right' }}>{pct}%</Text>
            </View>
          );
        })}
      </Card>
      {investments.length === 0 && <EmptyState text="No investments logged yet." />}
      {investments.map(inv => {
        const dtl = daysUntil(inv.lockdate);
        const dts = daysUntil(inv.sipdate);
        const lockSoon = dtl !== null && dtl >= 0 && dtl <= 30;
        const matured = dtl !== null && dtl < 0;
        const sipSoon = dts !== null && dts >= 0 && dts <= 7;
        return (
          <View key={inv.id} style={[S.invCard, shadow]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={S.invName}>{inv.name}</Text>
                <Text style={S.invDate}>Added {inv.date}</Text>
              </View>
              <View style={S.invTypeBadge}><Text style={S.invTypeTxt}>{inv.type}</Text></View>
            </View>
            <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap', marginBottom: 8 }}>
              <View><Text style={S.metaL}>Amount Invested</Text><Text style={[S.metaV, { color: colors.inv }]}>{fmt(inv.amt)}</Text></View>
              {inv.lockdate ? <View><Text style={S.metaL}>Maturity Date</Text><Text style={[S.metaV, { color: matured ? colors.ok : lockSoon ? colors.warn : colors.ink2 }]}>{inv.lockdate}{matured ? ' ✓' : dtl !== null ? ` (${dtl}d)` : ''}</Text></View> : null}
              {inv.sipdate && dts !== null && dts >= 0 ? <View><Text style={S.metaL}>Next SIP</Text><Text style={[S.metaV, { color: colors.accent }]}>{inv.sipdate} (in {dts}d)</Text></View> : null}
            </View>
            {inv.note ? <View style={S.noteBox}><Text style={S.noteTxt}>📌 {inv.note}</Text></View> : null}
            {lockSoon ? <View style={S.alertBox}><Text style={S.alertTxt}>⏰ Matures in {dtl} day{dtl !== 1 ? 's' : ''} — review before auto-renewal.</Text></View> : null}
            {matured && inv.lockdate ? <View style={[S.alertBox, { backgroundColor: colors.accentBg }]}><Text style={[S.alertTxt, { color: colors.accent }]}>✓ Past maturity — consider reviewing this investment.</Text></View> : null}
            {sipSoon ? <View style={[S.alertBox, { backgroundColor: colors.accentBg }]}><Text style={[S.alertTxt, { color: colors.accent }]}>📅 SIP due in {dts} day{dts !== 1 ? 's' : ''}.</Text></View> : null}
            <TouchableOpacity style={[S.recBtn, { marginTop: 10 }]} onPress={() => del(inv.id)}>
              <Text style={S.recBtnTxt}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

export function AddInvestmentScreen({ navigation }) {
  const { setInv } = useApp();
  const [name,     setName]     = useState('');
  const [amt,      setAmt]      = useState('');
  const [type,     setType]     = useState('SIP');
  const [date,     setDate]     = useState(todayStr());
  const [lockdate, setLockdate] = useState('');
  const [sipdate,  setSipdate]  = useState('');
  const [note,     setNote]     = useState('');

  const submit = () => {
    if (!name.trim() || !amt || !date) { Alert.alert('Missing', 'Name, amount and date are required.'); return; }
    setInv(p => [...p, { id: Date.now(), name: name.trim(), amt: parseFloat(amt), type, date, lockdate, sipdate, note: note.trim() }]);
    navigation.goBack();
  };

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} keyboardShouldPersistTaps="handled">
      <Card>
        <SectionTitle>New Investment Entry</SectionTitle>
        <View style={S.infoBox}><Text style={S.infoTxt}>Tracking what you invest only — no returns or live values. Honest records.</Text></View>
        <FieldLabel>Investment Name</FieldLabel>
        <TextInput style={S.inp} value={name} onChangeText={setName} placeholder="e.g. Nifty 50 Index Fund" placeholderTextColor={colors.ink3} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><FieldLabel>Amount (₹)</FieldLabel><TextInput style={S.inp} value={amt} onChangeText={setAmt} keyboardType="decimal-pad" placeholderTextColor={colors.ink3} /></View>
          <View style={{ flex: 1 }}><FieldLabel>Date (YYYY-MM-DD)</FieldLabel><TextInput style={S.inp} value={date} onChangeText={setDate} placeholderTextColor={colors.ink3} /></View>
        </View>
        <FieldLabel>Type</FieldLabel>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {invTypes.map(t => (
            <TouchableOpacity key={t} style={[S.catPill, type === t && { backgroundColor: invTypeColors[t] || colors.inv }]} onPress={() => setType(t)}>
              <Text style={[S.catPillTxt, type === t && { color: '#fff' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}><FieldLabel>Lock-in / Maturity</FieldLabel><TextInput style={S.inp} value={lockdate} onChangeText={setLockdate} placeholder="YYYY-MM-DD (opt)" placeholderTextColor={colors.ink3} /></View>
          <View style={{ flex: 1 }}><FieldLabel>Next SIP Date</FieldLabel><TextInput style={S.inp} value={sipdate} onChangeText={setSipdate} placeholder="YYYY-MM-DD (opt)" placeholderTextColor={colors.ink3} /></View>
        </View>
        <FieldLabel>Reminder / Note</FieldLabel>
        <TextInput style={S.inp} value={note} onChangeText={setNote} placeholder="e.g. 3yr lock-in, auto-debit 5th" placeholderTextColor={colors.ink3} />
        <SubmitBtn onPress={submit}>Add Investment</SubmitBtn>
      </Card>
    </ScrollView>
  );
}

// ── CARRY FORWARD ──────────────────────────────────────────────────────────
export function CarryForwardScreen() {
  const { txs, investments, carryFwd, setCF } = useApp();
  const [label, setLabel] = useState('March Surplus');
  const [amt,   setAmt]   = useState('');
  const [note,  setNote]  = useState('');

  const inc = txs.filter(t => t.type === 'income').reduce((a, t) => a + t.amt, 0);
  const exp = txs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amt, 0);
  const inv = investments.reduce((a, i) => a + i.amt, 0);
  const bal = inc - exp - inv;
  const cfTotal = carryFwd.reduce((a, c) => a + c.amount, 0);

  const doCarry = () => {
    const a = parseFloat(amt) || 0;
    if (a <= 0) { Alert.alert('Invalid', 'Enter a positive amount.'); return; }
    setCF(p => [{ month: '2026-03', label: label || 'Surplus', amount: a, note }, ...p]);
    setLabel('March Surplus'); setAmt(''); setNote('');
  };
  const del = (month, lbl) => setCF(p => p.filter(c => !(c.month === month && c.label === lbl)));

  return (
    <ScrollView style={S.screen} contentContainerStyle={S.content} keyboardShouldPersistTaps="handled">
      <Card>
        <SectionTitle>Balance Summary</SectionTitle>
        <CFRow label="Current Month Net (Income − Expenses − Investments)" value={fmt(bal)} color={bal >= 0 ? colors.ok : colors.danger} />
        <CFRow label="Total Carried Forward" value={fmt(cfTotal)} color={colors.ok} />
        <CFRow label="Effective Balance" value={fmt(bal + cfTotal)} color={(bal + cfTotal) >= 0 ? colors.ok : colors.danger} bold />
      </Card>
      <Card>
        <SectionTitle>Carry March Balance to April</SectionTitle>
        <FieldLabel>Label</FieldLabel>
        <TextInput style={S.inp} value={label} onChangeText={setLabel} placeholderTextColor={colors.ink3} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <FieldLabel>Amount (₹)</FieldLabel>
            <TextInput style={S.inp} value={amt} onChangeText={setAmt} keyboardType="decimal-pad" placeholder={String(Math.max(Math.round(bal), 0))} placeholderTextColor={colors.ink3} />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>Note (optional)</FieldLabel>
            <TextInput style={S.inp} value={note} onChangeText={setNote} placeholder="Optional" placeholderTextColor={colors.ink3} />
          </View>
        </View>
        <SubmitBtn onPress={doCarry}>Carry Forward →</SubmitBtn>
      </Card>
      <Card>
        <SectionTitle>History</SectionTitle>
        {carryFwd.length === 0 && <EmptyState text="No carry forward history yet." />}
        {carryFwd.map((c, i) => (
          <View key={i} style={S.cfRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: colors.ink2 }}>{c.label}</Text>
              <Text style={{ fontSize: 11, color: colors.ink3 }}>{c.month}{c.note ? ' · ' + c.note : ''}</Text>
            </View>
            <Text style={{ fontSize: 13, color: colors.ok, fontWeight: '500', marginRight: 12 }}>{fmt(c.amount)}</Text>
            <TouchableOpacity onPress={() => del(c.month, c.label)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ color: colors.border2, fontSize: 14 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function CFRow({ label, value, color, bold }) {
  return (
    <View style={[S.cfRow, { justifyContent: 'space-between' }]}>
      <Text style={{ fontSize: 12, color: colors.ink2, flex: 1, fontWeight: bold ? '500' : '400' }}>{label}</Text>
      <Text style={{ fontSize: bold ? 17 : 13, fontWeight: bold ? '400' : '500', color: color || colors.ink2 }}>{value}</Text>
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 32 },
  addBtn: { backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 14 },
  addBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
  inp: { borderWidth: 1, borderColor: colors.border2, borderRadius: 7, paddingVertical: 9, paddingHorizontal: 11, fontSize: 13, color: colors.ink, backgroundColor: colors.surface, marginBottom: 12 },
  catPill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 0.5, borderColor: colors.border2, marginRight: 6, backgroundColor: colors.surface },
  catPillTxt: { fontSize: 12, color: colors.ink2 },
  recCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: colors.border },
  recName: { fontSize: 13, fontWeight: '500', color: colors.ink },
  recMeta: { fontSize: 11, color: colors.ink3, marginTop: 2 },
  recBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4 },
  recBadgeTxt: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  recAmt: { fontSize: 18, fontWeight: '300' },
  recNext: { fontSize: 11, color: colors.ink3, marginTop: 4 },
  recActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  recBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6, borderWidth: 0.5, borderColor: colors.border2 },
  recBtnTxt: { fontSize: 12, color: colors.ink2 },
  upRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  upDate: { fontSize: 11, color: colors.ink3, width: 48 },
  upName: { flex: 1, fontSize: 13, color: colors.ink },
  upAmt: { fontSize: 13, fontWeight: '500' },
  invCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: colors.border },
  invName: { fontSize: 13, fontWeight: '500', color: colors.ink },
  invDate: { fontSize: 10, color: colors.ink3, marginTop: 2 },
  invTypeBadge: { backgroundColor: colors.invBg, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 },
  invTypeTxt: { fontSize: 9, fontWeight: '600', color: colors.inv, textTransform: 'uppercase', letterSpacing: 0.4 },
  metaL: { fontSize: 9, color: colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '500', marginBottom: 3 },
  metaV: { fontSize: 13 },
  noteBox: { backgroundColor: colors.surface2, borderLeftWidth: 2, borderLeftColor: colors.border2, padding: 8, borderRadius: 4, marginBottom: 6 },
  noteTxt: { fontSize: 11, color: colors.ink3 },
  alertBox: { backgroundColor: colors.warnBg, borderWidth: 0.5, borderColor: 'rgba(180,83,9,.15)', borderRadius: 6, padding: 9, marginTop: 6 },
  alertTxt: { fontSize: 11, color: colors.warn },
  miniStat: { flex: 1, backgroundColor: colors.surface2, borderRadius: 8, padding: 10 },
  msL: { fontSize: 9, color: colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '500', marginBottom: 3 },
  msV: { fontSize: 18, fontWeight: '300' },
  msSub: { fontSize: 9, color: colors.ink3, marginTop: 2 },
  cfRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  infoBox: { backgroundColor: colors.surface2, borderRadius: 6, padding: 10, marginBottom: 14 },
  infoTxt: { fontSize: 11, color: colors.ink3 },
});
