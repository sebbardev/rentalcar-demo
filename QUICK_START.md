# 🚀 Car Rental Demo - Next.js Only

## ✅ Demo Mode Active!

This is a **demonstration version** of the car rental application using **Next.js only** with mock data. No backend required!

---

## 📋 What Changed

### 🗑️ Removed
- ✅ Laravel backend (entire `backend/` directory)
- ✅ Database dependencies (MySQL)
- ✅ API endpoints (replaced with mock data)

### ✨ Added
- ✅ Mock data for cars, bookings, expenses, reviews, and hero images
- ✅ All services updated to use local mock data
- ✅ Simulated async operations for realistic behavior
- ✅ Full admin dashboard functionality with mock data

---

## 🎯 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm run dev
```

### 3. Open in Browser
Visit: [http://localhost:3000](http://localhost:3000)

---

## 📊 Mock Data Included

### Cars (3 vehicles)
- Dacia Logan (Économique)
- Renault Clio 5 (Compacte)
- Peugeot 3008 (SUV)

### Bookings (4 reservations)
- Completed, confirmed, pending, and cancelled statuses

### Expenses (8 entries)
- Insurance, vignette, maintenance, and credit payments

### Reviews (4 testimonials)
- Customer ratings and comments

### Hero Images (3 slides)
- Homepage carousel images

---

## 🔧 Features Available

✅ **Public Site**
- Browse cars
- View car details
- Make bookings (simulated)
- Submit reviews (simulated)
- Hero image carousel

✅ **Admin Dashboard**
- View all bookings
- Manage cars
- Track expenses
- View statistics
- Planning board
- Contract management
- Contact messages

---

## 💡 How It Works

All services now use mock data instead of making API calls:

```typescript
// Before (with Laravel backend)
const response = await fetch(`${API_URL}/cars`);
const data = await response.json();

// After (demo mode)
import { mockCars } from "../data/mockCars";
return mockCars.map(mapMockCarToFrontend);
```

Services updated:
- ✅ `carService.ts`
- ✅ `bookingService.ts`
- ✅ `expenseService.ts`
- ✅ `reviewService.ts`
- ✅ `statsService.ts`
- ✅ `heroImageService.ts`
- ✅ `unavailabilityService.ts`

---

## 📝 Important Notes

⚠️ **This is a DEMO version**
- Data is static and resets on restart
- No persistent storage
- No real email sending
- No authentication backend

✅ **Perfect for**
- Demonstrations
- Presentations
- UI/UX testing
- Feature showcases

---

## 🎨 Customization

Want to modify the mock data? Edit these files:

- `src/data/mockCars.ts` - Vehicles
- `src/data/mockBookings.ts` - Reservations
- `src/data/mockExpenses.ts` - Expenses
- `src/data/mockReviews.ts` - Reviews
- `src/data/mockHeroImages.ts` - Hero images

---

## 🚀 Build for Production

```bash
npm run build
npm start
```

---

## 📚 Architecture

```
Frontend Only (Next.js)
├── Mock Data (src/data/)
├── Services (src/services/)
├── Components (src/components/)
├── Pages (src/app/)
└── No Backend Required!
```

---

**Demo Created:** April 19, 2026  
**Status:** ✅ Ready for Demonstration  
**Tech Stack:** Next.js 14 + React 18 + TailwindCSS
