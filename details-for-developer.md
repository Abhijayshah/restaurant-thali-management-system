# Project Developer Documentation
> Last Updated: 2026-02-23
> Maintained by: Trae AI — update this file whenever a developer requests it

---

## 1. PROJECT OVERVIEW
- Project Name: Restaurant Thali Management System
- Purpose / What this website does: End-to-end management of thali-based restaurant operations, including role-based dashboards for owner, managers, staff workers, and customers. Handles customer registration, subscriptions (monthly/daily), attendance/meal tracking, extras, menu management, and summary reporting.
- Current Status: In Development (local monorepo with separate client and server)
- Primary Language: TypeScript (frontend), JavaScript (Node.js backend)
- Rendering Type: CSR (Client-Side Rendering) React SPA with separate REST API backend

---

## 2. TECH STACK
- Frontend Framework: React 19 with React Router (BrowserRouter) and Redux Toolkit
- Styling Method: Tailwind CSS utility classes with a small amount of global CSS
- JavaScript Type: TypeScript on the client (TSX), ES modules on the server
- Backend: Node.js + Express 4 REST API
- Database: MongoDB via Mongoose ODM
- Authentication: JWT-based auth with role-based authorization middleware (shop-owner, staff-manager-monthly, staff-manager-daily, staff-worker, customer-monthly, customer-daily)
- Package Manager: npm (client and server each have their own package.json)
- Build Tool: Vite (React + TypeScript)
- Deployment Target: Unknown — current setup is for local development; suitable for Docker/Node hosting and any static hosting for the built client

---

## 3. PROJECT STRUCTURE

