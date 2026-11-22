<div align="center">

<img src="https://raw.githubusercontent.com/ABiR994/webplan-client/main/public/logo.svg" alt="WedPlan Logo" width="90" />

# WedPlan – Wedding Planning Platform

### Discover services, book trusted vendors, plan your big day.

A role-based wedding planning platform where customers discover wedding services and request bookings, vendors publish services and manage requests, and admins keep the marketplace safe. Browse by category, book with a simple form, and upgrade vendors to Premium with Stripe.

<br />

<a href="https://webplan-gilt.vercel.app/">
  <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Website-9f4f63?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
</a>
<a href="https://github.com/ABiR994/webplan-client">
  <img src="https://img.shields.io/badge/Client%20Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Client Repository" />
</a>
<a href="https://github.com/ABiR994/wedplan-server">
  <img src="https://img.shields.io/badge/Server%20Source-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="Server Repository" />
</a>

<br />
<br />

<img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/shadcn%2Fui-Components-000000?style=flat-square&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
<img src="https://img.shields.io/badge/BetterAuth-Authentication-6C47FF?style=flat-square" alt="BetterAuth" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
<img src="https://img.shields.io/badge/Express.js-Backend-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js" />
<img src="https://img.shields.io/badge/Stripe-Checkout-635BFF?style=flat-square&logo=stripe&logoColor=white" alt="Stripe" />
<img src="https://img.shields.io/badge/Motion-Animations-FF4154?style=flat-square" alt="Motion" />

</div>

---

## 📖 About the Project

**WedPlan** is a wedding planning platform built around three roles: **customers**, **vendors** and **admins**.

Customers browse approved wedding services (photography, venues, decoration, catering, makeup and fashion), compare them, and send booking requests. Vendors publish their services, manage booking requests and can upgrade to a Premium plan for unlimited services. Admins review services, manage users and monitor platform payments.

The application provides a complete role-based experience with authentication, protected dashboards, database-backed CRUD operations, a booking system and Stripe subscriptions.

WedPlan is built with Next.js and TypeScript on the frontend, Better Auth for authentication, and a separate Express.js REST API connected to MongoDB for services, bookings and transactions.

---

## 🔗 Links

