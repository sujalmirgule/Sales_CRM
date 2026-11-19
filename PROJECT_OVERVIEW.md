# Project Overview — Sales CRM Client Demo Prototype

## 1. Executive Summary

Businesses running paid digital advertisements on **Meta (Facebook & Instagram Lead Generation Ads)** face three critical challenges:
1. **Speed to Lead**: Inbound leads experience a 391% drop in qualification if not contacted within 5 to 15 minutes.
2. **Sales Team Visibility**: Business owners (Master Users) lack visibility into whether sales representatives are actually placing calls, how long they stay on calls, and why calls remain unanswered.
3. **Follow-up Leakage**: Over 60% of interested prospects drop out because follow-up callbacks are forgotten or rescheduled without oversight.

This **Sales CRM Client Demo Prototype** solves these problems by providing an enterprise-grade, high-velocity CRM frontend engineered for immediate client presentation.

---

## 2. Complete Lead Journey Lifecycle

The CRM models the entire lifecycle from digital ad impression to closed revenue:

```
[Meta FB / IG Ad Lead Generated]
               │
               ▼
   [Lead Assigned to Rep] ──(Auto Round-Robin or Manual Master Delegation)
               │
               ▼
      [First Call Attempt]
         ├── Connected ────► [Lead Stage: Contacted / Interested]
         └── Non-Connected ─► [Lead Stage: Not Connected / Reschedule]
               │
               ▼
     [Follow-up Scheduler] ──► (Today / Upcoming Reminders with Push Alerts)
               │
               ▼
  [Site Inspection / Virtual Walkthrough]
               │
               ▼
      [Final Disposition]
         ├── Closed Won  ──► [Converted to Sale — Revenue & Invoice Realized]
         └── Closed Lost ──► [Archived with Competitive Reason Logged]
```

---

## 3. Persona & Target Audiences

### Persona 1: Master User (Business Owner / VP of Sales)
- **Pain Points**: Doesn't know if ad budget is turning into calls. Needs aggregate funnel conversion rates, cost-per-lead (CPL) by ad campaign, and sales representative talk time metrics.
- **Key Modules Used**: Executive Analytics Dashboard, Lead Assignment Center, Telephony Monitoring, Sales & Revenue Ledger, Campaign Yield, Staff Attendance.

### Persona 2: Sales Executive (Inside Sales Rep)
- **Pain Points**: Needs a clean, distraction-free queue of their own assigned leads without seeing other reps' prospects. Needs 1-click dialer simulation and an organized calendar of today's callbacks.
- **Key Modules Used**: My Workspace, My Assigned Leads, Call Simulation Dialer, Follow-up Reminders, My Personal Calling Pace.

---

## 4. UI/UX Design System Compliance

| Element | Specification | Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Main Background** | Canvas surface | `#F8FAFC` | Clean, modern SaaS contrast |
| **Sidebar Canvas** | Navigation shell | `#171717` | Sleek enterprise dark backdrop |
| **Primary Accent** | Brand action | `#EA580C` | High-visibility warm orange (Linear/Stripe style) |
| **Card Surface** | Data container | `#FFFFFF` | Crisp borders and subtle elevation |
| **Primary Typography** | Body & headings | `Inter`, sans-serif | Apple & Stripe typography standard |
| **Monospace** | Phone, ID, Time | `JetBrains Mono` | High legibility for telephony data |
| **Success Color** | Connected / Won | `#16A34A` | Clear positive indicator |
| **Danger Color** | Lost / Failed | `#DC2626` | Non-connected / overdue alerts |
| **Borders** | Structural outlines | `#E2E8F0` / `#E5E7EB` | Clean structural hierarchy |