project-root/  
├── package.json                      # Root metadata, no app scripts  
├── .env.example                      # Backend env template (server)  
├── restaurant-architecture-diagram.jsx # High-level architecture sketch (for docs/diagramming)  
├── restaurant-mern-architecture.md   # Architecture notes for this system  
├── client/                           # React + Vite frontend (TypeScript)  
│   ├── index.html                    # Frontend HTML shell for SPA  
│   ├── package.json                  # Frontend dependencies and scripts (vite, tailwind, react)  
│   ├── vite.config.ts                # Vite config with React plugin  
│   ├── tailwind.config.js            # Tailwind content paths and theme config  
│   ├── postcss.config.js             # Tailwind + PostCSS setup  
│   ├── tsconfig.json                 # TS project references  
│   ├── tsconfig.app.json             # App TS compiler options  
│   ├── tsconfig.node.json            # Node-related TS config for tooling  
│   ├── .env.example                  # Frontend env template (VITE_API_URL)  
│   ├── public/                       # Static assets served as-is  
│   ├── dist/                         # Vite production build output  
│   └── src/                          # Frontend source  
│       ├── main.tsx                  # React entry; mounts App with Redux Provider  
│       ├── App.tsx                   # Root component; React Router routes + notifications  
│       ├── index.css                 # Tailwind base imports and global styles  
│       ├── App.css                   # Global app-specific styles (if any)  
│       ├── api/                      # Typed API clients for backend endpoints  
│       │   ├── axiosClient.ts        # Axios instance with base URL and auth header handling  
│       │   ├── authApi.ts            # Login, register, current user APIs  
│       │   ├── usersApi.ts           # User listing, approval, and status APIs  
│       │   ├── settingsApi.ts        # Restaurant settings (prices, limits, metadata)  
│       │   ├── subscriptionsApi.ts   # Monthly/daily subscriptions API  
│       │   ├── attendanceApi.ts      # Attendance/meal tracking API  
│       │   ├── extrasApi.ts          # Extras (add-on items) API  
│       │   ├── menuApi.ts            # Menu management and listing API  
│       │   └── reportsApi.ts         # Summary reports API  
│       ├── store/                    # Redux Toolkit slices and store config  
│       │   ├── store.ts              # configureStore, root reducer, types  
│       │   ├── authSlice.ts          # Auth token, current user, login/logout actions  
│       │   ├── customersSlice.ts     # Customers state for manager views  
│       │   ├── attendanceSlice.ts    # Attendance data and updates  
│       │   ├── menuSlice.ts          # Menu state cache  
│       │   ├── settingsSlice.ts      # Settings state and update feedback  
│       │   └── notificationsSlice.ts # Global toast-style notifications  
│       ├── hooks/                    # Typed Redux hooks  
│       │   ├── useAppDispatch.ts     # Typed dispatch hook  
│       │   └── useAppSelector.ts     # Typed selector hook  
│       ├── types/                    # Shared TypeScript types  
│       │   └── auth.ts               # UserRole, AuthState, and auth-related types  
│       ├── routes/                   # Route utilities  
│       │   └── ProtectedRoute.tsx    # Role-aware protected route gate using Outlet  
│       ├── layouts/                  # Role-based layout shells  
│       │   ├── OwnerLayout.tsx       # Side navigation + header for owner dashboard  
│       │   ├── ManagerLayout.tsx     # Manager shell; monthly vs daily manager view  
│       │   ├── StaffLayout.tsx       # Staff worker shell for attendance workflow  
│       │   └── CustomerLayout.tsx    # Customer portal shell (sidebar/header)  
│       ├── pages/                    # Route-level views per role  
│       │   ├── auth/  
│       │   │   ├── LoginPage.tsx     # Login form and auth flow  
│       │   │   └── RegisterPage.tsx  # Customer registration (monthly/daily)  
│       │   ├── owner/  
│       │   │   ├── OwnerDashboardPage.tsx  # Overview metrics + summaries for owner  
│       │   │   ├── OwnerSettingsPage.tsx   # Settings form (prices, limits, QR, UPI, name)  
│       │   │   └── OwnerUsersPage.tsx      # Approve/reject user registrations  
│       │   ├── manager/  
│       │   │   ├── ManagerDashboardPage.tsx     # Manager overview and quick stats  
│       │   │   ├── ManagerCustomersPage.tsx     # Customer list and creation for managers  
│       │   │   └── ManagerSubscriptionsPage.tsx # Subscription creation and management  
│       │   ├── staff/  
│       │   │   └── StaffDashboardPage.tsx  # Attendance, extras, and meal tracking  
│       │   └── customer/  
│       │       └── CustomerDashboardPage.tsx # Subscription calendar and daily details  
│       └── assets/  
│           └── react.svg              # Example asset (not used in core flows)  
│
├── server/                           # Express + MongoDB backend  
│   ├── package.json                  # Backend dependencies and scripts (nodemon, express, mongoose)  
│   ├── index.js                      # Express app entry; middleware, routes, and startup  
│   ├── .env                          # Local backend env (real values, not checked in)  
│   ├── config/                       # Configuration and seeding helpers  
│   │   ├── db.js                     # MongoDB connection via mongoose  
│   │   ├── seedSettings.js           # Default settings seeding on startup  
│   │   ├── seedOwner.js              # Default shop-owner user (role: shop-owner)  
│   │   └── seedStaff.js              # Default managers and staff-worker users  
│   ├── models/                       # Mongoose models  
│   │   ├── User.js                   # Users with roles, status, phone-based login  
│   │   ├── Settings.js               # Settings (prices, thali limits, restaurant info)  
│   │   ├── Subscription.js           # Subscriptions (monthly/daily, shifts, payment)  
│   │   ├── Attendance.js             # Attendance and thali tracking per day/shift  
│   │   ├── Extras.js                 # Additional items linked to subscriptions  
│   │   └── Menu.js                   # Menu items with category, shift, availability  
│   ├── controllers/                  # Route handlers with business logic  
│   │   ├── authController.js         # Login, register, current user, token issuing  
│   │   ├── userController.js         # User approval, listing, and role-specific ops  
│   │   ├── settingsController.js     # Get/update settings with owner permissions  
│   │   ├── subscriptionController.js # Create/manage subscriptions and billing fields  
│   │   ├── attendanceController.js   # Create/list attendance per user/day/shift  
│   │   ├── extrasController.js       # Create/list extras for subscriptions  
│   │   └── reportsController.js      # Summaries for owner dashboard  
│   ├── routes/                       # Express routers  
│   │   ├── auth.js                   # /auth login/register routes  
│   │   ├── users.js                  # /users user management routes  
│   │   ├── settings.js               # /settings settings routes  
│   │   ├── subscriptions.js          # /subscriptions routes  
│   │   ├── attendance.js             # /attendance routes  
│   │   ├── extras.js                 # /extras routes  
│   │   ├── menu.js                   # /menu routes  
│   │   └── reports.js                # /reports routes  
│   ├── middleware/                   # Express middleware  
│   │   ├── auth.js                   # JWT auth; attaches user to request  
│   │   ├── roleCheck.js              # Role-based access control (requireRoles)  
│   │   └── errorHandler.js           # Error and 404 handling  
│   └── config/seed*.js               # Seeding utilities invoked on startup  
└── client/README.md                  # Frontend-specific README (quick start, if present)

