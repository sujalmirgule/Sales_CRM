# Staff Management System Architecture & User Guide

**Project:** Sales CRM — Client Presentation Prototype  
**Scope:** Dynamic User Management, Roster Scaling, Profile Dossiers, and Account Controls  
**Status:** Operational (Client Prototype with LocalStorage Persistence)

---

## 1. Overview & Business Context

In real-world real estate and high-velocity digital marketing sales operations, a business owner (Master User) manages an evolving team of inside sales representatives, telecallers, and closing managers. The Sales CRM provides an **unlimited, dynamic staff management system** that removes all hardcoded staff boundaries, allowing the sales organization to scale from 2 to 200+ employees.

---

## 2. Staff Lifecycle & Workflows

### 2.1 Staff Registration Workflow
1. Navigate to **Team Management** (`/team`) as the Master User.
2. Click the prominent orange **"Add New Staff"** button in the top-right header.
3. Complete the required employee information:
   - **Full Name**: e.g., *Vikramaditya Rathore*
   - **Email Address**: Used as the login username (e.g., *vikram@demo.com*); verified against existing accounts with case-insensitive duplicate checking.
   - **Mobile Number**: Indian E.164 phone format (+91 98200 XXXXX).
   - **Employee Designation**: Dropdown selection (Sales Executive, Senior Sales Executive, Lead Manager, Calling Executive, Key Account Manager, Telecaller) with custom input capability.
   - **Department / Sales Team**: Categorized by sales vertical (Inbound Meta Sales, High-Ticket Closing, WhatsApp Lead Response, Luxury Villa Sales).
   - **Initial Account Status**: *Active* (immediate login permit) or *Inactive* (deactivated on creation).
   - **Password & Confirm Password**: Minimum 6 characters (defaults to `Demo@123` for client demonstration).
   - **Profile Image URL**: Optional custom image URL or auto-assigned high-resolution Unsplash avatar.
4. Select duty permissions via pre-built templates or individual checkboxes.
5. Click **"Register Staff & Assign Duties"**. The account is immediately created, auto-assigned a unique enterprise identifier (`USR-STAFF-XX-YYY`), and saved to LocalStorage.

---

### 2.2 Profile Dossier & 360° Staff Inspection
Clicking any staff member's name or the eye icon in the directory table opens their comprehensive **Performance & Audit Dossier** containing 5 tabs:
1. **Performance Overview**: Key metrics including assigned lead volume, dial count, connected calls, accumulated talk time, conversion yield (%), and realized sales revenue.
2. **Duties & Permissions**: A complete list of all operational duties granted to this employee, grouped by category with active status checkmarks.
3. **Assigned Leads**: Interactive table of all prospects currently assigned to this representative with direct links to full lead detail pages.
4. **Calling Log**: Chronological telephony log of all outbound and incoming calls made by this representative, including duration, date, disposition, and remarks.
5. **Attendance & Login Sessions**: Daily clock-in/out records, session duration in minutes, and total active calling time.

---

### 2.3 Account Editing & Designation Updates
1. Click the pencil icon on any staff row in the directory.
2. Update the employee's name, email, phone number, designation, department, or active status.
3. Adjust granular duty permissions dynamically.
4. Changes are immediately saved and logged in the immutable system activity trail.

---

### 2.4 Staff Deactivation Safeguards
When an employee leaves the company or is placed on leave:
1. Master User clicks the deactivation button (UserX icon).
2. A confirmation dialog explains:
   - Login access is immediately disabled for this account.
   - All historical calling records, assigned leads, converted sales, and attendance sessions remain completely intact for compliance and reporting.
   - The employee is automatically excluded from all lead assignment dropdowns and round-robin distribution.
3. Deactivated accounts are clearly badged with a red **Deactivated** indicator in both the Team directory and the quick user switcher.
4. If an employee returns, Master User can click **Reactivate** with one click.

---

### 2.5 Password Reset for Demo Presentations
To facilitate smooth client testing without credential lockouts:
1. Click the key icon on any staff row.
2. Enter a new password or click the **"Set to Default (Demo@123)"** shortcut button.
3. Save changes. The employee can immediately log in with the new password.

---

## 3. Propagation Across CRM Modules

Newly registered staff accounts automatically propagate across:
- **Lead Assignment Center (`/lead-assignment`)**: Eligible staff immediately appear in the manual assignment dropdown, bulk allocation picker, and round-robin routing engine.
- **Calling Management (`/calling`)**: Telephony filter dropdowns and call attribution logs.
- **Attendance & Sessions (`/attendance`)**: Staff session tracking and daily clock-in/out registers.
- **Executive Dashboard (`/`)**: Staff productivity charts and leaderboard widgets.
- **Role Switcher & Login Screen (`/login`)**: Listed in the quick user switcher with active/inactive indicators.
