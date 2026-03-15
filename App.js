import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/context/AppContext';
import { colors } from './src/utils/theme';

import OverviewScreen from './src/screens/OverviewScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { MonthlySummaryScreen, YearlySummaryScreen } from './src/screens/SummaryScreens';
import { LedgerScreen, AddTransactionScreen, BudgetsScreen } from './src/screens/LedgerScreens';
import {
  RecurringScreen, AddRecurringScreen,
  InvestmentsScreen, AddInvestmentScreen,
  CarryForwardScreen,
} from './src/screens/ManageScreens';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOpts = {
  headerStyle: { backgroundColor: colors.surface, elevation: 1, shadowOpacity: 0.05, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  headerTitleStyle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  headerTintColor: colors.accent,
  cardStyle: { backgroundColor: colors.bg },
};

// ── Stack navigators ───────────────────────────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="Overview" component={OverviewScreen} options={{ title: 'Expense Tracker' }} />
    </Stack.Navigator>
  );
}

function CalStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendar' }} />
    </Stack.Navigator>
  );
}

function SummaryStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="Monthly"  component={MonthlySummaryScreen} options={{ title: 'Monthly Summary' }} />
      <Stack.Screen name="Yearly"   component={YearlySummaryScreen}  options={{ title: 'Yearly Summary'  }} />
      <Stack.Screen name="CarryForward" component={CarryForwardScreen} options={{ title: 'Carry Forward' }} />
    </Stack.Navigator>
  );
}

function AddStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ title: 'Add Transaction' }} />
    </Stack.Navigator>
  );
}

function ManageStack() {
  return (
    <Stack.Navigator screenOptions={screenOpts}>
      <Stack.Screen name="ManageHome"    component={ManageHome}          options={{ title: 'Manage'                  }} />
      <Stack.Screen name="Ledger"        component={LedgerScreen}        options={{ title: 'Transaction Ledger'      }} />
      <Stack.Screen name="Budgets"       component={BudgetsScreen}       options={{ title: 'Budgets'                 }} />
      <Stack.Screen name="Recurring"     component={RecurringScreen}     options={{ title: 'Recurring Transactions'  }} />
      <Stack.Screen name="AddRecurring"  component={AddRecurringScreen}  options={{ title: 'Add Recurring'           }} />
      <Stack.Screen name="Investments"   component={InvestmentsScreen}   options={{ title: 'Investments'             }} />
      <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} options={{ title: 'Add Investment'          }} />
      <Stack.Screen name="CarryForward"  component={CarryForwardScreen}  options={{ title: 'Carry Forward'           }} />
      <Stack.Screen name="YearlySummary" component={YearlySummaryScreen} options={{ title: 'Yearly Summary'         }} />
    </Stack.Navigator>
  );
}

function ManageHome({ navigation }) {
  const ITEMS = [
    { label: 'Transaction Ledger', emoji: '📋', screen: 'Ledger',       desc: 'View & delete all entries'         },
    { label: 'Budgets',            emoji: '🎯', screen: 'Budgets',      desc: 'Set category spending limits'       },
    { label: 'Recurring',          emoji: '🔁', screen: 'Recurring',    desc: 'Rent, EMIs, SIPs, subscriptions'    },
    { label: 'Investments',        emoji: '📈', screen: 'Investments',  desc: 'Track what you invest'              },
    { label: 'Carry Forward',      emoji: '➡️', screen: 'CarryForward', desc: 'Move surplus to next month'         },
    { label: 'Yearly Summary',     emoji: '📅', screen: 'YearlySummary',desc: 'FY 2025–26 at a glance'            },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      {ITEMS.map(item => (
        <TouchableOpacity key={item.screen} style={M.item} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.75}>
          <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={M.label}>{item.label}</Text>
            <Text style={M.desc}>{item.desc}</Text>
          </View>
          <Text style={{ color: colors.ink3, fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Tab icon ───────────────────────────────────────────────────────────────
function TabIcon({ emoji, label, focused }) {
  return (
    <View style={[T.wrap, focused && T.wrapOn]}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={[T.lbl, focused && T.lblOn]}>{label}</Text>
    </View>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
          <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: T.bar, tabBarShowLabel: false }}>
            <Tab.Screen name="HomeTab"    component={HomeStack}    options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home"     focused={focused} /> }} />
            <Tab.Screen name="CalTab"     component={CalStack}     options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📆" label="Calendar"  focused={focused} /> }} />
            <Tab.Screen name="SummaryTab" component={SummaryStack} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Summary"   focused={focused} /> }} />
            <Tab.Screen name="AddTab"     component={AddStack}     options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="➕" label="Add"        focused={focused} /> }} />
            <Tab.Screen name="ManageTab"  component={ManageStack}  options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" label="Manage"    focused={focused} /> }} />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const T = StyleSheet.create({
  bar: { backgroundColor: colors.surface, borderTopWidth: 0.5, borderTopColor: colors.border, height: 64, paddingBottom: 8 },
  wrap: { alignItems: 'center', paddingTop: 4, opacity: 0.4 },
  wrapOn: { opacity: 1 },
  lbl: { fontSize: 10, color: colors.ink3, marginTop: 2 },
  lblOn: { color: colors.accent, fontWeight: '600' },
});

const M = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: colors.border },
  label: { fontSize: 14, fontWeight: '500', color: colors.ink, marginBottom: 2 },
  desc: { fontSize: 12, color: colors.ink3 },
});
