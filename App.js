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
  headerStyle: {
    backgroundColor: colors.header,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  headerTintColor: 'rgba(255,255,255,0.8)',
  cardStyle: { backgroundColor: colors.bg },
};

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
      <Stack.Screen name="Monthly"      component={MonthlySummaryScreen} options={{ title: 'Monthly Summary' }} />
      <Stack.Screen name="Yearly"       component={YearlySummaryScreen}  options={{ title: 'Yearly Summary'  }} />
      <Stack.Screen name="CarryForward" component={CarryForwardScreen}   options={{ title: 'Carry Forward'   }} />
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
      <Stack.Screen name="ManageHome"    component={ManageHome}          options={{ title: 'Manage'                 }} />
      <Stack.Screen name="Ledger"        component={LedgerScreen}        options={{ title: 'Transaction Ledger'     }} />
      <Stack.Screen name="Budgets"       component={BudgetsScreen}       options={{ title: 'Budgets'                }} />
      <Stack.Screen name="Recurring"     component={RecurringScreen}     options={{ title: 'Recurring'              }} />
      <Stack.Screen name="AddRecurring"  component={AddRecurringScreen}  options={{ title: 'Add Recurring'          }} />
      <Stack.Screen name="Investments"   component={InvestmentsScreen}   options={{ title: 'Investments'            }} />
      <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} options={{ title: 'Add Investment'         }} />
      <Stack.Screen name="CarryForward"  component={CarryForwardScreen}  options={{ title: 'Carry Forward'          }} />
      <Stack.Screen name="YearlySummary" component={YearlySummaryScreen} options={{ title: 'Yearly Summary'        }} />
    </Stack.Navigator>
  );
}

function ManageHome({ navigation }) {
  const ITEMS = [
    { label: 'Transaction Ledger', icon: '📋', screen: 'Ledger',        desc: 'View & delete all entries',        color: '#3B82F6' },
    { label: 'Budgets',            icon: '🎯', screen: 'Budgets',       desc: 'Set category spending limits',      color: '#10B981' },
    { label: 'Recurring',          icon: '🔁', screen: 'Recurring',     desc: 'Rent, EMIs, SIPs, subscriptions',   color: '#F59E0B' },
    { label: 'Investments',        icon: '📈', screen: 'Investments',   desc: 'Track what you invest',             color: '#8B5CF6' },
    { label: 'Carry Forward',      icon: '➡️', screen: 'CarryForward',  desc: 'Move surplus to next month',        color: '#06B6D4' },
    { label: 'Yearly Summary',     icon: '📅', screen: 'YearlySummary', desc: 'FY 2025–26 at a glance',            color: '#EC4899' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      {ITEMS.map(item => (
        <TouchableOpacity key={item.screen} style={M.item} onPress={() => navigation.navigate(item.screen)} activeOpacity={0.75}>
          <View style={[M.iconBox, { backgroundColor: item.color + '18' }]}>
            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={M.label}>{item.label}</Text>
            <Text style={M.desc}>{item.desc}</Text>
          </View>
          <Text style={{ color: colors.border2, fontSize: 20 }}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={[T.wrap, focused && T.wrapOn]}>
      <Text style={[T.emoji, focused && T.emojiOn]}>{emoji}</Text>
      <Text style={[T.lbl, focused && T.lblOn]}>{label}</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={colors.header} />
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
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 68,
    paddingBottom: 10,
    paddingTop: 6,
  },
  wrap: { alignItems: 'center', opacity: 0.38 },
  wrapOn: { opacity: 1 },
  emoji: { fontSize: 22 },
  emojiOn: {},
  lbl: { fontSize: 10, color: colors.ink3, marginTop: 3, fontWeight: '500' },
  lblOn: { color: colors.accent, fontWeight: '700' },
});

const M = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderRadius: 14,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#1A2440', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 15, fontWeight: '600', color: colors.ink, marginBottom: 2 },
  desc: { fontSize: 12, color: colors.ink3 },
});