---

## 4. NAMING CONVENTIONS
- Components: PascalCase → e.g., `OwnerLayout.tsx`, `LoginPage.tsx`, `ProtectedRoute.tsx`
- CSS Classes: Tailwind utility classes (e.g., `bg-slate-950`, `flex`, `rounded-md`); no BEM or CSS Modules
- Functions: camelCase → e.g., `handleSubmit`, `fetchSettings`, `ensureDefaultOwner`, `listMenu`
- Files:
  - React components and layouts: PascalCase with `.tsx` extension (e.g., `OwnerDashboardPage.tsx`)
  - Redux slices: camelCase ending with `Slice.ts` (e.g., `authSlice.ts`)
  - API clients: camelCase ending with `Api.ts` (e.g., `settingsApi.ts`)
  - Backend models/controllers/routes/middleware: PascalCase for models (`User.js`), camelCase for controllers and middleware (`authController.js`, `errorHandler.js`), kebab-case not used
- Variables: camelCase for regular variables and function names; UPPER_SNAKE_CASE for constants in environment variables (e.g., `JWT_SECRET`, `CLIENT_ORIGIN`)
- API Routes:
  - Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/me` (exact endpoints to be confirmed by checking routes/auth.js)
  - Users: `/api/users` (listing, approval), `/api/users/:id` (details/actions)
  - Settings: `/api/settings`
  - Subscriptions: `/api/subscriptions`
  - Attendance: `/api/attendance`
  - Extras: `/api/extras`
  - Menu: `/api/menu`
  - Reports: `/api/reports/summary`

Where there is any ambiguity, prefer following the patterns used in the existing routes under `server/routes`.

---

## 5. PAGES & ROUTES

### Frontend SPA Routes (React Router)

| Page Name              | Route            | File Path                                                                 | Notes                                                  |
|------------------------|------------------|---------------------------------------------------------------------------|--------------------------------------------------------|
| Login                  | `/`              | client/src/pages/auth/LoginPage.tsx                                      | Default landing page; phone + password login          |
| Register               | `/register`      | client/src/pages/auth/RegisterPage.tsx                                   | Customer registration form (monthly/daily)            |
| Owner Dashboard        | `/owner`         | client/src/pages/owner/OwnerDashboardPage.tsx                            | Owner overview; wrapped by OwnerLayout                |
| Owner Settings         | `/owner/settings`| client/src/pages/owner/OwnerSettingsPage.tsx                             | Manage prices, limits, QR, UPI, restaurant name       |
| Owner Users            | `/owner/users`   | client/src/pages/owner/OwnerUsersPage.tsx                                | Approve/reject users, view user list                  |
| Manager Dashboard      | `/manager`       | client/src/pages/manager/ManagerDashboardPage.tsx                        | Manager overview for monthly/daily managers           |
| Manager Customers      | `/manager/customers` | client/src/pages/manager/ManagerCustomersPage.tsx                    | Manage customers and their basic details              |
| Manager Subscriptions  | `/manager/subscriptions` | client/src/pages/manager/ManagerSubscriptionsPage.tsx             | Create/manage monthly subscriptions (monthly manager)  |
| Staff Dashboard        | `/staff`         | client/src/pages/staff/StaffDashboardPage.tsx                            | Mark attendance, extras, and meals                    |
| Customer Dashboard     | `/customer`      | client/src/pages/customer/CustomerDashboardPage.tsx                      | Customer calendar, subscription, daily details        |

All protected routes are wrapped with `ProtectedRoute` and use `allowedRoles` based on `UserRole` from `client/src/types/auth.ts`. Layout components (`OwnerLayout`, `ManagerLayout`, `StaffLayout`, `CustomerLayout`) are used as nested route shells via `Outlet`.

---

## 6. COMPONENTS LIBRARY

This project is page/layout-driven; there is no separate large “components” directory. The primary reusable building blocks are layouts, route guards, and Redux-powered pages.

### App
- **File:** client/src/App.tsx
- **Purpose:** Root React component wiring up React Router, top-level `Notifications` overlay, and all route definitions.
- **Props:** None (reads from Redux via hooks).
- **Used On:** Mounted by `main.tsx` at the root; wraps the entire SPA.

### ProtectedRoute
- **File:** client/src/routes/ProtectedRoute.tsx
- **Purpose:** Guard routes based on authentication and allowed roles. Redirects to `/` (Login) if the user is not logged in or not allowed.
- **Props:**
  - `allowedRoles?: UserRole[]` — optional list of roles allowed to access child routes.
- **Used On:** All protected route groups in `App.tsx` (owner, manager, staff, customer).

### OwnerLayout
- **File:** client/src/layouts/OwnerLayout.tsx
- **Purpose:** Provide owner-specific sidebar navigation (Dashboard, Settings, Users) and a responsive two-column layout.
- **Props:** None (consumes auth state from Redux).
- **Used On:** Wrapping `/owner` route branch with nested dashboard, settings, and users pages.

### ManagerLayout
- **File:** client/src/layouts/ManagerLayout.tsx
- **Purpose:** Manager shell that shows navigation for Dashboard, Customers, and (for monthly managers) Subscriptions.
- **Props:** None (derives manager type from `authState.user.role`).
- **Used On:** Wrapping `/manager` route branch.

### StaffLayout
- **File:** client/src/layouts/StaffLayout.tsx
- **Purpose:** Layout for staff workers marking attendance and extras; includes navigation and logout.
- **Props:** None.
- **Used On:** Wrapping `/staff` route branch.

### CustomerLayout
- **File:** client/src/layouts/CustomerLayout.tsx
- **Purpose:** Layout shell for customer portal with navigation and logout.
- **Props:** None.
- **Used On:** Wrapping `/customer` route branch.

### LoginPage
- **File:** client/src/pages/auth/LoginPage.tsx
- **Purpose:** Phone + password login form; dispatches login via `authApi` and updates `authSlice`.
- **Props:** None.
- **Used On:** `/` route.

### RegisterPage
- **File:** client/src/pages/auth/RegisterPage.tsx
- **Purpose:** Customer registration form that supports monthly and daily customers and posts to backend auth/user endpoints.
- **Props:** None.
- **Used On:** `/register` route.

### OwnerDashboardPage
- **File:** client/src/pages/owner/OwnerDashboardPage.tsx
- **Purpose:** Display owner-level summary metrics using `reportsApi` (e.g., monthly/daily totals, grand total).
- **Props:** None.
- **Used On:** `/owner` (index) route.

### OwnerSettingsPage
- **File:** client/src/pages/owner/OwnerSettingsPage.tsx
- **Purpose:** Editable settings form bound to `settingsSlice` and `settingsApi`. Allows updating thali prices, limits, QR code link/string, UPI ID, and restaurant name.
- **Props:** None.
- **Used On:** `/owner/settings` route.

### OwnerUsersPage
- **File:** client/src/pages/owner/OwnerUsersPage.tsx
- **Purpose:** Owner UI to view pending/active users, approve/reject registrations, and manage statuses (using `usersApi`).
- **Props:** None.
- **Used On:** `/owner/users` route.

### ManagerDashboardPage
- **File:** client/src/pages/manager/ManagerDashboardPage.tsx
- **Purpose:** High-level view for managers, including counts/quick stats for their responsibilities.
- **Props:** None.
- **Used On:** `/manager` route.

### ManagerCustomersPage
- **File:** client/src/pages/manager/ManagerCustomersPage.tsx
- **Purpose:** List, filter, and create customers from manager side. Integrates with `customersSlice` and related APIs.
- **Props:** None.
- **Used On:** `/manager/customers` route.

### ManagerSubscriptionsPage
- **File:** client/src/pages/manager/ManagerSubscriptionsPage.tsx
- **Purpose:** Create and manage monthly subscriptions; show subscription list with payment statuses and actions.
- **Props:** None.
- **Used On:** `/manager/subscriptions` route (visible for monthly managers).

### StaffDashboardPage
- **File:** client/src/pages/staff/StaffDashboardPage.tsx
- **Purpose:** Core staff worker UI to mark attendance per customer/day/shift, track thali vs non-thali items, and record extras.
- **Props:** None.
- **Used On:** `/staff` route.

### CustomerDashboardPage
- **File:** client/src/pages/customer/CustomerDashboardPage.tsx
- **Purpose:** Customer-facing view for subscription calendar, daily attendance details, extras, and monthly subscription summary.
- **Props:** None.
- **Used On:** `/customer` route.

### Notifications (inline component in App)
- **File:** client/src/App.tsx (internal component)
- **Purpose:** Render global toast-like notifications stacked at the top of the screen using `notificationsSlice`.
- **Props:** None (reads from Redux).
- **Used On:** Included at the top of App; visible across all routes.

Backend uses controller functions rather than React-style components. Each controller (e.g., `menuController.js`, `settingsController.js`, `authController.js`) serves as a cohesive unit encapsulating a set of Express route handlers.

---

## 7. STYLING SYSTEM
- CSS Framework or Method used: Tailwind CSS (via `tailwindcss` and `postcss`) with a small amount of vanilla CSS in `index.css` and `App.css`.
- Color Variables: Uses Tailwind’s default palette with emphasis on the `slate` scale (e.g., `bg-slate-950`, `text-slate-100`, `border-slate-800`) and `sky`/`emerald` for accents and success states.
- Font Family: Uses the default sans-serif font set by Tailwind’s base styles (no custom font family declaration detected in `index.css` or Tailwind config).
- Breakpoints: Tailwind default breakpoints are assumed. The UI explicitly references:
  - `md:` (medium breakpoint) for layout changes such as showing sidebars (`hidden md:flex`).
  Other breakpoints (`sm`, `lg`, `xl`, `2xl`) are available via Tailwind defaults though not heavily used.
- Animation: No external animation libraries (e.g., GSAP, Framer Motion) detected. Tailwind classes provide subtle transitions where used (e.g., hover states on buttons and navigation links).

The layouts are built mobile-first: sidebars are hidden on small screens and shown on `md` and above, ensuring mobile responsiveness across role dashboards.

---

## 8. ENVIRONMENT VARIABLES

### Root / Server `.env.example`

| Variable       | Purpose                                   | Example Value                                      |
|----------------|-------------------------------------------|----------------------------------------------------|
| `PORT`         | Backend server port                       | `5000`                                             |
| `MONGODB_URI`  | Connection URI for MongoDB database       | `mongodb+srv://username:password@cluster-url/db-name` |
| `JWT_SECRET`   | Secret key for signing JWT tokens         | `replace_with_secure_secret`                       |
| `JWT_EXPIRE`   | JWT token lifetime                        | `7d`                                               |
| `NODE_ENV`     | Node environment mode                     | `development`                                      |
| `CLIENT_ORIGIN`| Allowed frontend origin for CORS          | `http://localhost:5173`                            |

