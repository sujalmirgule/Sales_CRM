# Demo Credentials & Role Testing Guide

**Project:** Sales CRM — Client Presentation Prototype  
**Scope:** Client Demonstration Script, Seed User Accounts, Permission Profiles & Feature Testing  

---

## 1. Demo User Accounts & Pre-Configured Permission Profiles

The prototype supports full enterprise role-based access control with granular permissions. The following baseline accounts are pre-seeded:

| Account | Name | Email | Password | Designation | Template Profile | Permissions Granted |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Master Admin** | Rajesh Singhania | `master@demo.com` | `Demo@123` | Managing Director | **Master Superuser** | All 32 permissions across all 11 modules |
| **Sales Staff 1** | Rahul Sharma | `staff1@demo.com` | `Demo@123` | Sales Executive | **Sales Executive** | 13 permissions (Assigned leads, outbound dialer, follow-ups, personal attendance) |
| **Sales Staff 2** | Priya Patel | `staff2@demo.com` | `Demo@123` | Senior Closer | **Senior Closer** | 20 permissions (All leads view, deal registration, sales pipeline, marketing campaign view) |
| **Dynamic Staff** | *Any Registered Staff* | *Configured Email* | *Configured Password* (defaults to `Demo@123`) | *Configured Designation* | *Template or Custom* | Granular duty permissions chosen by Master during registration |

*All credentials are fictional demo accounts.*

---

## 2. Instant Role Switcher & Dynamic Roster

To facilitate effortless client demonstrations without logging out repeatedly:

1. **Header Role Switcher**:
   - On desktop with <= 3 users: Click the Master pill or staff buttons to switch instantly.
   - On screens with > 3 users or on mobile: Click the user selector dropdown to pick any active team member.
2. **Sidebar User Card**:
   - Click the bottom user card in the left sidebar to inspect current active duties, role, designation, and switch accounts.
3. **Login Screen (`/login`)**:
   - Enter credentials directly or use the quick login shortcuts. Inactive accounts are clearly flagged and rejected with a security prompt.

---

## 3. Recommended Client Presentation Walkthrough

Follow this 6-step walkthrough to showcase the platform's core business value to prospective clients:

### Step 1: Master Executive Overview (`Rajesh Singhania`)
1. Review the **12 KPI cards** showing real-time lead inflows (32 total), CPL (₹1,090), total closed revenue (₹1.47 Cr+), and telecalling duration.
2. Inspect the **Lead Inflow vs Calling Activity** chart; toggle between 7D, 30D, and 90D views.
3. Review the **Recent Inbound Inquiries** table and **Today's Due Follow-ups**.

### Step 2: Dynamic Staff Creation & Duty Assignment
1. Navigate to **Team Management** (`/team`).
2. Click the orange **"Add New Staff"** button.
3. Enter employee details (e.g., *Vikramaditya Rathore*, `vikram@demo.com`, `+91 98200 44551`, Designation: *Key Account Closer*).
4. Select the **"Senior Sales Executive"** permission template; observe how the 20 relevant checkboxes auto-check.
5. Grant an additional capability (e.g., check `leads.export`).
6. Click **"Register Staff & Assign Duties"**. Notice the instant addition of Vikramaditya to the team directory and the generation of his enterprise ID (`USR-STAFF-03-xxx`).

### Step 3: Dynamic Lead Assignment Center
1. Navigate to **Lead Assignment** (`/lead-assignment`).
2. Observe the **Workload Capacity Cards** reflecting current active staff workload against their capacity limit (30 leads).
3. Switch to the **Unassigned Inbound Queue** tab to see 6 fresh Meta Ads and WhatsApp leads awaiting allocation.
4. Click **"Auto Round-Robin Distribution"** to watch the system evenly allocate the unassigned queue across all active eligible sales representatives.
5. Switch to the **Assigned Pipeline & Reassignment** tab to demonstrate how any lead can be reassigned to another representative with one click.

### Step 4: Role-Based Access Enforcement
1. Use the Header Switcher to switch to **Rahul Sharma (Sales Executive)**.
2. Notice the sidebar dynamically filters: high-privilege modules (*Team Management*, *Sales Ledger*, *Lead Assignment*, *BI Reports*) are automatically removed from navigation.
3. Navigate to **Leads** (`/leads`): Rahul only sees his personal assigned prospects.
4. Try typing `http://localhost:3000/team` directly in the browser address bar: the system intercepts the request and renders the branded **Permission Denied** screen explaining that `team.manage` is required.

### Step 5: Interactive Telephony Dialing & Conversion
1. While logged in as Rahul, open any assigned lead (e.g., `LEAD-1001: Aarav Mehta`).
2. Click **"Start Call"** to launch the active WebRTC telephony emulator.
3. Watch the simulated connection and live call timer count up.
4. Select disposition: *Answered & Completed*, enter call remarks, and save.
5. Observe the instant increment in call attempts and updated lead activity timeline.

### Step 6: Demo Reset
- To reset all created staff, modified leads, and call logs back to pristine factory seed data, click **"Reset Demo Data"** in the user switcher popup or under **Settings** (`/settings`).
