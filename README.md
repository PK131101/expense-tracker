# Expense Tracker — Expo + Codemagic

Personal finance app. Fully offline. All data stays on device.

---

## Upload to GitHub (do this first)

1. Go to github.com → New repository → name it `expense-tracker` → Create
2. On your computer, open Terminal / Command Prompt in this folder and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main
```

---

## Build APK on Codemagic (no Android Studio needed)

1. Go to **codemagic.io** → Sign up / Log in with GitHub
2. Click **Add application** → Select your `expense-tracker` repo
3. Choose **React Native App** as project type
4. Codemagic will auto-detect `codemagic.yaml` — just click **Start your first build**
5. Wait ~10–15 minutes
6. Download the `.apk` from the build artifacts
7. Send it to your phone and install (enable "Install from unknown sources" in Android settings)

---

## What the app includes

| Section | What it does |
|---|---|
| 🏠 Home | Dashboard — income, expenses, balance, budget alerts, recent transactions |
| 📆 Calendar | See every day's transactions on a monthly calendar |
| 📊 Summary | Monthly breakdown (income/expenses/invested/savings %) + yearly FY table |
| ➕ Add | Add income or expense transactions with category picker |
| ⚙️ Manage | Ledger, Budgets, Recurring, Investments, Carry Forward, Yearly Summary |

All data is stored locally on the device using AsyncStorage. Nothing is sent anywhere.

---

## codemagic.yaml explained

The `codemagic.yaml` file tells Codemagic exactly what to do:
- Install Node 20 + Java 17
- Run `npm install`
- Run `expo prebuild` to generate the Android native files
- Run `gradlew assembleRelease` to build the APK
- Output the APK as a downloadable artifact

**Before pushing**, open `codemagic.yaml` and change:
```yaml
recipients:
  - your-email@example.com   ← put your actual email here
```

---

## Customising the app name / icon

- **App name**: Edit `"name"` in `app.json`
- **Icon**: Replace `assets/icon.png` with your own 1024×1024 PNG
- **Splash screen**: Replace `assets/splash.png`
- **Colours**: Edit `src/utils/theme.js`

---

## Assets needed (create placeholder PNGs or use your own)

Codemagic needs these files to exist in the `assets/` folder:
- `icon.png` — 1024×1024px app icon
- `adaptive-icon.png` — 1024×1024px (Android adaptive icon foreground)
- `splash.png` — 1284×2778px splash screen image
- `favicon.png` — 48×48px (for web, can be ignored)

You can generate all of these free at: **appicon.co** or **easyappicon.com**
