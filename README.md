# Sales CRM — Client Presentation Prototype

A high-velocity, enterprise-grade Sales CRM frontend demo designed specifically for businesses running **Meta Ads (Facebook & Instagram Lead Generation)** and managing sales lead conversion through a dynamic inside sales team.

Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Recharts**.

---

## ⚡ Quick Start & Running the Project

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Executes TypeScript compilation (`tsc -b`) and Vite production build, generating an optimized, tree-shaken static bundle in `dist/`.

---

## 🚀 One-Click Vercel Deployment

This project includes pre-configured SPA routing and edge caching rules via [`vercel.json`](file:///e:/Zero_Booth%20-Prj/Prj-Fldr/CRM/vercel.json).
- **Target Repo**: `https://github.com/sujalmirgule/Sales_CRM.git`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- For complete instructions, see the **[Vercel Deployment Guide](file:///e:/Zero_Booth%20-Prj/Prj-Fldr/CRM/VERCEL_DEPLOYMENT.md)**.

> **Client Demo Note**: Data persists locally within the individual browser's HTML5 LocalStorage. Each user or device begins with the clean baseline demo dataset (`mockData.ts`).

---

## 🔑 Demo Access Accounts & Role Switcher

The prototype features an instant **Role Switcher** in the header and sidebar, as well as a full login screen (`/login`):

| Role | Name | Email | Password | Designation | Granted Permissions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Master Admin** | Rajesh Singhania | `master@demo.com` | `Demo@123` | Managing Director | Full Enterprise Super-Admin (All 32 Permissions) |
| **Sales Staff 1** | Rahul Sharma | `staff1@demo.com` | `Demo@123` | Sales Executive | Sales Executive Template (13 Duties: Assigned Leads & Dialer) |
| **Sales Staff 2** | Priya Patel | `staff2@demo.com` | `Demo@123` | Senior Closer | Senior Sales Executive Template (20 Duties: Deals & Pipeline) |

*All credentials are fictional demo accounts. The Master User can create unlimited additional staff accounts.*

---

## 🎯 Key Capabilities & Interactive Workflows

- **Dynamic Staff Management (Unlimited Scaling)**: Master User can dynamically register unlimited sales staff with custom credentials, edit profiles, reset passwords, activate/deactivate accounts with confirmation safeguards, and view 360-degree staff performance dossiers (individual leads, call logs, attendance sessions).
- **Granular Duty & Permission System**: 32 individual permissions across 11 functional domains, inspired by loan and banking operational workflows. Master can apply pre-built templates (*Sales Executive*, *Senior Closer*, *Lead Manager*, *Calling Executive*) or customize individual capability checkboxes.
- **Enforced Access Control**: Dynamic sidebar links, `PermissionRoute` route guards rendering branded `PermissionDeniedState` views, UI action button disabling, and contextual lead/call log data scoping.
- **Dynamic Lead Assignment Center**: Workload capacity cards with progress bars for all staff, unassigned inbound queue (Meta Ads/WhatsApp), assigned pipeline & reassignment tab, bulk allocation, and one-click **Automated Round-Robin**.
- **Mobile & Multi-Device Responsiveness**: Verified across 360px, 390px, 430px, 768px, 1024px, and 1440px viewports with off-canvas sidebar drawer, header hamburger menu, touch targets >= 44px, and controlled horizontal table scrolling.
- **12-KPI Executive Dashboard**: Live aggregate tracking of lead inflows, CPL, telecalling durations, conversions, and revenue realization.
- **Interactive Call Simulation Modal**: Click *Call Customer* anywhere to launch an active WebRTC telephony emulator with ringing, live call timers, disposition logging, and automatic timeline updates.
- **Third-Party Integrations Transparency**: Clear **"Not Connected / Demo Sandbox"** badges on Meta Ads, WhatsApp Business API, and Cloud Telephony with complete production API configuration guides.
- **Working CSV Exports**: One-click CSV downloads for Leads, Calling logs, Attendance, Sales ledger, and Audit activity logs.
- **LocalStorage Data Persistence**: Add leads, register staff, update duties, record calls, or reschedule follow-ups — changes persist across browser refreshes with a 1-click database reset option.

---

## 📁 Project Architecture

```
CRM/
├── src/
│   ├── assets/              # Icons and brand assets
│   ├── components/
│   │   ├── charts/          # Recharts visualizations (Lead trend, status pie, staff performance, revenue)
│   │   ├── common/          # Badges, StatCards, ConfirmDialogs, CallSimulationModal, PermissionDeniedState
│   │   ├── layout/          # Off-canvas mobile Sidebar, Header with scalable User Switcher, AppLayout
│   │   └── ui/              # Button, Input, Select, Badge, Card, Modal
│   ├── context/             # AuthContext (RBAC helpers), CRMContext (scoped data), ToastContext
│   ├── data/                # Realistic Indian seed dataset (32 leads, 28 calls, 14 follow-ups, campaigns, sales)
│   ├── modules/             # Dashboard, Leads, Lead Assignment, Calling, Followups, Team, Attendance, Sales, Marketing, Web Analytics, Integrations, Activity Logs
│   ├── routes/              # AppRoutes with PermissionRoute guards
│   ├── services/            # StorageService (LocalStorage abstraction for easy PostgreSQL/Prisma REST swap)
│   ├── types/               # Strict TypeScript definitions (32 permissions, staff, leads, calls, sales)
│   └── utils/               # Formatters (INR ₹ currency, duration mm:ss, date-fns) and exportCsv
├── index.html
├── package.json
├── tailwind.config.js       # Enterprise color palette (#171717, #F8FAFC, #EA580C)
├── vercel.json              # Vercel SPA rewrites and caching headers
└── vite.config.ts           # Code splitting with manual chunks
```

---

## 📚 Complete Technical Documentation

- **[IMPLEMENTATION_REPORT.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/IMPLEMENTATION_REPORT.md)**: Final verification sign-off report with complete 15-test execution logs.
- **[STAFF_MANAGEMENT.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/STAFF_MANAGEMENT.md)**: Dynamic user management architecture, roster scaling, and profile dossiers.
- **[PERMISSION_SYSTEM.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/PERMISSION_SYSTEM.md)**: 32-permission matrix, templates, route guards, and future backend RBAC schema.
- **[RESPONSIVE_AUDIT.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/RESPONSIVE_AUDIT.md)**: Comprehensive multi-device responsiveness audit (360px to 1440px).
- **[VERCEL_DEPLOYMENT.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/VERCEL_DEPLOYMENT.md)**: Vercel deployment guide, build commands, and LocalStorage persistence boundaries.
- **[DEMO_CREDENTIALS.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/DEMO_CREDENTIALS.md)**: Quick reference for client demonstration testing and role capabilities.
- **[QA_REPORT.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/QA_REPORT.md)**: Automated test suite verification matrix.
- **[FEATURES.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/FEATURES.md)**: Exhaustive breakdown of CRM features and workflows.
- **[FRONTEND_ARCHITECTURE.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/FRONTEND_ARCHITECTURE.md)**: React state management, design tokens, and modular code structure.
- **[FUTURE_BACKEND_PLAN.md](file:///e:/Zero_Booth -Prj/Prj-Fldr/CRM/FUTURE_BACKEND_PLAN.md)**: Node.js, Express, PostgreSQL, Prisma, Meta Graph API, and Cloud Telephony implementation plan.
