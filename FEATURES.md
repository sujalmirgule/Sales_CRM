# System Features & Functional Specifications

**Project:** Sales CRM — Client Presentation Prototype  
**Scope:** Exhaustive Feature Inventory, Interactive Workflows, Access Control & Deployment Capabilities  

---

## 1. Executive Master Dashboard
- **12 Real-Time KPI Cards**: Total Leads, Today's Inflow, New Leads, Assigned Leads, Interested Prospects, Converted Deals, Conversion Rate (%), Realized Revenue (INR ₹), Total Call Logs, Missed/Busy Dials, Pending Follow-ups, and Website Visitors.
- **6 Interactive Recharts Visualizations**:
  - *Lead Inflow vs Calling Pace* (AreaChart with 7D, 30D, and 90D timeline toggles).
  - *Lead Pipeline Distribution* (Donut/PieChart with custom tooltips and status breakdown).
  - *Calling Dispositions* (BarChart of connected, no-answer, busy, failed outcomes).
  - *Sales Staff Productivity* (Comparative bar chart of leads vs dials vs conversions).
  - *Realized Revenue Velocity* (AreaChart showing gross realized sales in INR ₹).
  - *Campaign Lead Yield* (BarChart comparing Meta FB vs IG vs Google Ads).
- **Recent Marketing Leads Table**: Live inbound feed with 1-click quick call action.
- **Due Follow-ups Widget**: Today's prioritized callbacks with 1-click completion.
- **Staff Performance Leaderboard**: Rep avatar, rank, call count, talk time, and revenue generated.

---

## 2. Dynamic Team & Staff Management (`/team`)
- **Unlimited Staff Account Scaling**: Removed all hardcoded employee bounds; Master User can dynamically scale the sales organization to any number of staff members.
- **2-Step Staff Registration Workflow**:
  - *Step 1: Employee Details*: Full Name, Email (login username with case-insensitive uniqueness check), Mobile (+91 format), Designation, Department/Vertical, Initial Account Status, Password/Confirm Password, and Profile Image URL.
  - *Step 2: Assign Duties & Permissions*: Granular capability selection via 5 pre-built templates or freeform checkboxes.
- **5-Tab Comprehensive Staff Profile Dossier**:
  - *Performance Overview*: Assigned leads, call volume, connected calls, talk time, and conversion rate.
  - *Duties & Permissions*: Complete grouped checklist of operational capabilities granted to this user.
  - *Assigned Leads*: Interactive table of prospects assigned to this employee with direct links.
  - *Calling Log*: Telephony records of all outbound/inbound calls made by this representative.
  - *Attendance Sessions*: Daily clock-in/out records, shift duration, and talk time.
- **Account Safeguards & Editing**:
  - Edit employee designation, department, contact info, and granted permissions.
  - 1-click account deactivation with clear confirmation dialog explaining that logins are blocked while historical leads, calls, and conversions are safely retained.
  - Demo password reset modal with instant **"Set to Default (Demo@123)"** button for testing.

---

## 3. Granular Duty & Permission Assignment Matrix
- **32 Distinct Permissions in 11 Categories**:
  - *Dashboard*: `dashboard.view`
  - *Lead Management*: `leads.view`, `leads.view_all`, `leads.create`, `leads.edit`, `leads.assign`, `leads.archive`, `leads.export`
  - *Telephony*: `calls.view`, `calls.initiate`, `calls.record_attempt`, `calls.view_history`, `calls.view_all_history`
  - *Follow-ups*: `followups.view`, `followups.create`, `followups.edit`, `followups.complete`, `followups.view_all`
  - *Sales & Revenue*: `sales.view`, `sales.create`, `sales.edit`, `sales.view_revenue`
  - *Marketing*: `marketing.view`, `campaigns.view`, `campaigns.manage`
  - *Website Analytics*: `website_analytics.view`, `website_analytics.export`
  - *BI Reports*: `reports.view`, `reports.export`
  - *Staff & HR*: `team.view`, `team.manage`
  - *Attendance*: `attendance.view_own`, `attendance.view_all`
  - *Audit Trail*: `activity_logs.view`
- **5 Reusable Permission Templates**: *Sales Executive*, *Senior Closer*, *Lead Manager*, *Calling Executive*, and *Custom Role*.
- **Multi-Level Enforcement**: Dynamic sidebar menu filtering, `PermissionRoute` route guards, UI action button disabling, and contextual lead/telephony data scoping.

---

## 4. Dynamic Lead Assignment Center (`/lead-assignment`)
- **Staff Workload Capacity Cards**: Real-time workload progress cards for every active representative, displaying current active leads against the 30-lead capacity threshold.
- **Unassigned Inbound Queue Tab**: Interactive queue of unassigned Meta Ads, WhatsApp, and Web inquiries with individual assignment selectors and batch selection checkboxes.
- **Assigned Pipeline & Reassignment Tab**: Searchable table of assigned leads allowing one-click reassignment to any active representative.
- **Automated Round-Robin Distribution**: 1-click button that automatically distributes unassigned leads evenly across all active staff members with `leads.view` permissions.
- **Inactive Staff Filtering**: Deactivated employees are automatically excluded from assignment dropdowns and round-robin queues.

---

