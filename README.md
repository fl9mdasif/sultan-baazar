# Sultan Bazar — E-Commerce Platform

Sultan Bazar is a full-stack e-commerce platform for selling natural spices, oils, and cooking essentials. It supports a complete shopping experience for customers alongside dedicated dashboards for administrators and superadmins.

**Live:** [sultanbaazar.com](https://sultanbaazar.com) · **API:** [api.sultanbaazar.com](https://api.sultanbaazar.com)

---

## Features

### Shopping

- Product catalogue with categories, tags, price variants, and stock tracking
- Real-time cart synced with the backend
- Checkout with saved addresses, district-based shipping rates, and Cash on Delivery
- Coupon/discount code support
- Product reviews — only purchasers with a delivered order can submit

### Customer Dashboard

- Order stats and status tracking (Placed → Confirmed → Processing → Shipped → Delivered)
- Full status history with timestamps per order
- Quick cancellation before an order is processed
- Saved shipping addresses with a default that pre-fills at checkout
- Profile, contact number, and profile picture management
- Secure password change with current-password verification

### Admin Dashboard

- Sales analytics: dual-axis chart (revenue + order volume), order status pie chart
- Full product CRUD with variant management (size, price, stock, SKU, images)
- Order lifecycle management with mandatory cancellation reason and automatic stock restoration
- Delivery zone configuration: per-district shipping rates and free-shipping thresholds
- User CRM: search, filter, view per-user order summaries
- Activity log
- Email notifications on new orders (admin) and status changes (customer)

### Superadmin Dashboard

- All admin privileges plus user role management and admin account oversight
- Block / unblock users
- Global configuration

### Authentication & Access Control

Role-based access control (RBAC) across three roles — Customer, Admin, Superadmin — enforced on both the Next.js route layer and the Express middleware layer.

| Action | Customer | Admin | Superadmin |
|---|---|---|---|
| Browse products | Yes | Yes | Yes |
| Place / track orders | Yes | — | — |
| Manage products & categories | — | Yes | Yes |
| Manage orders | — | Yes | Yes |
| Manage users | — | Yes | Yes |
| Manage admins & roles | — | — | Yes |

---

## Tech Stack

**Frontend**

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| State / data fetching | Redux Toolkit + RTK Query |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Icons | Lucide React |
| Language | TypeScript |

**Backend**

| Layer | Technology |
|---|---|
| Runtime | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| File uploads | Cloudinary |
| Email | Nodemailer (Plunk) |
| Language | TypeScript |

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- SMTP credentials

### Backend

```bash
cd sultan-bazar-server
npm install
cp .env.example .env   # fill in the values
npm run dev            # starts on http://localhost:5000
```

Required environment variables:

```
PORT=5000
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_EXPIRES_IN=100d
BCRYPT_SALT_ROUND=12
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
ADMIN_EMAIL=
DEFAULT_PASS=
NODE_ENV=development
```

### Frontend

```bash
cd sultan-bazar-client
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # starts on http://localhost:3000
```

Required environment variables:

```
NEXT_PUBLIC_BACKEND_API=http://localhost:5000/api/v1
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=50000
NEXT_PUBLIC_SHIPPING_CHARGE=60
```

---

## Project Structure

```
sultan-baazar/
├── sultan-bazar-client/   # Next.js 16 frontend
│   ├── app/               # App Router pages
│   ├── components/        # Shared and feature components
│   ├── redux/             # RTK store, slices, API endpoints
│   ├── hooks/             # Custom React hooks
│   ├── helpers/           # Axios instance and base query
│   └── lib/               # Utilities and constants
│
└── sultan-bazar-server/   # Express + TypeScript API
    └── src/
        ├── app/modules/   # Feature modules (auth, user, order, …)
        ├── middlewares/   # Auth, validation, error handling
        └── utils/         # Response helpers, catchAsync
```

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Hostinger (Node.js) |
| Database | MongoDB Atlas |
| Media | Cloudinary |
