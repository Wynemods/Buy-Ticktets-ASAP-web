

# ✈️ ASAP Tickets – Enterprise-Grade Flight Booking Platform 💳💼 (\$1,800)

This project is a **high-performance, React.js-powered** ✨ Single Page Application (SPA) engineered for **ASAP Tickets** to manage **end-to-end flight operations** — from flight configuration 🛫, to booking management 🧳, to **PCI-compliant** payment processing 💳.

It delivers a **scalable, modular, and secure** architecture 🛡️ with **real-time Firebase Firestore integration**, enabling dynamic flight template generation, passenger data handling, secure payments, and deep analytics tracking 📊.

---

## 🏗️ **System Overview**

The platform is architected as a **React + Vite SPA** ⚡ with **React Router DOM** for route orchestration.
**Data persistence & real-time updates** are powered by **Google Firebase Firestore** 🔥.
The solution supports:

* Customizable **Flight Configuration Templates** ✏️
* **Unique, encoded booking URLs** 🔗
* Passenger data validation 🛂
* Split & voucher-based payments 🎟️
* Advanced analytics tracking 📈

---

## 🚀 **Core Feature Set**

* **🛠️ Flight Configuration Generator**
  Full-featured flight template builder with multi-segment routing, layover configuration, pricing matrix 💲, and branding assets integration 🎨.

* **🖥️ Booking Interface**
  Dynamic booking page rendering flight details, **real-time price recalculation** based on passenger count, and **form validation with regex precision** ✅.

* **💳 Payment Module**
  Secure checkout with support for:

  * Voucher codes 🎟️
  * Split payment flows 🔄
  * Optional services: **TravelCare**, **DreamPass**, **Baggage Protection** 🛄
  * PCI-compliant data handling 🔐

* **🔥 Firebase Firestore Integration**
  CRUD operations for flight configs, bookings, and payments with **sub-collection architecture** for scalability.

* **📡 URL Data Encoding**
  Encodes flight configuration JSON to URL-safe Base64, generating **shareable, loadable booking links**.

* **📊 Analytics Layer**
  Tracks **click-through rates**, template usage frequency, and conversion funnels for business intelligence.

---

## 🗂️ **Project Architecture**

```
📂 root
 ├── public/               # Static assets (favicon, SVGs)
 ├── src/
 │   ├── App.jsx           # Router entrypoint
 │   ├── main.jsx          # React root mount
 │   ├── components/       # Modular UI components
 │   │   ├── FlightConfig.jsx   # Template generator
 │   │   ├── HomePage.jsx       # Booking UI
 │   │   ├── PaymentPage.jsx    # Checkout flow
 │   ├── services/
 │   │   └── FlightService.js   # Firebase CRUD + URL tools
 │   ├── assets/           # Brand images, icons
 └── index.html            # Root HTML
```

---

## 🧩 **Component Deep Dive**

### ✏️ FlightConfig.jsx

* Multi-tab UI (Basic Info, Segments, Customization)
* **Firestore write ops** with async/await 🔄
* Template duplication + quick load functionality

### 📑 HomePage.jsx

* Parses **encoded flight data** from URL params
* Passenger form validation with **Yup/Custom Validators** ✅
* **Urgency countdown timers** ⏳ to drive conversions

### 💰 PaymentPage.jsx

* Fetches booking by ID from Firestore
* **Split payment orchestration** 🔄
* Modal-driven UX for passenger edit, baggage fee calc, fare rule display
* Price breakdown with **dynamic subtotal & discount application**

### ⚙️ FlightService.js

* Firebase abstraction layer for:

  * Bookings CRUD
  * Config persistence
  * Payment tracking
  * **Legacy URL parsing** for backward compatibility 🔄

---

## 🛠️ **Tech Stack**

* **Frontend:** React.js + React Router
* **Backend-as-a-Service:** Firebase Firestore 🔥
* **Styling:** Tailwind CSS 🎨
* **Icons:** Lucide React 🖌️
* **Phone Input:** react-phone-input-2 📱
* **Build Tool:** Vite ⚡

---

## 📌 **Notable Facts**

* 🚀 Used in **production** by ASAP Tickets
* 🔐 Real-time sync between booking & payment status
* 💵 Initial build purchased at **\$1,350** (later extended to \$1,800 value)
* 🏆 Developed by **Alexmods** as a high-ROI enterprise web app

---

## ▶️ **Deployment & Execution**

```bash
npm install   # Install dependencies 📦
npm run dev   # Local development 🚀
```

Access at: **[http://localhost:3000](http://localhost:3000)** 🌍

---

## 📞 **Support**

For operational queries, reach out to the travel agent contact configured in the **Flight Configuration** settings panel.

---