- **Live Site:** [webplan-gilt.vercel.app](https://webplan-gilt.vercel.app/)
- **Client Repository:** [github.com/ABiR994/webplan-client](https://github.com/ABiR994/webplan-client)
- **Server Repository:** [github.com/ABiR994/wedplan-server](https://github.com/ABiR994/wedplan-server)

---

## ✨ Key Features

### 🏠 Home Page

- **Banner:** a clear headline, short description, an "Explore Wedding Services" button and a wedding-themed illustration.
- **Featured Wedding Services:** the latest 6 approved and active services from the database. Each card shows the image, name, category, price, location, vendor and a View Details button.
- **Wedding Service Categories:** Photography & Videography, Wedding Venues, Decoration & Florist, Catering Services, Makeup & Styling and Wedding Fashion. Each card shows how many services it has and opens Browse Services filtered to that category.
- **Why Choose WedPlan?** and **How WedPlan Works** sections.
- Smooth scroll-reveal animations using Motion. Visitors who prefer reduced motion do not see them.

### 🔍 Browse Services

A public page where anyone can explore approved and available services.

- Responsive card grid.
- Search by service name.
- Filter by category and by location (locations come from the services in the database).
- Sort by newest, price low to high, or price high to low.
- Filters are kept in the URL, so results can be shared and the Back button works.
- Loading skeletons, an empty state with a Clear Filters button, and an error state with Try Again.

### 📄 Service Details

Each service has a dedicated details page.

- Image gallery with thumbnails.
- Name, category, description, price and location.
- Vendor information with a Premium badge for Premium vendors.
- Booking option that depends on who is logged in:
  - Customers can request a booking.
  - Vendors cannot book, and see a special message for their own services.
  - Admins cannot submit customer booking requests.
  - Blocked users see a notice instead of the booking button.
- Invalid or unavailable service IDs show a clear error message.
- Logged-out visitors are redirected to Sign In and sent back to the service after logging in.

### 🔐 Authentication with Better Auth

Supported methods:

- Email and password registration.
- Email and password login.
- Google social login.

Registration collects the full name, email, password, account role (Customer or Vendor) and an optional profile image uploaded as a file through ImgBB.

Password rules, enforced in the form and again on the server:

- Minimum 6 characters.
- At least one uppercase letter.
- At least one lowercase letter.

Additional details:

- Admin accounts cannot be created through public registration. The server only accepts the Customer and Vendor roles.
- After login or registration, users are redirected to the dashboard for their role.
- Signed-in users who open the Sign In or Sign Up pages are sent to their dashboard.
- The session stays active across page reloads and the navbar updates immediately after signing in or out.
- Success and error messages appear as toasts.

### 🧭 Navbar and Footer

- Responsive navbar with the WedPlan logo, Home and Browse Services links, and a mobile menu.
- Guests see Sign In and Sign Up buttons.
- Logged-in users see a profile dropdown with their name, email and image, plus Dashboard, Profile Settings and Logout.
- Footer with the logo and a short description, navigation links, contact information, social links and copyright.

### 🛡️ Protected Dashboards

Dashboards use a separate layout with a role-based sidebar and a top bar.

- Logged-out visitors are redirected to Sign In.
- Each role can only open its own dashboard. Changing the URL to another role's dashboard redirects back to the user's own.
- Blocked users see an "Account blocked" notice instead of dashboard content.
- Role checks run on the server for every dashboard page and every protected API request, not only in the interface.

### 🏪 Vendor Dashboard

- **Overview:** total services, active services, pending booking requests, accepted bookings and the current subscription plan.
- **Add Service:** name, category, description, price, location and 1 to 4 images uploaded to ImgBB. New services start as **pending** until an admin approves them.
- **Free plan limit:** free vendors can keep up to 3 active services. Premium vendors have no limit.
- **My Services:** view details, edit, delete, see the approval status and turn availability on or off. Rejected services are hidden from customers, and editing a rejected service sends it back for review.
- **Booking Requests:** each request shows the customer, service, event date, event location, message and status. Pending requests can be accepted or rejected with a confirmation step, and a processed request cannot be changed again.
- **Subscription:** compare the Free and Premium plans, upgrade with Stripe Checkout, and manage or cancel the subscription in the Stripe billing portal.

### 🙋 Customer Dashboard

- **Overview:** total, pending, accepted and rejected booking requests.
- **My Bookings:** service name and image, vendor, event date, event location, status and request date, with status filters.
- View full booking details.
- Cancel pending requests with a confirmation step. Accepted, rejected and cancelled requests cannot be cancelled.

### 🛠️ Admin Dashboard

- **Overview:** total users, vendors, customers, services, pending services and transactions.
- **Manage Users:** search by name or email, filter by role, view user details and activity, and block or unblock accounts. Admin accounts cannot be blocked.
- **Manage Services:** search, filter by status and category, view details, approve, reject, change the status of published services and delete inappropriate ones. Only approved and available services appear on the public pages.
- **Transactions:** a read-only list of payments with vendor, plan, amount, status and date. Payment records cannot be edited from the application.

### 📅 Booking Request System

- A booking form opens from the service details page.
- Fields: event date (tomorrow or later), event location and an optional message.
- The customer and vendor are identified automatically from the logged-in session and the service.
- Duplicate active requests for the same service and event date are blocked, and customers cannot book their own services.
- Booking statuses: Pending, Accepted, Rejected and Cancelled.

### 💳 Stripe Premium Subscription

- Vendors click **Upgrade to Premium** and the server creates a Stripe Checkout session (test mode).
- Stripe redirects to the **Payment Success** or **Payment Cancel** page.
- The success page does not activate anything by itself. It waits for the server to confirm that a **verified Stripe webhook** was received, then shows the confirmation.
- Premium is activated only after the verified webhook event.
- Subscription renewals, cancellation and expiry are handled by the server.

### 👤 Profile Settings

Available for all three roles.

- Update name and profile image.
- Vendors can also set a business name, which appears on their service cards.
- Email and role are read-only. Users cannot change their own role or subscription through profile updates.

### 🔔 Toasts, Loading States and Error Pages

- Success and error toast notifications (no browser alerts).
- Loading skeletons and spinners for services, dashboard data, forms, bookings and payments.
- Custom 404 page and a custom error page.
- Confirmation dialogs for destructive actions.

### 📱 Fully Responsive

- Responsive layouts for mobile phones, tablets and desktop screens.
- Sidebar that slides in on mobile.
- Tables that scroll horizontally on smaller screens.
- Mobile-friendly forms and dialogs.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| ⬛ Next.js 16 (App Router) | Routing, layouts, server rendering and dynamic routes |
| ⚛️ React 19 | UI components and interactive interfaces |
| 🔷 TypeScript | Type-safe components, API data and application logic |
| 🎨 Tailwind CSS 4 | Utility-first styling and responsive layouts |
| 🧩 shadcn/ui (Base UI) | Dialogs, dropdown menus, avatars, inputs, labels and buttons |
| 🔐 Better Auth | Email/password and Google authentication, JWT issuing |
| 🍃 MongoDB | Users, sessions, services, bookings and transactions |
| 🚀 Express.js | Backend REST API (separate repository) |
| 💳 Stripe Checkout | Premium subscription payments (test mode) |
| 🎞️ Motion | Scroll animations |
| 🔔 Sonner | Toast notifications |
| 🖼️ ImgBB | Image hosting for service and profile images |
| ▲ Vercel | Application deployment |

---

## 🧭 Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home page: banner, featured services, categories and highlights | Public |
| `/services` | Browse all approved services (supports search, filters and sorting) | Public |
| `/services/[id]` | Service details and booking option | 🔒 Login required |
| `/sign-in` | User login | Public |
| `/sign-up` | User registration | Public |
| `/dashboard` | Redirects to the dashboard for the user's role | 🔒 Login required |
| `/dashboard/vendor` | Vendor overview | 🔒 Vendor |
| `/dashboard/vendor/services` | My Services | 🔒 Vendor |
| `/dashboard/vendor/add-service` | Add Service | 🔒 Vendor |
| `/dashboard/vendor/bookings` | Booking Requests | 🔒 Vendor |
| `/dashboard/vendor/subscription` | Subscription plans | 🔒 Vendor |
| `/dashboard/vendor/profile` | Profile Settings | 🔒 Vendor |
| `/dashboard/customer` | Customer overview | 🔒 Customer |
| `/dashboard/customer/bookings` | My Bookings | 🔒 Customer |
| `/dashboard/customer/profile` | Profile Settings | 🔒 Customer |
| `/dashboard/admin` | Admin overview | 🔒 Admin |
| `/dashboard/admin/users` | Manage Users | 🔒 Admin |
| `/dashboard/admin/services` | Manage Services | 🔒 Admin |
| `/dashboard/admin/transactions` | Transactions | 🔒 Admin |
| `/dashboard/admin/profile` | Profile Settings | 🔒 Admin |
| `/payment/success` | Payment confirmation | 🔒 Login required |
| `/payment/cancel` | Payment cancelled | 🔒 Login required |

---

## 🔌 Backend API Integration

WedPlan uses a separate Express.js REST API connected to MongoDB ([wedplan-server](https://github.com/ABiR994/wedplan-server)).

### How Authentication Works

1. Better Auth runs inside this Next.js app and issues a signed JWT for the logged-in user.
2. The client requests a fresh token before each protected API call and sends it as a bearer token:

```http
Authorization: Bearer <token>
```

3. The Express server verifies the token signature, issuer and expiry against this app's JWKS endpoint (`/api/auth/jwks`), loads the user from the database and checks the user's role and blocked status.

### API Endpoints Used

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/services` | Public | List approved services (`q`, `category`, `location`, `sort`) |
| GET | `/services/featured` | Public | Latest 6 approved services for the home page |
| GET | `/services/locations` | Public | Locations used by the Browse Services filter |
| GET | `/services/category-counts` | Public | Number of services per category |
| GET | `/services/:id` | Public | Single approved service |
| GET | `/overview` | Private | Dashboard statistics for the logged-in role |
| PATCH | `/profile` | Private | Update name, image and business name |
| GET | `/vendor/services` | Vendor | The vendor's own services |
| POST | `/services` | Vendor | Add a service |
| PATCH | `/services/:id` | Vendor | Update a service (owner only) |
| PATCH | `/services/:id/availability` | Vendor | Turn availability on or off |
| DELETE | `/services/:id` | Vendor | Delete a service (owner only) |
| GET | `/vendor/bookings` | Vendor | Booking requests for the vendor's services |
| PATCH | `/bookings/:id/status` | Vendor | Accept or reject a pending request |
| GET | `/payments/subscription` | Vendor | Current plan and expiry |
| POST | `/payments/create-checkout-session` | Vendor | Start Stripe Checkout |
| GET | `/payments/status` | Vendor | Check whether the payment was verified |
| POST | `/payments/portal-session` | Vendor | Open the Stripe billing portal |
| POST | `/bookings` | Customer | Submit a booking request |
| GET | `/customer/bookings` | Customer | The customer's own bookings |
| PATCH | `/bookings/:id/cancel` | Customer | Cancel a pending booking |
| GET | `/admin/users` | Admin | List users (`q`, `role`) |
| GET | `/admin/users/:id` | Admin | User details and activity |
| PATCH | `/admin/users/:id/block` | Admin | Block or unblock a user |
| GET | `/admin/services` | Admin | List all services (`q`, `status`, `category`) |
| PATCH | `/admin/services/:id/status` | Admin | Approve or reject a service |
| DELETE | `/admin/services/:id` | Admin | Delete a service |
| GET | `/admin/transactions` | Admin | List payment records |

### Database Collections

Better Auth stores its own collections (`user`, `session`, `account`, `verification` and `jwks`) in the same MongoDB database. The `user` collection also holds `role`, `isBlocked`, `businessName`, `subscriptionPlan` and `subscriptionExpiresAt`.

The Express server manages the business collections: **services**, **bookings** and **transactions**. See the server repository for the full structure.

---

## 📂 Project Structure

```text
webplan-client/
├── public/
│   ├── logo.svg
│   └── images/                 # hero illustration
│
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── icon.svg
│   │
│   ├── (main)/                 # pages with navbar and footer
│   │   ├── page.tsx            # home
│   │   ├── services/           # browse and [id] details
│   │   └── payment/            # success and cancel
│   │
│   ├── (auth)/                 # sign-in and sign-up
│   │
│   ├── dashboard/
│   │   ├── page.tsx            # redirects by role
│   │   ├── vendor/             # overview, services, add-service, bookings, subscription, profile
│   │   ├── customer/           # overview, bookings, profile
│   │   └── admin/              # overview, users, services, transactions, profile
│   │
│   └── api/
│       ├── auth/[...all]/      # Better Auth route handler
│       └── upload/             # ImgBB image upload
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── home/                   # banner and home sections
│   ├── services/               # browser, gallery, booking form
│   ├── dashboard/              # shell, overview, forms, tables
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── user-menu.tsx
│   ├── service-card.tsx
│   └── payment-status.tsx
│
├── lib/                        # auth, db, API client, session, types, helpers
├── proxy.ts                    # redirects logged-out visitors from private routes
│
├── .env.example
├── components.json
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- npm
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A Google OAuth application for Google sign-in
- An [ImgBB API key](https://api.imgbb.com/) for image uploads
- A running WedPlan Express API server ([wedplan-server](https://github.com/ABiR994/wedplan-server)), which also needs a Stripe test account

### Installation

Clone the client repository:

```bash
git clone https://github.com/ABiR994/webplan-client.git
cd webplan-client
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

### How to Run the Project Locally

Fill in the environment variables (see below), start the server repository first, then start the client:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Fill in the required values in `.env`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string (legacy `mongodb://` format) |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth (generate with `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Application URL (`http://localhost:3000` locally) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `IMGBB_API_KEY` | ImgBB API key (used only on the server for image uploads) |
| `NEXT_PUBLIC_API_URL` | Express backend URL (`http://localhost:5000` locally) |

> **Important:** `.env` files are never committed to GitHub. Keep all secrets in environment variables.

> **Note:** Better Auth encrypts its JWT signing keys, which are stored in the database, with `BETTER_AUTH_SECRET`. Every deployment that uses the same database must use the same secret, or sign-in will fail. The client and the server must also use the same MongoDB database.

### Required Application URLs

| Item | Local | Production |
|---|---|---|
| Client URL (`BETTER_AUTH_URL`) | `http://localhost:3000` | `https://webplan-gilt.vercel.app` |
| Server URL (`NEXT_PUBLIC_API_URL`) | `http://localhost:5000` | Your deployed server URL |
| Google redirect URI | `http://localhost:3000/api/auth/callback/google` | `https://webplan-gilt.vercel.app/api/auth/callback/google` |
| Stripe webhook (on the server) | `http://localhost:5000/payments/webhook` (via the Stripe CLI) | `<server-url>/payments/webhook` |

`BETTER_AUTH_URL` must match the server's `CLIENT_URL` exactly (with `https` and no trailing slash).

### Google OAuth Configuration

Create an OAuth client in the [Google Cloud Console](https://console.cloud.google.com/), add the authorized redirect URIs from the table above, and copy the client ID and secret into your environment variables.

### Running the Production Build

```bash
npm run build
npm start
```

Run ESLint:

```bash
npm run lint
```

---

## 🧪 Testing the Application

1. **Create accounts:** register one Customer and one Vendor from the Sign Up page.
2. **Create an admin:** admin accounts cannot be registered publicly. Register a normal account, then open MongoDB Atlas, go to the `user` collection in the `wedplandb` database and change that user's `role` to `admin`. Sign out and sign in again.
3. **Approve a service:** as the vendor, add a service. As the admin, approve it in Manage Services so it appears on the public pages.
4. **Book it:** as the customer, open the service, send a booking request, and track it in My Bookings. As the vendor, accept or reject it in Booking Requests.
5. **Test Stripe:** as the vendor, open Subscription and click Upgrade to Premium. Pay with the Stripe test card `4242 4242 4242 4242`, any future expiry date and any CVC. Premium activates after the webhook is verified, and the payment appears in the admin Transactions page.

The admin credentials for evaluation are provided with the project submission.

---

## ☁️ Deployment

The client application is deployed on **Vercel**.

When deploying your own copy:

1. Import the client repository into Vercel.
2. Add all required environment variables in the project settings.
3. Set `BETTER_AUTH_URL` to your production frontend URL (with `https` and no trailing slash).
4. Set `NEXT_PUBLIC_API_URL` to your deployed Express API URL.
5. Add the production Google OAuth redirect URI.
6. Make sure the server's `CLIENT_URL` matches your frontend URL.
7. Allow connections from Vercel in MongoDB Atlas Network Access.
8. Redeploy after changing environment variables (variables starting with `NEXT_PUBLIC_` are built into the site).

The Express backend is maintained separately in the [wedplan-server](https://github.com/ABiR994/wedplan-server) repository.

---

## 👨‍💻 Author

**Salem Nur Abir**

CSE Student | Aspiring Software Engineer

<a href="https://github.com/ABiR994">
  <img src="https://img.shields.io/badge/GitHub-ABiR994-181717?style=for-the-badge&logo=github" alt="GitHub" />
</a>
<a href="https://linkedin.com/in/salem-nur-abir/">
  <img src="https://img.shields.io/badge/LinkedIn-Salem%20Nur%20Abir-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>
<a href="https://abir994.pro.bd/">
  <img src="https://img.shields.io/badge/Portfolio-Visit%20Website-15803d?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
</a>
