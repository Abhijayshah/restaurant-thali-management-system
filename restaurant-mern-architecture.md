# 🍽️ Restaurant Thali Management System — MERN Stack Architecture

## Project Overview
A full-featured restaurant management system for handling 100+ students/customers with monthly thali subscriptions, daily attendance tracking, role-based access, and automated billing.

---

## 1. SYSTEM ROLES & PERMISSIONS

| Role | Access Level | Key Permissions |
|------|-------------|-----------------|
| `shop-owner` | Super Admin | Full control, approve/reject customers, view all reports, change pricing |
| `staff-manager-monthly` | Manager (Monthly) | Add monthly customers, take attendance, view monthly section |
| `staff-manager-daily` | Manager (Daily) | Manage walk-in customers, take attendance, daily billing |
| `staff-worker` | Worker | View student lists, mark food taken (limited) |
| `customer-monthly` | Monthly Customer | Own profile, own attendance calendar, own extras |
| `customer-daily` | Daily/New Customer | Own profile, own food history, total spent |

---

## 2. CUSTOMER TYPES

### Type A — Monthly Thali Customer
- Registers once, gets approved after payment
- Chooses shift(s): Morning / Evening / Night
- Pricing:
  - 1 shift (any) → ₹1,750/month
  - 2 shifts → ₹3,500/month
  - 3 shifts → ₹5,250/month
- Allowed: 60 thalis/month per shift (2 per day × 30 days)
- Can order extra menu items → billed separately in "Extras" section

### Type B — Daily / Walk-in Customer
- No registration required (staff creates entry)
- Pays ₹70 per thali OR per menu item price
- Attendance tracked per visit
- Auto-summary of total amount generated for manager

---

## 3. SHIFTS

| Shift | Name | Time (Suggested) |
|-------|------|-----------------|
| Morning | Breakfast | 7:00 AM – 10:00 AM |
| Evening | Lunch/Snack | 12:00 PM – 3:00 PM |
| Night | Dinner | 7:00 PM – 10:00 PM |

---

## 4. DATABASE SCHEMA (MongoDB)

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "phone": "string",
  "email": "string",
  "password": "hashed",
  "role": "shop-owner | staff-manager-monthly | staff-manager-daily | staff-worker | customer-monthly | customer-daily",
  "customerType": "monthly | daily | null",
  "status": "pending | approved | rejected | active | inactive",
  "createdBy": "ObjectId (manager who added)",
  "approvedBy": "ObjectId (owner)",
  "createdAt": "Date"
}
```

### MonthlySubscription Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "month": "2024-01",
  "shifts": ["morning", "evening", "night"],
  "totalAmount": 5250,
  "amountPaid": 5250,
  "paymentStatus": "pending | partial | paid",
  "paymentMethod": "UPI | cash | QR",
  "paymentRef": "string",
  "approvedByOwner": "boolean",
  "thalisAllowed": { "morning": 60, "evening": 60, "night": 60 },
  "thalisUsed": { "morning": 0, "evening": 0, "night": 0 },
  "startDate": "Date",
  "endDate": "Date"
}
```

### Attendance Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "customerType": "monthly | daily",
  "date": "Date",
  "shift": "morning | evening | night",
  "foodTaken": "boolean",
  "items": [
    { "menuItemId": "ObjectId", "name": "string", "quantity": 1, "price": 70 }
  ],
  "isThali": "boolean",
  "totalCost": 70,
  "markedBy": "ObjectId (staff)",
  "note": "string"
}
```

### Menu Collection
```json
{
  "_id": "ObjectId",
  "category": "Thali | Sabji | Dal | Rice | Roti | Snacks | Beverages | Extras",
  "name": "string",
  "price": 70,
  "available": "boolean",
  "shift": ["morning", "evening", "night"],
  "image": "string (url)"
}
```

### Extras Collection (Monthly customer extra orders)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "subscriptionId": "ObjectId",
  "date": "Date",
  "shift": "string",
  "items": [{ "menuItemId": "ObjectId", "name": "string", "qty": 1, "price": 20 }],
  "totalExtra": 90,
  "paid": "boolean"
}
```

### Settings Collection
```json
{
  "_id": "ObjectId",
  "thaliPricePerShift": 1750,
  "dailyThaliPrice": 70,
  "maxThalisPerMonth": 60,
  "maxThalisPerDay": 2,
  "qrCode": "string (image url)",
  "upiId": "string",
  "restaurantName": "string",
  "updatedBy": "ObjectId",
  "updatedAt": "Date"
}
```