### Client `.env.example`

| Variable       | Purpose                                   | Example Value                      |
|----------------|-------------------------------------------|------------------------------------|
| `VITE_API_URL` | Backend API base URL used by Axios client | `http://localhost:5000/api`        |

All environment variables should be defined in local `.env` files (not committed) using these templates. Never commit real secrets or production connection strings.

---

## 9. SCRIPTS & COMMANDS

### Root `package.json`

| Command        | What It Does                                          |
|----------------|-------------------------------------------------------|
| `npm test`     | Placeholder script; exits with an error (no tests).  |

### Frontend (`client/package.json`)

| Command           | What It Does                                                        |
|-------------------|---------------------------------------------------------------------|
| `npm run dev`     | Starts Vite dev server for the React app (default: `http://localhost:5173`). |
| `npm run build`   | Type-checks (`tsc -b`) and builds the production bundle with Vite.  |
| `npm run lint`    | Runs ESLint on the entire client codebase.                         |
| `npm run preview` | Serves a locally built production bundle using Vite preview.        |

### Backend (`server/package.json`)

| Command           | What It Does                                                        |
|-------------------|---------------------------------------------------------------------|
| `npm run dev`     | Starts the Express API server with `nodemon` in development mode.   |
| `npm start`       | Starts the Express API server with Node in production mode.         |

