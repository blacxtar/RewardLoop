# 🎁 RewardLoop — Loyalty Rewards Mobile App

A production-ready React Native mobile application built for the **GARS Technology React Native Internship Assessment**. RewardLoop is a loyalty-focused shopping app where users earn points for engagement — aligned with GARS Technology's Loyalty SaaS platform for retailers.

---

## 📱 Features

### Core Features
- **🔐 Authentication** — Login via DummyJSON API with JWT token, input validation, and session persistence
- **🛍️ Product Browsing** — FakeStore API integration with debounced search, category filters, and pull-to-refresh
- **📦 Product Details** — Full product view with image, rating, description, and favorite toggle
- **❤️ Favorites** — Persistent favorites list with add/remove, empty state, and navigation to details

### 🏆 Loyalty System (GARS Alignment)
- **Points Engine** — Earn +5 on login, +10 on adding favorites
- **Transaction History** — Full audit trail with timestamps
- **Reward Tiers** — ₹50 → ₹100 → ₹250 → ₹500 → Premium unlock progression
- **Progress Tracking** — Visual progress bar toward next reward tier
- **Points Badge** — Real-time points display in navigation header

### Production Quality
- **🛡️ Error Boundary** — Global error handler with retry option
- **💾 Offline Persistence** — AsyncStorage for auth, favorites, and loyalty data
- **⚡ Performance** — React.memo, useCallback, debounced inputs, FlatList optimization
- **✅ Unit Tests** — loyaltySlice reducer tests (5 passing)
- **📁 Modular Architecture** — Scalable folder structure with separation of concerns

---

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI (CustomButton, CustomInput, ProductCard, etc.)
├── hooks/               # Custom hooks (useDebounce)
├── navigation/          # React Navigation (conditional auth/main stacks)
├── redux/
│   ├── slices/          # Redux Toolkit slices (auth, products, favorites, loyalty)
│   └── store.js         # Configured store
├── screens/             # Full-page screens (Login, ProductList, Detail, Favorites, Rewards)
├── services/            # Centralized API layer (axios instances)
├── theme/               # Design tokens (colors, spacing, typography)
└── utils/               # Constants, storage helpers, formatters
```

### State Management Flow

```
User Action → Component → dispatch() → Redux Slice → State Update → UI Re-render
                                            ↓
                                     AsyncStorage (persistence)
```

### Navigation Architecture

```
AppNavigator
├── Auth Stack (isLoggedIn === false)
│   └── LoginScreen
└── Main Tabs (isLoggedIn === true)
    ├── Products Tab
    │   ├── ProductListScreen
    │   └── ProductDetailScreen
    ├── Favorites Tab
    │   └── FavoritesScreen
    └── Rewards Tab
        └── RewardsScreen
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native (Expo) | Cross-platform mobile framework |
| Redux Toolkit | Global state management |
| React Navigation | Stack + Tab navigation |
| Axios | HTTP client |
| AsyncStorage | Local persistence |
| Jest + jest-expo | Unit testing |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd RewardLoop

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device
1. Scan the QR code with Expo Go (Android) or Camera app (iOS)
2. Login with demo credentials: **emilys / emilyspass**

### Running Tests

```bash
npm test
```

---

## 📦 Building APK

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build Android APK (preview profile)
eas build --platform android --profile preview
```

Add this to `eas.json` for APK output:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Local Build (Alternative)

```bash
# Generate native Android project
npx expo prebuild --platform android

# Build APK using Gradle
cd android && ./gradlew assembleRelease
```

---

## 🎯 Demo Script (5 minutes)

1. **Login (1 min)** — Show validation errors → enter demo credentials → login → +5 points badge appears
2. **Browse Products (1 min)** — Scroll products → search "jacket" → filter by "electronics" → pull-to-refresh
3. **Product Details (30s)** — Tap a product → view details → star rating, price, description
4. **Favorites (1 min)** — Add to favorites → +10 points → go to Favorites tab → see list → remove one → show empty state
5. **Loyalty Rewards (1 min)** — Go to Rewards tab → show points hero → progress bar → reward tiers → transaction history
6. **Persistence (30s)** — Close and reopen app → session restored → favorites and points preserved

---

## 🧠 Key Architecture Decisions

| Decision | Rationale |
|---|---|
| **Expo over bare React Native** | Faster dev workflow, managed builds (EAS), OTA updates |
| **Redux Toolkit over Context** | Scalable state, DevTools, thunks for async, Immer for immutability |
| **Conditional navigation** | Auth state in Redux drives stack switching — prevents back-navigation to login |
| **Client-side filtering** | FakeStore has ~20 items — faster UX than server-round-trip per filter |
| **Loyalty as a separate slice** | Mirrors GARS Technology's SaaS model — designed for future backend sync |
| **Points never deducted** | Real loyalty systems only accumulate — removing a favorite doesn't penalize |
| **AsyncStorage persistence** | Session survives app restart without a backend |
| **React.memo + useCallback** | Prevents unnecessary FlatList re-renders at scale |

---

## 📄 License

Built for the GARS Technology React Native Internship Assessment.

---

*Built with ❤️ using React Native, Redux Toolkit, and a passion for clean architecture.*
