# QuickMart Vendor Portal

A comprehensive vendor dashboard for QuickMart - a grocery delivery Progressive Web App. This portal allows store owners and vendors to manage products, orders, inventory, and business operations.

## 🚀 Features

### ✅ Implemented Features

#### Authentication & Dashboard

- ✅ Vendor login/signup with profile management
- ✅ Multi-vendor support with separate accounts
- ✅ Dashboard overview with real-time stats
- ✅ Today's orders, revenue, and inventory alerts
- ✅ Quick action cards for common tasks

#### Product Management

- ✅ Product listing with search and category filters
- ✅ Product cards with images and stock info
- ✅ Add/edit/delete products
- ✅ Active/inactive product toggle
- ✅ Product variants support
- ✅ Low stock indicators

#### Order Management

- ✅ Order list with multiple status filters
- ✅ Order search by number or customer name
- ✅ Detailed order view with customer info
- ✅ Order status updates (pending → preparing → ready → completed)
- ✅ Payment status tracking
- ✅ Order statistics dashboard

#### Inventory Management

- ✅ Stock tracking for all products
- ✅ Low stock alerts with visual indicators
- ✅ Quick stock adjustment controls
- ✅ Inventory statistics
- ✅ Stock level progress bars

#### Analytics & Reports

- ✅ Revenue overview with line charts
- ✅ Sales analytics with period comparison
- ✅ Top selling products
- ✅ Revenue by product (bar charts)
- ✅ Daily order and revenue trends
- ✅ Export report buttons (UI ready)

#### Store Settings

- ✅ Store information management
- ✅ Operating hours configuration
- ✅ Store open/closed toggle
- ✅ Vacation mode
- ✅ Location and delivery settings
- ✅ Tax rate configuration

#### UI/UX Features

- ✅ Dark mode support
- ✅ Responsive desktop-first design
- ✅ Modern, clean interface
- ✅ Loading states and animations
- ✅ Toast notifications ready
- ✅ Accessible components

### 🔄 Ready for Backend Integration

- Mock data services already structured
- API client configured
- Environment variables setup
- Type-safe interfaces for all data

## 🛠️ Tech Stack

- **Framework:** React 19.2.0 with TypeScript
- **Build Tool:** Vite 7.x with SWC
- **Styling:** TailwindCSS with custom design system
- **UI Components:** Custom components (shadcn/ui inspired)
- **Routing:** React Router v6
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form with Zod validation (ready)
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** vite-plugin-pwa with Workbox

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Getting Started

### Demo Credentials

```
Email: vendor@quickmart.com
Password: password
```

### Development

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
