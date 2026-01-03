# Maldevera

### Taste the corners of your mind.

## [Maldevera.com](https://maldevera.com/)

---

## Tech Stack & Services

| Service | Purpose |
|---------|---------|
| **React** | Frontend framework |
| **Node.js / Express** | Backend API |
| **PostgreSQL** | Database |
| **Render** | Hosting (frontend + backend + database) |
| **Stripe** | Payment processing |
| **Resend** | Transactional emails |
| **Cloudflare** | DNS management, image hosting |
| **Namecheap** | Domain registration |

---

## Project Structure

```
maldevera_com/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context providers
│   │   └── hooks/      # Custom hooks
│   └── package.json
├── backend/            # Express API
│   ├── routes/         # API endpoints
│   ├── models/         # Sequelize models
│   ├── config/         # Database config
│   └── package.json
└── docker-compose.yml  # Local Docker setup (optional)
```

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (via Postgres.app or Docker)
- Stripe CLI (for webhook testing)

### Setup

1. **Clone and install dependencies:**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Set up environment variables:**
   ```bash
   # backend/.env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...  # From `stripe listen`
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   DB_NAME=maldevera_merch_inventory
   DB_HOST=localhost
   JWT_SECRET=your_secret
   FRONTEND_URL=http://localhost:3000
   RESEND_API_KEY=re_...
   ```

   ```bash
   # frontend/.env
   REACT_APP_BACKEND_URL=http://localhost:5001
   ```

3. **Start the database** (Postgres.app or Docker)

4. **Run migrations:**
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start

   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

6. **For Stripe webhook testing:**
   ```bash
   stripe login
   stripe listen --forward-to localhost:5001/api/webhooks
   ```

---

## Environment Variables

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe API key (live or test) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `DB_HOST` | PostgreSQL host |
| `DB_NAME` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for JWT tokens |
| `FRONTEND_URL` | Frontend URL for CORS |
| `RESEND_API_KEY` | Resend API key for emails |
| `NODE_ENV` | Environment (production/development) |
| `PORT` | Server port |

### Frontend (Render)
| Variable | Description |
|----------|-------------|
| `REACT_APP_BACKEND_URL` | Backend API URL |

---

## Recent Updates (January 2026)

- Migrated email sending from Gmail SMTP to **Resend** (Render blocks SMTP on free tier)
- Migrated DNS from Namecheap to **Cloudflare** for better record control
- Emails now sent from `orders@maldevera.com` with reply-to configured
- Set up local Stripe webhook testing with Stripe CLI
- Added Stripe webhook signature verification for security
- Order confirmation emails sent to customers with order details
- Order notification emails sent to MaldeveraTX@gmail.com with customer/shipping info