## 5. Lead Directory & Pipeline Management (`/leads`)
- **Enterprise Data Table**: Displays Lead ID, Customer Name, Phone, Email, Marketing Source, Campaign, Assigned Staff, Status, Total Attempts, Last Contact Date, Next Follow-up, and Creation Date.
- **Multi-Parameter Filtering**: Filter concurrently by Status, Marketing Source, Assigned Sales Rep, and Search keyword.
- **Column Sorting & Pagination**: Sort by any header ascending/descending with 10 records per page pagination.
- **Add Lead Modal**: Complete form validation (Zod + React Hook Form) supporting customer name, phone (+91 format), email, marketing source, campaign, interested product, priority, estimated budget, remarks, and scheduled follow-up.
- **CSV Export**: Instant browser download of filtered or full lead records (guarded by `leads.export`).
- **Lead Archiving**: Confirmation dialog to safely archive inactive leads (guarded by `leads.archive`).

---

## 6. Dedicated Lead Dossier (Detail View: `/leads/:id`)
- **Customer Identity Header**: Lead ID, status badge, priority badge, customer phone, email, and source attribution.
- **Lead Telephony Analytics**: Dials attempted, connected count, non-connected count, and cumulative talk duration.
- **5-Tab Navigation**:
  - *Activity Timeline*: Chronological event stream displaying initial lead generation, each call attempt, notes authored, and conversion status.
  - *Call History*: Structured log of every telephone dial with start time, duration, disposition, and agent remarks.
  - *Follow-ups*: Active and completed scheduled reminders for this specific lead.
  - *Notes*: Interactive note-authoring form allowing team members to append persistent internal commentary.
  - *Website Pixel Activity*: Pageview history, dwell times, and form download telemetry.
- **Action Triggers**: Call Customer (simulate call), Schedule Follow-up, Change Status, Assign Rep, and Convert to Sale.

---

## 7. Telephony & Calling Management (`/calling`)
- **Interactive Call Simulation Modal**:
  - Simulates PBX call initiation and realistic customer handset ringing state.
  - Live duration timer while connected.
  - Disposition outcome selector (Answered & Completed, Ringing No Answer, Busy Line, Failed / Switched Off, Rejected).
  - Call remarks entry.
  - Automatic updates to lead attempts, talk time, lead status, rep attendance, and activity audit log.
  - Transparent demo label indicating zero telecommunication charges.
- **Full Call Register**: Searchable history by customer name, phone, call ID, agent, and status.
- **Telephony KPIs**: Total Dials, Outgoing, Incoming, Answered, Missed, Non-connected, Total Talk Time, and Average Talk Time.

---

## 8. Follow-up Management & Reminders (`/followups`)
- **4 Categorized Views**:
  - *Today's Due*: Callbacks required before end of day.
  - *Upcoming*: Touchpoints scheduled over the next 7 days.
  - *Overdue*: Missed follow-up dates flagged in red.
  - *Completed*: Historical archive of fulfilled client appointments.
- **Calendar Planner View**: Visual card-based day-by-day planner.
- **Actions**: 1-click "Done" completion, Reschedule modal (date/time picker), and instant dialer launch.

---

## 9. Attendance & Login Sessions (`/attendance`)
- **Live Active Session Monitoring**: Real-time indicator of logged-in sales staff.
- **Productivity Time Split**: Total session shift duration vs active calling time vs talk time vs estimated idle time.
- **Staff-Wise Working Hours Chart**: Visual bar comparison of desk hours vs customer talk time.
- **Historical Reports**: Daily, weekly, and monthly attendance filters with CSV export.

---

## 10. Sales & Revenue Realization (`/sales`)
- **Confirmed Booking Ledger**: Customer name, unit number, agreement amount, payment stage (Paid in Full, Token Advance, Loan Verification), invoice number, and closing executive.
- **Record Sale Modal**: Converts any active lead into a finalized transaction.
- **Staff Revenue Contribution Chart**: Compares closed revenue in ₹ Lakhs across reps.

---

## 11. Marketing & Meta Ads Attribution (`/marketing`)
- **Campaign Performance Grid**: Facebook, Instagram, and Search campaigns with total spend, leads generated, cost-per-lead (CPL), conversions, and ROI.
- **Integration Blueprint**: Modal detailing Facebook Graph API v20.0 webhook integration for production deployment.

---

## 12. Integrations Hub (`/integrations`)
- **Transparent Sandbox Badges**: Clearly flags Meta Ads, WhatsApp Business API, and Cloud Telephony (Twilio / Exotel) as **"Not Connected / Demo Sandbox"**.
- **Production Architecture Blueprints**: Step-by-step technical guides for Meta Graph API Webhooks, WhatsApp Cloud API Permanent Tokens, and WebRTC SIP Trunking.

---

## 13. Mobile Responsiveness & Multi-Device Usability
- **Off-Canvas Mobile Drawer**: Sidebar transitions into a touch-friendly drawer on screens `< 768px` with dark backdrop blur.
- **Mobile Header Hamburger**: Dedicated hamburger button for rapid one-touch menu toggle.
- **Responsive Layout**: Replaced rigid desktop padding with `pl-0 md:pl-64` and `overflow-x-hidden`.
- **Controlled Scroll Tables**: Preserves table data hierarchy on 360px-430px viewports with `overflow-x-auto`.

---

## 14. Vercel Deployment & SPA Routing
- **Pre-Configured `vercel.json`**: Configured with SPA rewrite rule (`"source": "/(.*)", "destination": "/index.html"`), security headers, and static caching headers.
- **Verified Production Build**: 100% clean TypeScript compilation and Vite build (`npm run build`).
