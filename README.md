# Medistore Server

Backend API for the Medistore application. This service is built with Express, TypeScript, Prisma, PostgreSQL, and Better Auth. It handles authentication, category management, medicine management, orders, and reviews.

## Overview

The backend currently provides:

- Health and root status endpoints
- Better Auth based authentication under `/api/auth/*`
- Role-protected category management for admins
- Role-protected medicine management for sellers and admins
- Authenticated medicine browsing for customers, sellers, and admins
- Order creation and order management
- Review creation and medicine review lookup

The API is mounted mainly under `/api/v1`, while authentication is mounted separately under `/api/auth`.

## Tech Stack

- Runtime: Node.js
- Language: TypeScript with ESM modules
- Framework: Express 5
- ORM: Prisma
- Database: PostgreSQL
- Auth: Better Auth
- Email: Nodemailer with Gmail SMTP

## Project Structure

```text
medistore_server/
|-- prisma/
|   |-- migrations/
|   `-- schema.prisma
|-- src/
|   |-- config/
|   |   `-- env.ts
|   |-- helpers/
|   |   `-- paginationSortingHelper.ts
|   |-- lib/
|   |   |-- auth.ts
|   |   |-- emailVerificationTemplate.ts
|   |   `-- prisma.ts
|   |-- middlewares/
|   |   `-- authMiddleware.ts
|   |-- modules/
|   |   |-- category/
|   |   |-- medicine/
|   |   |-- order/
|   |   `-- review/
|   |-- app.ts
|   `-- server.ts
|-- package.json
|-- prisma.config.ts
`-- tsconfig.json
```

## How The Server Starts

1. `src/config/env.ts` loads variables from `.env`.
2. `src/lib/prisma.ts` builds a Prisma client using `@prisma/adapter-pg`.
3. `src/server.ts` connects Prisma to the database.
4. Express starts listening on `PORT`.
5. `src/app.ts` configures CORS, JSON parsing, Better Auth routes, health routes, and module routes.

## Environment Variables

Create a `.env` file in `medistore_server/`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Server port. Defaults to `4000`. |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `APP_URL` | Yes | Frontend/client URL used for CORS, Better Auth trusted origins, and email verification links. |
| `APP_USER` | Yes | Gmail or SMTP username used by Nodemailer for verification emails. |
| `APP_PASS` | Yes | Gmail app password or SMTP password used by Nodemailer. |
| `GOOGLE_CLIENT_ID` | Optional unless Google login is used | OAuth client ID for Google authentication. |
| `GOOGLE_CLIENT_SECRET` | Optional unless Google login is used | OAuth client secret for Google authentication. |

Example:

