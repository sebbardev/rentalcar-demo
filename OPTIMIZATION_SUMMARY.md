# Car Rental Application - Demo Mode

## Overview
This is a **demonstration version** of the car rental application built with **Next.js only**. The Laravel backend has been removed and replaced with mock data for easy demonstration and testing.

---

## ✅ Changes Made

### Removed
- ✅ Laravel backend directory (entire `backend/` folder)
- ✅ Database dependencies (MySQL connection)
- ✅ API URL configuration
- ✅ All backend API calls

### Added
- ✅ Mock data system in `src/data/`
  - `mockCars.ts` - 3 sample vehicles
  - `mockBookings.ts` - 4 sample reservations
  - `mockExpenses.ts` - 8 sample expenses
  - `mockReviews.ts` - 4 sample reviews
  - `mockHeroImages.ts` - 3 sample hero images

### Updated Services
All services now use mock data instead of API calls:
- ✅ `carService.ts` - Returns mock car data
- ✅ `bookingService.ts` - Returns mock booking data
- ✅ `expenseService.ts` - Returns mock expense data
- ✅ `reviewService.ts` - Returns mock review data
- ✅ `statsService.ts` - Calculates stats from mock data
- ✅ `heroImageService.ts` - Returns mock hero images
- ✅ `unavailabilityService.ts` - Returns mock unavailabilities

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 📊 Features

### Public Site
- Browse available cars
- View car details with images
- Make reservations (simulated)
- Submit reviews (simulated)
- Hero image carousel

### Admin Dashboard
- View and manage bookings
- Manage car inventory
- Track expenses and revenue
- View statistics and charts
- Planning board
- Contract management
- Contact messages

---

## 💡 How It Works

All data is stored locally in TypeScript files and served directly to components without any API calls. This makes the application:

- **Fast** - No network latency
- **Simple** - No backend setup required
- **Portable** - Easy to share and demonstrate
- **Self-contained** - Everything in one place

---

## 🎯 Use Cases

Perfect for:
- Client demonstrations
- Portfolio showcase
- UI/UX testing
- Feature presentations
- Development testing

---

## ⚠️ Limitations

- Data is static (resets on restart)
- No persistent storage
- No real authentication
- No email notifications
- No database operations

---

## 🔧 Customization

To modify the mock data, edit files in `src/data/`:

```typescript
// Example: Add a new car in mockCars.ts
{
  id: "4",
  brand: "Your Brand",
  model: "Your Model",
  // ... other fields
}
```

---

**Demo Created:** April 19, 2026  
**Status:** ✅ Ready for Demonstration  
**Technology:** Next.js 14 + React 18 + TailwindCSS
