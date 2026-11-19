# Sriyam School CRM & Secure Student Portal

A modern, comprehensive School CRM and Student Information System (SIS) built for **Sriyam School & Junior College**, featuring enterprise-grade document DRM protection for proprietary curriculum materials.

## ✨ Core Highlights

1. **Student Logins & Role-Based Access Control (RBAC)**:
   - Dedicated authentication flows for **Super Admin / Principal**, **Faculty**, and **Enrolled Students**.
   - Admin credential provisioning: One-click temporary password generation and formatted credential export for SMS/Email dispatch.

2. **Strict Read-Only Student Privilege**:
   - Students cannot edit, modify, or delete any records or materials.
   - Student dashboard provides access only to assigned academic curriculum, lecture schedules, fee receipts, and circulars.

3. **Multi-Layered Document Protection (Anti-Download & Anti-Screenshot)**:
   - **Canvas-Rendered Vector Stream**: Documents are rendered onto an HTML5 `<canvas>` using 2D vector context. No selectable text and no raw PDF binaries are exposed in the DOM or network streams.
   - **Dynamic Forensic Watermark**: Diagonally repeats the student's **Full Name**, **Roll Number**, **IP Address**, and **Live Timestamp** across all canvas pixels. Any external photo or physical capture is immediately forensically traceable.
   - **Active Screen Shield**: The viewer automatically blurs/covers when the browser loses focus (e.g. when opening snipping tool or switching apps).
   - **Blocked Interactions**: Intercepts `Ctrl+S`, `Cmd+S`, `Ctrl+P`, `Cmd+P`, `PrintScreen`, right-click context menu, and text selection. Print stylesheets hide all content.

4. **Complete School CRM Capabilities**:
   - **Admissions Pipeline**: 5-stage visual Kanban funnel (New Inquiry → Campus Tour → Test Scheduled → Offer Made → Enrolled).
   - **Student Information System (SIS)**: Student directory with attendance metrics, GPA tracking, and fee statuses.
   - **Curriculum & Document Vault**: Faculty upload pipeline with confidentiality classifications (`CONFIDENTIAL`, `STRICT_INTERNAL`, `READ_ONLY_STUDENT`).
   - **Fee Management & Invoicing**: Revenue collection summaries, dues tracking, and downloadable payment receipts.
   - **Circulars & Notices**: School-wide notifications and exam announcements.
   - **Security & DRM Audit Telemetry**: Real-time logging of student access, blocked print attempts, and security shield triggers.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Plus Jakarta Sans / Inter Typography
- **Icons**: Lucide React
- **Security & DRM**: Custom HTML5 Canvas Vector Renderer + Dynamic Watermark Engine + Focus-Lost Shield

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sriyam-school-crm.git

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