### Notifications Collection
```json
{
  "_id": "ObjectId",
  "to": "ObjectId (user)",
  "from": "ObjectId (user)",
  "type": "new_customer | payment_received | approval | rejection | low_thali",
  "message": "string",
  "read": "boolean",
  "createdAt": "Date"
}
```

---

## 5. API ROUTES (Express.js)

### Auth Routes
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### User/Customer Routes
```
GET    /api/users                    (owner/manager)
POST   /api/users                    (manager adds customer)
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id                (owner only)
PUT    /api/users/:id/approve        (owner only)
PUT    /api/users/:id/reject         (owner only)
GET    /api/users/:id/attendance     (own or manager/owner)
```

### Subscription Routes
```
POST   /api/subscriptions            (manager creates)
GET    /api/subscriptions            (owner/manager)
GET    /api/subscriptions/:userId
PUT    /api/subscriptions/:id/pay    (mark payment)
PUT    /api/subscriptions/:id        (update shifts/amount)
```

### Attendance Routes
```
POST   /api/attendance               (staff marks)
GET    /api/attendance?userId=&month=&shift=
GET    /api/attendance/calendar/:userId/:month
PUT    /api/attendance/:id           (edit)
DELETE /api/attendance/:id           (owner/manager)
```

### Menu Routes
```
GET    /api/menu
GET    /api/menu?category=&shift=
POST   /api/menu                     (owner/manager)
PUT    /api/menu/:id
DELETE /api/menu/:id
```

### Extras Routes
```
POST   /api/extras                   (staff/customer adds)
GET    /api/extras/:userId
GET    /api/extras/:subscriptionId
```

### Reports / Dashboard Routes
```
GET    /api/reports/daily            (owner/manager)
GET    /api/reports/monthly          (owner/manager)
GET    /api/reports/summary          (owner sees 3 totals)
GET    /api/reports/customer/:id
```

### Settings Routes
```
GET    /api/settings
PUT    /api/settings                 (owner only)
```

### Notifications Routes
```
GET    /api/notifications
PUT    /api/notifications/:id/read
```

---

## 6. REACT FRONTEND PAGES

### Public Pages
- `/` — Landing / Login page
- `/register` — Customer self-registration (choose type: monthly / daily)

### Owner Dashboard (`/owner/...`)
- `/owner/dashboard` — Overview: total income (monthly + daily + combined), pending approvals
- `/owner/customers` — All customers with filters (monthly/daily/pending/approved/shift)
- `/owner/approvals` — Pending customer approval queue
- `/owner/reports` — Financial reports, charts
- `/owner/menu` — Manage menu items
- `/owner/settings` — Change prices, QR code, shifts