To work on this project locally:
- From `server/`: run `npm install` once, then `npm run dev`.
- From `client/`: run `npm install` once, then `npm run dev`.
- Ensure `MONGODB_URI` and `CLIENT_ORIGIN` are correctly set in `server/.env` if not using the `.env.example` defaults.

---

## 10. KNOWN ISSUES / TODO
- [ ] Issue 1
- [ ] Issue 2

Developers should add concrete issues here as they are discovered (e.g., edge cases in attendance calculation, performance bottlenecks on customer dashboard, or any mismatch between frontend and backend validation).

---

## 11. HOW TO ADD NEW SECTIONS (Developer Guide)

When a developer asks to add a new section or page:
1. Create the component in `client/src/pages/` or `client/src/components/` using PascalCase.
2. Follow the existing naming convention documented in Section 4.
3. Import and place it in the correct route tree in `client/src/App.tsx` or in the appropriate layout component.
4. Add styles using Tailwind utility classes; if you need custom global styles, extend `index.css` or `App.css` conservatively.
5. Update this file by asking Trae AI: `Update details-for-developer.md with the new [SectionName] section details`.

---

## 12. BACKEND BUSINESS LOGIC OVERVIEW

- Authentication:
  - Implemented via JWT tokens in `server/controllers/authController.js` and verified by `server/middleware/auth.js`.
  - Requests to protected routes must include an `Authorization: Bearer <token>` header.
  - Roles are attached to the user entity and enforced with `requireRoles` middleware from `server/middleware/roleCheck.js`.