```env
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/medistore
APP_URL=http://localhost:3000
APP_USER=your-email@gmail.com
APP_PASS=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Installation

```bash
npm install
```

## Database Setup

Prisma uses the schema at `prisma/schema.prisma` and migration files in `prisma/migrations`.

Typical local setup:

```bash
npx prisma generate
npx prisma migrate dev
```

Production-style migration:

```bash
npx prisma migrate deploy
```

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `npx tsx watch src/server.ts` | Starts the server in watch mode for development. |
| `npm run build` | `prisma generate && tsc` | Generates the Prisma client and compiles TypeScript into `dist/`. |
| `npm run start` | `node dist/src/server.js` | Runs the compiled server. |
| `npm run start:prod` | `prisma migrate deploy && node dist/src/server.js` | Applies production migrations and starts the compiled server. |
| `npm test` | placeholder | No automated test suite is configured yet. |

## Authentication

Authentication is handled by Better Auth and mounted at:

```text
/api/auth/*
```

### Current auth configuration

- Email and password login is enabled
- Automatic sign-in after sign-up is disabled
- Email verification is required before protected routes can be used
- Verification email sending is enabled on sign-up
- Google social login is configured
- Trusted origins are taken from `APP_URL`

### Email verification flow

When a user signs up, the backend sends a verification email using Nodemailer. The email contains a link shaped like:

```text
${APP_URL}/api/auth/verify-email?token=...
```

The email uses a custom HTML template from `src/lib/emailVerificationTemplate.ts`.

### Session and authorization flow

Protected routes use `authMiddleware(...)`.

The middleware:

1. Reads the current session through Better Auth.
2. Rejects unauthenticated requests with `401`.
3. Rejects users whose email is not verified with `403`.
4. Attaches the authenticated user to `req.user`.
5. Rejects users whose role is not allowed for the route with `403`.

### Supported roles

- `CUSTOMER`
- `SELLER`
- `ADMIN`

## CORS

CORS is enabled with:

- `credentials: true`
- `origin: APP_URL || "http://localhost:4000"`

If `APP_URL` is missing, the fallback origin is `http://localhost:4000`.

## API Conventions

### Base path

Most application routes are mounted under:

```text
/api/v1
```

### Content type

The server expects JSON bodies for non-auth endpoints.

### Common success shape

Most controllers return a response similar to:

```json
{
  "success": true,
  "message": "Some message",
  "data": {}
}
```

### Common error shape

Most controllers catch thrown errors and return:

```json
{
  "success": false,
  "message": "Error message",
  "details": {}
}
```

There is no central error-handling layer yet; each controller handles errors locally.

## Health Endpoints

### `GET /`

Public route.

Response:

```json
{
  "ok": true,
  "message": "Welcome to medistore_server"
}
```

### `GET /health`

Public route.

Response:

```json
{
  "ok": true,
  "message": "Server is healthy"
}
```

## Modules And Endpoints

### Category Module

Route prefix:

```text
/api/v1/categories
```

#### `POST /api/v1/categories`

Access: `ADMIN`

Creates a category.

Request body:

```json
{
  "key": "pain-relief-fever",
  "name": "Pain Relief & Fever",
  "nameBn": "Pain Relief Bangla Name",
  "sortOrder": 1,
  "isActive": true
}
```

Field notes:

- `key` must be unique
- `sortOrder` is required by the TypeScript type, but the service falls back to `0` if it is missing
- `nameBn` is optional
- `isActive` defaults to `true`

#### `GET /api/v1/categories`

Access: `ADMIN`

Returns all categories.

Current implementation does not apply sorting or filtering in the query.

### Medicine Module

Seller/admin routes:

```text
/api/v1/seller/medicines
```

General medicine routes:

```text
/api/v1/medicines
```

#### `POST /api/v1/seller/medicines`

Access: `ADMIN`, `SELLER`

Creates a medicine entry. The seller is taken from the authenticated user, not from the request body.

Request body:

```json
{
  "name": "Napa Extra",
  "description": "Pain relief medicine",
  "sku": "NAPA-EXT-001",
  "categoryId": "category_cuid",
  "price": 25,
  "stock": 100,
  "isActive": true,
  "brand": "Beximco",
  "dosageForm": "Tablet",
  "strength": "500mg",
  "imageUrl": "https://example.com/image.png"
}
```

Behavior:

- `sellerId` comes from `req.user.id`
- `stock` defaults to `0`
- `isActive` defaults to `true`

#### `GET /api/v1/seller/medicines/:sellerId`

Access: `ADMIN`, `SELLER`

Returns all medicines for the provided seller ID.

Behavior note:

- Access is role-based
- The current code does not additionally verify that a seller can only read their own seller ID

#### `PUT /api/v1/seller/medicines/:medicineId`

Access: `ADMIN`, `SELLER`

Updates a medicine by ID.

The service passes the request body directly into Prisma `update`, so partial payloads are accepted.

#### `DELETE /api/v1/seller/medicines/:medicineId`

Access: `ADMIN`, `SELLER`

Deletes a medicine by ID.

Behavior note:

- The current code does not check ownership before deleting

#### `GET /api/v1/medicines`

Access: `CUSTOMER`, `ADMIN`, `SELLER`

Returns a paginated medicine list with search, filtering, and sorting.

Supported query parameters:

| Query param | Type | Notes |
| --- | --- | --- |
| `search` | string | Searches `name`, `brand`, and `description` with case-insensitive partial matching. |
| `dosageForm` | string | Case-insensitive partial match. |
| `brand` | string | Case-insensitive partial match. |
| `isActive` | boolean-like string | Only `"true"` or `"false"` has effect. |
| `minPrice` | number | Lower price bound. |
| `maxPrice` | number | Upper price bound. |
| `page` | number | Defaults to `1`. |
| `limit` | number | Defaults to `10`. |
| `sortBy` | string | Defaults to `brand`. |
| `sortOrder` | string | Defaults to `desc`. |

Current pagination helper defaults:

```text
page = 1
limit = 10
sortBy = brand
sortOrder = desc
```

Example:

```text
GET /api/v1/medicines?search=napa&brand=beximco&minPrice=10&maxPrice=100&page=1&limit=12&sortBy=price&sortOrder=asc
```

#### `GET /api/v1/medicines/:medicineId`

Access: `CUSTOMER`, `ADMIN`, `SELLER`

Returns medicine data for one medicine ID.

Implementation note:

- The service uses `findMany`, so the response `data` is an array, even though the route is for a single ID

### Order Module

Route prefix:

```text
/api/v1/orders
```

#### `POST /api/v1/orders`

Access: `CUSTOMER`

Creates an order for the authenticated customer.

Request body:

```json
{
  "phone": "01700000000",
  "address": "Dhaka, Bangladesh",
  "shippingFee": 60,
  "items": [
    {
      "medicineId": "medicine_cuid_1",
      "quantity": 2
    },
    {
      "medicineId": "medicine_cuid_2",
      "quantity": 1
    }
  ]
}
```

Important behavior:

- The authenticated user becomes the order customer
- Any `customerId` in the payload is not used by the service
- `shippingFee` defaults to `0`
- Only active medicines are allowed
- The backend recalculates order totals from database prices instead of trusting the client
- If any medicine is missing, inactive, or short on stock, the request fails
- Stock is decremented inside the same Prisma transaction used to create the order

Order creation steps:

1. Collect unique medicine IDs from the payload
2. Load active medicines from the database
3. Validate quantity and stock
4. Compute `subtotal`, `shippingFee`, and `total`
5. Create the order and order items in a Prisma transaction
6. Decrement stock for each ordered medicine

#### `GET /api/v1/orders`

Access: `CUSTOMER`, `ADMIN`

Returns all orders sorted by newest first, including `orderItems`.

Behavior note:

- The current implementation does not scope customer requests to their own orders

#### `GET /api/v1/orders/:customerId`

Access: `CUSTOMER`, `ADMIN`

Returns all orders for a specific customer ID, including `orderItems`.

Behavior note:

- The current implementation is parameter-based and does not enforce that a customer can only request their own ID

#### `GET /api/v1/orders/:orderId/details`

Access: `CUSTOMER`, `ADMIN`

Returns order details including `orderItems`.

Implementation note:

- The service uses `findMany`, so the response `data` is an array

#### `PATCH /api/v1/orders/:orderId/status`

Access: `ADMIN`

Updates an order status.

Request body:

```json
{
  "status": "SHIPPED"
}
```

Allowed values:

- `PLACED`
- `PROCESSING`
- `CANCELLED`
- `SHIPPED`
- `DELIVERED`

Implementation note:

- The update service performs the Prisma update, but it does not currently return the updated order, so the controller response `data` will be `undefined`

### Review Module

Route prefix:

```text
/api/v1/reviews
```

#### `POST /api/v1/reviews`

Access: `CUSTOMER`, `ADMIN`

Creates a review for a medicine.

Request body:

```json
{
  "medicineId": "medicine_cuid",
  "rating": 5,
  "comment": "Very effective"
}
```

Behavior:

- `userId` is injected from the authenticated session in the controller
- The service writes the payload directly to Prisma

#### `GET /api/v1/reviews/:medicineId`

Access: `CUSTOMER`, `ADMIN`

Returns all reviews for the given medicine ID.

## Database Model Summary

### Enums

#### `UserRole`

- `CUSTOMER`
- `SELLER`
- `ADMIN`

#### `OrderStatus`

- `PLACED`
- `PROCESSING`
- `CANCELLED`
- `SHIPPED`
- `DELIVERED`

### Models

#### `User`

Stores account identity and role information.

Important fields:

- `id`
- `email`
- `phone`
- `name`
- `avatarUrl`
- `role`
- `isBanned`
- `emailVerified`
- auth relations: `sessions`, `accounts`
- business relations: `medicines`, `orders`, `reviews`

#### `Category`

Groups medicines into a named, sortable category.

Important fields:

- `id`
- `key`
- `name`
- `nameBn`
- `isActive`
- `sortOrder`

#### `Medicine`

Represents a medicine/product listed by a seller.

Important fields:

- `id`
- `name`
- `description`
- `sku`
- `categoryId`
- `sellerId`
- `price`
- `stock`
- `isActive`
- `brand`
- `dosageForm`
- `strength`
- `imageUrl`

Relations:

- belongs to one `Category`
- belongs to one seller `User`
- referenced by `OrderItem`
- referenced by `Review`

#### `Order`

Stores a customer purchase and order-level totals.

Important fields:

- `id`
- `customerId`
- `status`
- `subtotal`
- `shippingFee`
- `total`
- `phone`
- `address`
- `createdAt`
- `updatedAt`

#### `OrderItem`

Stores the snapshot of medicines purchased within an order.

Important fields:

- `id`
- `orderId`
- `medicineId`
- `quantity`
- `unitPrice`
- `linePrice`

#### `Review`

Stores customer/admin feedback for a medicine.

Important fields:

- `id`
- `medicineId`
- `userId`
- `rating`
- `comment`

#### Better Auth support models

The schema also includes:

- `Session`
- `Account`
- `Verification`

These are used by Better Auth for session management, linked accounts, and verification flows.

## Key Business Logic Notes

### Medicine listing

- Search is implemented with Prisma `contains` filters
- Search applies to `name`, `brand`, and `description`
- Filtering supports dosage form, brand, active status, and price range
- Sorting is dynamic based on `sortBy` and `sortOrder`

### Order pricing

- Prices are read from the database at order time
- Each order item stores `unitPrice` and `linePrice`
- Totals are computed on the server

### Inventory handling

- Medicine stock is decremented only after the order is created inside the transaction
- Order creation rejects quantities less than or equal to zero

## Current Implementation Notes

These points describe the backend as it exists today:

- Most protected business routes require authentication; there are no public catalog endpoints yet.
- Category routes are admin-only.
- Some route handlers use role checks only and do not add ownership checks on resource IDs.
- Some single-item lookups use Prisma `findMany`, so they return arrays.
- `PATCH /api/v1/orders/:orderId/status` updates the row but does not return the updated order object.
- Controllers return `500` for most thrown errors; there is no shared validation or error normalization layer yet.
- Request body validation is not implemented yet.
- Review rating bounds are not validated in the current service layer.

## Local Development Checklist

1. Create `.env` with the required values.
2. Install dependencies with `npm install`.
3. Make sure PostgreSQL is running and `DATABASE_URL` is correct.
4. Run `npx prisma generate`.
5. Run `npx prisma migrate dev`.
6. Start the server with `npm run dev`.

## Production Notes

- Use `npm run build` to compile the project
- Use `npm run start:prod` to apply migrations and start the compiled server
- Make sure `APP_URL`, SMTP credentials, database credentials, and Google OAuth credentials are set correctly

## Future Improvemnets

This README documents the existing codebase, not an idealized future version. Based on the current implementation, the backend does not yet include:

- a centralized validation layer
- a centralized error middleware
- automated tests
- rate limiting
- API versioning beyond the current `/api/v1` route prefix
- resource ownership enforcement for every seller/customer route