### Manager Dashboard (`/manager/...`)
- `/manager/dashboard` — Section-specific overview
- `/manager/customers` — Add/view customers (manager's type)
- `/manager/attendance` — Daily attendance marking
- `/manager/billing` — Daily bill summary (daily customers)

### Staff Worker
- `/staff/attendance` — View and mark attendance (limited)
- `/staff/customers` — View customer list (limited)

### Customer Dashboard (`/customer/...`)
- `/customer/dashboard` — Profile, active subscription info
- `/customer/calendar` — Green/Red attendance calendar per shift
- `/customer/extras` — Extra items ordered this month
- `/customer/history` — Full food history (daily customers)

---

## 7. FRONTEND COMPONENT TREE

```
App
├── AuthProvider (Context)
├── Router
│   ├── PublicRoute → LoginPage / RegisterPage
│   └── ProtectedRoute
│       ├── OwnerLayout
│       │   ├── OwnerDashboard
│       │   │   ├── SummaryCards (Monthly Total | Daily Total | Combined)
│       │   │   ├── PendingApprovals widget
│       │   │   └── RecentActivity feed
│       │   ├── CustomerTable (filterable, searchable)
│       │   ├── ApprovalQueue
│       │   │   └── ApprovalCard (Approve / Reject + payment confirm)
│       │   ├── MenuManager
│       │   ├── ReportsPage (Charts via recharts)
│       │   └── SettingsPage (price config, QR upload)
│       │
│       ├── ManagerLayout
│       │   ├── ManagerDashboard
│       │   ├── AddCustomerForm
│       │   ├── AttendanceMarker
│       │   │   ├── ShiftSelector
│       │   │   └── StudentChecklist (checkbox per student)
│       │   └── BillingSummary
│       │
│       ├── StaffLayout
│       │   ├── AttendanceView (read + limited mark)
│       │   └── CustomerList (read-only)
│       │
│       └── CustomerLayout
│           ├── ProfileCard
│           ├── AttendanceCalendar
│           │   ├── ShiftTabs (Morning / Evening / Night)
│           │   └── CalendarGrid (Green=taken, Red=missed, Grey=N/A)
│           ├── ExtraOrdersTable
│           └── SubscriptionDetails
```

---

## 8. STATE MANAGEMENT

Use **Redux Toolkit** or **React Context + useReducer**:
- `authSlice` — current user, role, token
- `customersSlice` — customer list, filters
- `attendanceSlice` — calendar data
- `menuSlice` — menu items
- `settingsSlice` — pricing config
- `notificationSlice` — real-time alerts

---

## 9. KEY BUSINESS LOGIC

### Attendance Rules
```javascript
// Monthly customer
canTakeFood(userId, shift, date) {
  const sub = getActiveSubscription(userId, date)
  if (!sub.shifts.includes(shift)) return false
  const usedToday = getAttendanceCount(userId, date, shift)
  if (usedToday >= 1) return false  // 1 thali per shift per day
  if (sub.thalisUsed[shift] >= sub.thalisAllowed[shift]) return false
  return true
}

// Daily customer — always allowed, just pay per item
```

### Pricing Calculation
```javascript
const SHIFT_PRICE = settings.thaliPricePerShift // default 1750
const DAILY_THALI = settings.dailyThaliPrice    // default 70

monthlyTotal = selectedShifts.length * SHIFT_PRICE
// 1 shift = 1750, 2 shifts = 3500, 3 shifts = 5250
```

### Owner Summary (3 Totals)
```javascript
{
  monthlyCustomersTotal: sum of all approved monthly payments this month,
  dailyCustomersTotal: sum of all daily attendance costs this month,
  grandTotal: monthlyCustomersTotal + dailyCustomersTotal
}
```

---

## 10. TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| UI Library | Tailwind CSS + shadcn/ui |
| State | Redux Toolkit |
| Charts | Recharts |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io (notifications) |
| File Upload | Multer (QR code images) |
| Validation | Zod / Joi |
| Deployment | Frontend: Vercel, Backend: Railway/Render |

---

## 11. FOLDER STRUCTURE

```
restaurant-mern/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Buttons, Modal, Table, Badge
│   │   │   ├── attendance/          # Calendar, AttendanceMarker
│   │   │   ├── customer/            # CustomerCard, CustomerForm
│   │   │   ├── menu/                # MenuGrid, MenuCard
│   │   │   └── reports/             # Charts, SummaryCards
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── owner/
│   │   │   ├── manager/
│   │   │   ├── staff/
│   │   │   └── customer/
│   │   ├── store/                   # Redux slices
│   │   ├── hooks/                   # Custom hooks
│   │   ├── utils/                   # Helpers, formatters
│   │   └── api/                     # Axios API calls
│   └── package.json
│
├── server/                          # Express Backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Subscription.js
│   │   ├── Attendance.js
│   │   ├── Menu.js
│   │   ├── Extras.js
│   │   ├── Notification.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── subscriptions.js
│   │   ├── attendance.js
│   │   ├── menu.js
│   │   ├── extras.js
│   │   ├── reports.js
│   │   └── settings.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT verify
│   │   ├── roleCheck.js             # Role-based guard
│   │   └── errorHandler.js
│   ├── controllers/                 # Business logic per route
│   ├── utils/
│   │   └── notifications.js
│   ├── config/
│   │   └── db.js
│   └── index.js
│
├── .env.example
└── README.md
```

---

## 12. NOTIFICATION FLOW

```
Manager adds new customer
    → Notification sent to Owner
    → Owner reviews → Approves/Rejects
    → If Approved: Owner shares QR/UPI
    → Customer pays
    → Manager confirms payment received
    → Owner gives final approval
    → Customer status → "active"
    → Customer gets login credentials
```

---

## 13. MENU CATEGORIES (Add your items here)

```
Categories to populate in DB:
- Thali (Main)
- Sabji / Curry
- Dal / Lentils
- Rice
- Roti / Bread
- Snacks
- Beverages / Drinks
- Desserts
- Extras / Add-ons
```
*(Add specific items with prices when menu card is provided)*

---

## 14. ENVIRONMENT VARIABLES

```env
# Server
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development

# Client
VITE_API_URL=http://localhost:5000/api
```