- Users:
  - Defined in `server/models/User.js` with fields for `name`, `phone`, hashed `password`, `role`, `status` (e.g., pending, active), and metadata.
  - `seedOwner.js` and `seedStaff.js` ensure default `shop-owner`, `staff-manager-monthly`, `staff-manager-daily`, and `staff-worker` users exist.
  - `userController.js` manages listing and status transitions (e.g., approving customers).

- Settings:
  - `Settings.js` defines pricing, limits, UPI/QR metadata, and restaurant name.
  - Settings are global and updated only by `shop-owner` via `settingsController.js` and `/settings` routes.

- Subscriptions:
  - `Subscription.js` tracks monthly/daily subscriptions, including month, shifts, total amount, and payment status.
  - Manager pages use `subscriptionsApi.ts` to create and manage subscriptions.

- Attendance:
  - `Attendance.js` records per-user attendance per date and shift, including whether a thali was taken and associated items; enforces a unique index on `(userId, date, shift)`.
  - `attendanceController.js` exposes endpoints for staff workers to mark attendance and for customers to view their history.

- Extras:
  - `Extras.js` records extra items purchased beyond standard thali, linked to `Subscription` and `User`.
  - Controlled through `extrasController.js` and exposed to staff and customer views.

- Menu:
  - `Menu.js` stores menu items categorized by type and shift; routes in `menu.js` allow owners/managers to create/update/delete items, with read-only access for others.

- Reports:
  - `reportsController.js` computes monthly summaries for the Owner dashboard, aggregating customer types and revenue-like metrics.

---

## 13. SECURITY & PERFORMANCE NOTES

- Security:
  - All sensitive backend routes require JWT authentication (`auth` middleware) and appropriate roles (`requireRoles`).
  - Passwords are hashed using `bcryptjs` before storage; raw passwords are never persisted.
  - `helmet` is used to set secure HTTP headers, and `cors` is configured with `CLIENT_ORIGIN` to restrict allowed origins.
  - Environment secrets (JWT_SECRET, MONGODB_URI) must never be committed; use `.env` files based on `.env.example`.

- Performance:
  - MongoDB indexes (e.g., on `Attendance` for `(userId, date, shift)`) reduce duplicate records and speed up queries.
  - Redux Toolkit slices structure state for efficient access; components generally select only relevant slices.
  - Client-side API modules centralize HTTP calls for easier caching or optimization (e.g., memoization, batching) in the future.

Developers extending this project should:
- Reuse existing patterns for new routes and roles.
- Keep business logic inside controllers on the backend and slices/hooks on the frontend.
- Update this documentation whenever new routes, components, or env vars are added.



