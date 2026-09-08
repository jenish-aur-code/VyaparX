# Sauda Book - Commodity Brokerage Management System

A modern, responsive, offline-first web application for commodity & agro brokers built with React, Vite, TypeScript, Tailwind CSS, Lucide Icons, and IndexedDB.

Recreated and expanded from the mobile **Sauda Book** application screenshots to deliver a desktop, tablet, and mobile-friendly experience.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 📱 Features Recreated from Screenshots

1. **Splash Screen / Context Selector (`media_1788855438639.jpg`)**:
   - Company switcher (e.g. `KRISHNA FIBERS`) & Financial Year switcher (`2026-2027`).

2. **Home Dashboard (`media_1788855438638.jpg`)**:
   - Top Counter: Total Sauda Orders (dynamically counted from IndexedDB).
   - Summary Banner: Top traded commodity item & aggregate volume.
   - 6 Main Action Cards:
     - **PARTY LIST**
     - **SAUDA ORDER LIST**
     - **CREATE NEW SAUDA ORDER**
     - **ITEM LIST**
     - **SAUDA DISPATCH**
     - **SAUDA BILL**

3. **3-Step Sauda Order Wizard (`media_1788855408564.jpg`, `...569.jpg`, `...519.jpg`, `...587.jpg`, `...630.jpg`)**:
   - **Step 1 (Item):** Date picker, commodity selection with search modal, quality/variety with quick value autocomplete, quantity, unit, bill rate, GST calculations, bill number, payment terms, delivery terms, remark, and terms & conditions.
   - **Step 2 (Seller):** Searchable party modal with address and GST metadata, commission rate, and real-time commission amount calculation (`Quantity × Rate`).
   - **Step 3 (Buyer):** Searchable buyer modal, buyer commission rate, and instant order save.

4. **Sauda Orders List (`media_1788855438634.jpg`)**:
   - Order cards with distinct Seller & Buyer colored sub-cards, commodity badge, bill rate, quantity with unit, date, ID, share button, delete confirmation, dispatch modal, and payment recording modal.

5. **Companies Management & PDF Customization (`media_1788855356193.jpg`, `...196.jpg`)**:
   - Multi-company support with default company indicator.
   - Sauda Note custom color picker (Red, Orange, Blue, Green, Black) with real-time swatch preview.
   - 4 selectable Sauda Note PDF templates.
   - Signature toggle and live PDF preview.

6. **Parties Management (`media_1788855322714.jpg`, `...798.jpg`)**:
   - Add/edit seller and buyer parties with GST search auto-extraction, mobile contact, bank accounts, and IFSC.

7. **Items Management (`media_1788855259400.jpg`, `...434.jpg`)**:
   - Add/edit commodity items with seller & buyer commission defaults and real-time calculation guidance.

8. **Profile & Security (`media_1788855356228.jpg`, `...514.jpg`, `...517.jpg`)**:
   - Personal profile, free subscription badge, and renewal timeline.
   - Switch active company and financial year on the fly.
   - Quick Values manager for reusable trade terms.
   - Passcode PIN lock with screen lock modal.
   - Referral program with code copying and referral rewards tracking.
   - Brokerage Total Amount Party-Wise report with volume, turnover, and commission summaries.

---

## 🗄️ Database Architecture (IndexedDB via Dexie.js)

All records are stored locally in the browser's IndexedDB under the database name `SaudaBookDatabase`:

| Store Name | Primary Key | Indexed Fields |
|---|---|---|
| `companies` | `++id` | `name, isDefault, state, city` |
| `financialYears` | `id` | `isCurrent` |
| `items` | `++id` | `name` |
| `parties` | `++id` | `name, mobileNumber, city, state` |
| `saudaOrders` | `++id` | `companyId, financialYear, date, itemId, sellerId, buyerId, billNo, dispatchStatus, paymentStatus` |
| `dispatches` | `++id` | `saudaId, status, dispatchDate` |
| `payments` | `++id` | `saudaId, partyType, paymentDate` |
| `quickValues` | `++id` | `category, value` |
| `userProfile` | `id` | - |

### Demo Sample Data
On the very first launch, the application automatically seeds demo records matching the screenshots:
- **Company**: `KRISHNA FIBERS` (Botad, Gujarat)
- **Items**: `KAPAS`, `COTTON BALES`, `KHOL`
- **Parties**: `SKY` (Seller) & `RAM` (Buyer)
- **Sauda Order #1**: `KAPAS` order matching screenshot #23
- **User Profile**: `JENISH` with code `LHPXC3`

---

## 🔌 Architecture & Future MERN Backend Migration

The UI never directly touches raw database commands. Instead, it interacts strictly through a clean **Service Layer**:

```
src/
├── services/
│   ├── companyService.ts      # CRUD & default switching
│   ├── itemService.ts         # Items search & management
│   ├── partyService.ts        # Parties search & GST auto-fill
│   ├── saudaService.ts        # Orders, calculations & stats
│   ├── dispatchService.ts     # Dispatch logs & order sync
│   ├── paymentService.ts      # Payment logs & balance sync
│   ├── quickValueService.ts   # Reusable trade terms
│   ├── profileService.ts      # User profile, PIN & FY
│   └── reportService.ts       # Party-wise brokerage aggregation
```

### To migrate to Node.js / Express / MongoDB:
1. Replace the Dexie calls inside `src/services/*` with `fetch()` or `axios.get('/api/...')`.
2. Keep the component interfaces and method signatures identical.
3. No pages or UI components need to be rewritten!

---

## 🖨️ PDF Generation & Printing
- The application provides **4 distinct Sauda Note PDF layouts**:
  - **Template 1**: Classic Boxed Trade Confirmation (Exact match to screenshot 14).
  - **Template 2**: Modern Columnar Table Layout.
  - **Template 3**: Minimalist Clean Trade Invoice.
  - **Template 4**: Official Brokerage Voucher.
- Supports browser native printing (`window.print()`) with custom `@media print` CSS rules so the printed or saved PDF is clean, high-resolution, and perfectly scaled for A4 paper.

---

## 🎨 Design System
- **Brand Primary**: Amber / Orange (`#FF9800`, `#FFA000`, `#F57C00`)
- **Background**: Soft Gray (`#F5F7FA`)
- **Status Colors**:
  - Green (`#10B981`) for successful states & seller badges
  - Blue (`#2563EB`) for buyer badges
  - Red (`#DC2626`) for destructive actions
  - Purple (`#7C3AED`) for PIN security
  - Teal (`#0D9488`) for legal & support
