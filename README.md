# Employee Performance Review - Backend (Node.js + Express)

## What's included
- Express server with authentication (JWT)
- Mongoose models: User, Review
- Routes: auth, users, reviews
- Seed script to create sample users
- .env.sample

## Requirements
- Node.js (>=14)
- MongoDB (local or cloud)

## Setup
1. Copy `.env.sample` to `.env` and update `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:
   ```
   npm install
   ```
3. Seed sample users (optional):
   ```
   node seed.js
   ```
4. Start server:
   ```
   npm run dev
   ```
5. API will run on `http://localhost:4000` by default.

## Notes
- This is a development demo. Do not use default secrets in production.
- Enhance validation, error handling, and security before deploying.
