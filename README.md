<div align="center">

# ⚡ POWERZONE : GYM & OFFICIAL SPORTS STORE
### Premier High-Performance Athletic Facility & Sports Equipment Hub
**Regional HQ:** Nagar-Manmad Highway, Shirdi, Maharashtra • Pincode: 423109

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Supabase Database](https://img.shields.io/badge/Database-Supabase%20Cloud-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![JavaScript](https://img.shields.io/badge/Engine-ES6%2B%20Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#-technology-stack)
[![WebGL 2.0](https://img.shields.io/badge/Graphics-WebGL2%20%2B%20OGL-990000?style=for-the-badge&logo=webgl)](#-visual-fx--webgl-engine)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license)

<br/>

<p align="center">
  <b>PowerZone</b> is a state-of-the-art hybrid fitness sanctuary and authentic tournament-grade sports store. Built with international biomechanical engineering principles, it delivers 24/7 keyless biometric gym access, Olympic powerlifting coaching, certified turf conditioning, an e-commerce gear shop, and an automated athletic slot reservation engine.
</p>

[Explore Pages](#-application-sitemap--pages) •
[Tech Stack](#-technology-stack) •
[Network Endpoints](#-network-addresses--endpoints) •
[Installation](#-local-installation--setup) •
[Vercel Deployment](#-vercel-deployment-guide)

---

</div>

<br/>

## 🌟 Executive Summary & Key Highlights

- 🏋️‍♂️ **Championship Coaching Curriculum**: 4 comprehensive disciplines featuring 8 realistic training programs spanning Olympic Powerlifting, HIIT Metabolic Conditioning, Myofascial Recovery with Thermal Infrared Steam, and Turf / Cricket Agility Drills.
- 📅 **Smart Slot Reservation Guard**: Real-time slot conflict prevention ensuring athletes cannot double-book the same hour. The initial trial reservation is 100% free; subsequent bookings systematically apply a ₹199 nominal fee and immediately sync to the user's account dashboard under `pz_user_bookings`.
- 🛍️ **Tournament-Grade Sports Store**: Authentic certified inventory including SG Cricket tournament balls, Olympic liquid grip chalk, stainless gym shakers, competition medals, and powerlifting lever belts with dynamic 2-use promo code discounts (`POWERZONE20`).
- 🧮 **Precision Athletic Blueprint**: Advanced BMI and caloric intake calculator factoring gender, activity multiplier, and goal profiles (Fat Loss, Powerlifting, Agility) to output daily calorie, hydration, and macronutrient targets.
- 🌊 **PatternWaves WebGL2 Engine (100% Vanilla JS)**: Silky interactive fluid wave simulation powered by OGL with dynamic cursor wake tracking, ambient light grazing, and edge fading without React or external bundlers.
- 📦 **Automated PDF Invoicing & Instant Receipts**: Native vector PDF receipt generation directly in the client browser using jsPDF with verified QR tracking and breakdown stamps.
- 🛡️ **Executive Intelligence Portal**: Dedicated admin command center featuring real-time KPI telemetry, member enrollment tables, and Supabase cloud sync.

---

## 🗺️ Application Sitemap & Pages

| Page Route | Description | Primary Features |
| :--- | :--- | :--- |
| [`index.html`](file:///d:/AntiGravity/POWERZONE/index.html) | **Main Flagship Portal** | Silk Wave Hero, Live Floor Occupancy Meter, Free VIP Pass Generator, Interactive Workout Quiz, Athletic Blueprint BMI Calculator |
| [`classes.html`](file:///d:/AntiGravity/POWERZONE/classes.html) | **Training Curriculum & Schedule** | Ocean Wave Hero, 8 Detailed Programs, Discipline Filter Pills, "Explore More" Syllabus Modals, Schedule Timetable with Instant Slot Reservation |
| [`shop.html`](file:///d:/AntiGravity/POWERZONE/shop.html) | **Sports Gear & Club Offers** | Lines Wave Hero, Full E-Commerce Catalog, View Switcher ("Sports Store" vs "Club Offers"), Slide-Over Shopping Cart, Address & Pincode Validation Checkout |
| [`portal.html`](file:///d:/AntiGravity/POWERZONE/portal.html) | **Admin Command Center** | PIN-Authenticated Admin Terminal, Revenue KPIs, Live Order Lifecycle Management, Member Directory, Cloud Lead Tracking |

---

## 🛠️ Technology Stack

```
POWERZONE HYBRID ARCHITECTURE
├── CLIENT PRESENTATION LAYER
│   ├── Semantic HTML5 (Mobile-First, SEO-Engineered, Accessible)
│   ├── Vanilla CSS3 (Custom Design Tokens, HSL Light/Dark Themes, Glassmorphism)
│   └── Modern ECMAScript (ES6+ Classes, Async/Await, Web Storage API, ES Modules)
├── GRAPHICS & SHADER PIPELINE
│   ├── WebGL 2.0 (High-performance GPU rendering)
│   ├── OGL Shader Engine (Pure Vanilla JS <PatternWaves> Silk/Ocean/Lines shaders)
│   └── Canvas 2D Particle Physics (Ember Particle Simulator)
├── CLOUD SERVICES & PERSISTENCE
│   ├── Supabase Cloud (PostgreSQL 15, Row-Level Security, Realtime Subscriptions)
│   ├── REST API v1 Fallback (Fetch executor with apikey / Bearer tokens)
│   └── LocalStorage Hybrid Cache ('pz_user_bookings', 'pz_cart_items', 'pz_theme')
└── CLIENT-SIDE ENGINES
    └── jsPDF Engine (Vector receipt & starter kit PDF compiler)
```

### Detailed Dependencies:

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Vanilla Web Standards | HTML5 / ES6+ | Ultra-fast load times, zero-dependency browser performance |
| **Styling** | Modular Vanilla CSS | CSS3 | Responsive layouts, CSS Variables, Theme Switching (`[data-theme]`) |
| **Graphics** | [OGL](https://github.com/oframe/ogl) | `v1.0.11` | Minimal WebGL2 library driving `<PatternWaves />` shaders |
| **Database** | [Supabase JS](https://supabase.com/docs) | `v2.x` | User leads, order processing, and member databases |
| **PDF Engine** | [jsPDF](https://github.com/parallax/jsPDF) | `v2.5.1` | Instant official tax receipt and starter kit downloads |
| **Hosting** | [Vercel](https://vercel.com) | Edge | Global CDN, HTTP/2 static delivery, `cleanUrls` routing |

---

## 🌐 Network Addresses & Endpoints

### 1. Local Network Endpoints
```text
Local Server Base:        http://127.0.0.1:5500
Local Hostname:           http://localhost:5500
Alternative Dev Port:     http://127.0.0.1:5502
```

### 2. Remote Version Control Repository
```text
Git Remote Origin:        https://github.com/Siddhitambe1414/PowerZone_IBSL.git
Branch:                   main
```

### 3. Cloud Database & REST Endpoints (Supabase)
```text
Database Project URL:     https://clcmpfzzhmrnqoydnwoi.supabase.co
PostgREST API Endpoint:   https://clcmpfzzhmrnqoydnwoi.supabase.co/rest/v1
Authentication Service:   https://clcmpfzzhmrnqoydnwoi.supabase.co/auth/v1
Storage Service:          https://clcmpfzzhmrnqoydnwoi.supabase.co/storage/v1
```

### 4. Public Content Delivery Networks (CDN)
```text
Supabase Client SDK:      https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
jsPDF Library:            https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
OGL WebGL Engine:         https://esm.sh/ogl
```

---

## 💻 Local Installation & Setup

### Prerequisites
Make sure you have any modern web browser (Chrome, Edge, Firefox, Safari) and one of the following runtimes:
- **Python 3.8+** (recommended for zero-config static serving)
- **Node.js 18+** (optional, for development tooling)
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/Siddhitambe1414/PowerZone_IBSL.git
cd PowerZone_IBSL
```

### Step 2: Configure Environment Variables
Copy the provided `.env.example` template to `.env`:

```bash
# On Windows PowerShell
Copy-Item .env.example .env

# On Linux / macOS
cp .env.example .env
```

Review your [`.env`](file:///d:/AntiGravity/POWERZONE/.env) file:
```env
# ==========================================
# DATABASE (SUPABASE)
# ==========================================
SUPABASE_URL=https://clcmpfzzhmrnqoydnwoi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY21wZnp6aG1ybnFveWRud29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTgxNTUsImV4cCI6MjEwMzA3NDE1NX0.dbJpi4KATdWc3jDElwg45vL6n8QR-abDbfvPLL6tqYM

NEXT_PUBLIC_SUPABASE_URL=https://clcmpfzzhmrnqoydnwoi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY21wZnp6aG1ybnFveWRud29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTgxNTUsImV4cCI6MjEwMzA3NDE1NX0.dbJpi4KATdWc3jDElwg45vL6n8QR-abDbfvPLL6tqYM

# ==========================================
# SERVER CONFIGURATION
# ==========================================
PORT=5500
HOST=127.0.0.1
NODE_ENV=production
```

### Step 3: Run Local Server

#### Option A: Using Built-in Python Server
```bash
python server.py
# Server listening at http://127.0.0.1:5500
```

#### Option B: Using Node.js HTTP Server
```bash
npx serve . -l 5500
```

Open your browser and navigate to **`http://127.0.0.1:5500`**.

---

## 🚀 Vercel Deployment Guide

This project is fully optimized for **zero-configuration deployment on Vercel**.

### Step 1: Import Project in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New"** → **"Project"**.
2. Select your repository: `Siddhitambe1414/PowerZone_IBSL`.
3. Set the Framework Preset to **"Other"** (Root directory: `./`).

### Step 2: Configure Environment Variables
Paste the contents of your [`.env`](file:///d:/AntiGravity/POWERZONE/.env) directly into **Project Settings → Environment Variables**:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NODE_ENV=production`

### Step 3: Deploy
Click **"Deploy"**. The site will build instantly with edge caching enabled via [`vercel.json`](file:///d:/AntiGravity/POWERZONE/vercel.json):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## 📂 Project Directory Structure

```text
d:\AntiGravity\POWERZONE\
├── .env                              # Production environment variables (Git-ignored)
├── .env.example                      # Sanitized environment template
├── .gitignore                        # Git ignore patterns
├── README.md                         # Comprehensive documentation
├── vercel.json                       # Vercel deployment & security configuration
├── server.py                         # Lightweight local Python server (port 5500)
├── index.html                        # Flagship homepage
├── classes.html                      # Training curriculum & schedule
├── shop.html                         # Sports store & club offers
├── portal.html                       # Admin executive intelligence terminal
│
├── css/                              # Modular CSS Architecture
│   ├── base/
│   │   ├── reset.css                 # Modern CSS box reset
│   │   ├── typography.css            # Outfit & Inter typography tokens
│   │   └── variables.css             # Theme colors, CSS variables & tokens
│   ├── components/
│   │   ├── buttons.css               # Interactive button states & glows
│   │   ├── footer.css                # Site footer & operational details
│   │   ├── modals.css                # Modal dialogs & account profile orders
│   │   ├── navbar.css                # Sticky glass navbar & mobile drawer
│   │   ├── pattern-waves.css         # WebGL canvas background container
│   │   └── toast.css                 # Sliding notification system
│   └── pages/
│       ├── home/ (hero, bmi, programs, trial)
│       └── shop/ (cart-drawer, checkout)
│
└── js/                               # Modular Vanilla JavaScript Architecture
    ├── classes/
    │   └── schedule-tabs.js          # Class timetable & slot conflict detector
    ├── components/
    │   └── pattern-waves.js          # Browser-ready WebGL2 PatternWaves engine
    ├── core/
    │   ├── auth.js                   # Profile modal & user bookings renderer
    │   ├── supabase-client.js        # Supabase client singleton & REST fallback
    │   └── theme.js                  # Light / Dark mode switcher with persistence
    ├── database/
    │   ├── leads-db.js               # Cloud leads ingestion table
    │   ├── members-db.js             # Member profiles & status checks
    │   └── orders-db.js              # Order persistence & customer history
    ├── home/
    │   ├── bmi-calculator.js         # Athletic blueprint & calorie calculation
    │   ├── hero-ticker.js            # Live gym occupancy ticker
    │   └── trial-lead.js             # Form handler saving to 'pz_user_bookings'
    ├── portal/
    │   ├── portal-actions.js         # PIN login, export CSV & quick updates
    │   ├── portal-kpi.js             # Executive dashboard KPIs calculation
    │   └── portal-orders.js          # Order fulfillment table renderer
    ├── shop/
    │   ├── cart-manager.js           # Cart state, item count & coupon capping
    │   ├── checkout-handler.js       # Pincode regex, order summary & UPI trigger
    │   ├── product-render.js         # Store & club offers view renderer
    │   └── products-data.js          # Tournament-grade sports catalog
    └── particles.js                  # Canvas 2D ambient ember particle FX
```

---

## 🔐 Credentials & Demo Testing Accounts

| Module | Identifier | Secret / PIN | Role / Capability |
| :--- | :--- | :--- | :--- |
| **Admin Portal** | `admin@powerzone.in` | `1234` | Full access to Executive Telemetry, Member DB & Order Management |
| **VIP Athlete Demo** | `Reva` (`+91 98765 43210`) | N/A | Pre-loaded VIP member with active passes & order receipts |
| **Discount Coupon** | `POWERZONE20` | N/A | 20% discount on sports gear (strictly capped at 2 redemptions) |

---

## 📍 Regional Hub & Contact Information

- **Facility Address**: PowerZone Arena, Nagar-Manmad State Highway, Shirdi, Ahmednagar District, Maharashtra - 423109
- **Operating Hours**: Monday – Sunday: 5:00 AM – 10:00 PM (24/7 for Biometric Keyless Members)
- **Telephone / WhatsApp**: `+91 98765 43210`
- **Email Inquiries**: `info@powerzone.in`

---

## 📄 License

This project is licensed under the **MIT License**. You are free to modify, distribute, and integrate this software into your athletic and e-commerce platforms.

<div align="center">
  <b>Built with passion for athletic excellence at PowerZone Shirdi.</b>
</div>
