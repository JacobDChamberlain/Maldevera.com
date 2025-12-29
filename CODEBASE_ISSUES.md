# Maldevera Website - Codebase Issues & Improvements

Analysis performed: 2025-12-29

---

## CRITICAL (Fix Before Anything Else)

### 1. Exposed Credentials in Git
**Files:** `backend/.env`, `docker-compose.yml`

Your `.env` file is committed with real secrets visible in git history:
- Stripe secret key
- JWT secret
- Gmail app password
- OpenAI API key
- Database password (`panda666`)

**Action:**
- [ ] Rotate ALL credentials immediately (Stripe, Gmail, OpenAI, DB password, JWT secret)
- [ ] Add `.env` to `.gitignore`
- [ ] Create `.env.example` with placeholder values
- [ ] Consider using git-filter-repo to scrub history

---

### 2. No Webhook Authentication
**File:** `backend/routes/webhooks.js`

Stripe webhooks accept ANY POST request without signature verification. Anyone can fake purchase completions.

**Action:**
- [ ] Add Stripe signature verification:
```javascript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
```

---

### 3. Unprotected Inventory Endpoint
**File:** `backend/routes/inventory.js`

`PUT /api/inventory` has no authentication - anyone can modify stock levels.

**Action:**
- [ ] Add JWT authentication middleware to this route
- [ ] Add input validation (check for valid IDs, positive integers)

---

### 4. JWT Stored in localStorage
**Files:** `frontend/src/components/Login/Login.js`, `frontend/src/components/Pages/CurrentStock/CurrentStock.js`

Tokens in localStorage are vulnerable to XSS attacks.

**Action:**
- [ ] Consider httpOnly cookies instead
- [ ] Or implement proper XSS protection

---

## HIGH Priority

### 5. No Input Validation
**File:** `backend/routes/inventory.js:30-51`

```javascript
const updates = req.body; // Accepts anything!
```

**Action:**
- [ ] Validate request body structure
- [ ] Ensure stock values are positive integers
- [ ] Validate item IDs exist

---

### 6. Race Conditions in Stock Management
**File:** `backend/routes/checkout.js`

Stock checked before Stripe processes, but webhook updates stock asynchronously. Concurrent purchases can oversell.

**Action:**
- [ ] Use database transactions with proper isolation
- [ ] Or implement optimistic locking

---

### 7. Memory Leak in Socket.io
**File:** `backend/server.js:43`

```javascript
const connectedUsers = {}; // Grows forever if disconnects fail
```

**Action:**
- [ ] Add periodic cleanup of stale connections
- [ ] Implement connection timeout/heartbeat

---

### 8. No Rate Limiting
**File:** `backend/routes/login.js`

Login endpoint has no rate limiting - vulnerable to brute force.

**Action:**
- [ ] Add express-rate-limit middleware
- [ ] Consider account lockout after failed attempts

---

## MEDIUM Priority

### 9. No Security Headers
**File:** `backend/server.js`

Missing: CSP, X-Content-Type-Options, X-Frame-Options, HSTS

**Action:**
- [ ] Add helmet middleware: `app.use(helmet())`

---

### 10. Array Index as React Key
**File:** `frontend/src/components/Pages/Chat/Chat.js:87`

```javascript
messages.map(({ username, msg }, index) => (
    <div key={index} ...> // Bad practice
))
```

**Action:**
- [ ] Use unique message ID or timestamp as key

---

### 11. Missing useMemo for Expensive Calculations
**File:** `frontend/src/components/Pages/Merch/Merch.js`

```javascript
const uniqueItems = inventory.reduce(...) // Recalculates every render
```

**Action:**
- [ ] Wrap in `useMemo` with proper dependencies

---

### 12. No Centralized API Client
**Files:** Multiple components

`fetch()` calls scattered throughout with no unified error handling.

**Action:**
- [ ] Create `src/api/client.js` with:
  - Base URL configuration
  - Error handling
  - Auth header injection
  - Retry logic

---

### 13. CI Tests Disabled
**File:** `.github/workflows/ci.yml`

Test step is commented out.

**Action:**
- [ ] Uncomment test step
- [ ] Actually write tests (testing libraries installed but unused)

---

### 14. Unprofessional Code
**Files:** Various

- `server.js`: Error message says "because you're a bitch"
- Routes: `/sad-yeet` for payment failure, `/sup` for chat
- JWT secret: `tastethecornersofmyass`

**Action:**
- [ ] Clean up language if this goes public/professional

---

## LOW Priority

### 15. Dead Code & Comments
**Files:**
- `frontend/src/components/App/App.js` - 46 lines of commented HTML
- `frontend/src/components/Pages/Tours/Tours.js` - 50+ lines commented CSS
- `frontend/src/components/Pages/Shows/Shows.js` - Commented show data

**Action:**
- [ ] Remove commented code (git has history)

---

### 16. Excessive Console Logging
**Files:** Multiple

Production code has console.log everywhere.

**Action:**
- [ ] Remove or conditionally disable in production
- [ ] Consider proper logging library (winston/pino)

---

### 17. No TypeScript
Entire codebase is untyped JavaScript.

**Action:**
- [ ] Consider gradual TypeScript migration
- [ ] Or add PropTypes to React components at minimum

---

### 18. Outdated Dependencies
**File:** `package.json`

- react-scripts 5.0.1 (2022)
- No ESLint/Prettier configured

**Action:**
- [ ] Update dependencies
- [ ] Add linting configuration

---

### 19. Unused Dependencies
**File:** `frontend/package.json`

- `react-zoom-pan-pinch` imported but never used

**Action:**
- [ ] Remove unused packages

---

### 20. Missing Error Tracking
No Sentry or similar for production error monitoring.

**Action:**
- [ ] Add error tracking service

---

## Architecture Notes

| Issue | Status |
|-------|--------|
| No TypeScript | Not implemented |
| No tests | Libraries installed, 0 tests written |
| No API documentation | No OpenAPI/Swagger |
| No graceful shutdown | Server doesn't handle SIGTERM |
| Images not optimized | No lazy loading, no compression |
| No code splitting | Single bundle, no lazy routes |

---

## File Quick Reference

| File | Issues |
|------|--------|
| `backend/.env` | Exposed credentials |
| `backend/routes/webhooks.js` | No auth, no signature verification |
| `backend/routes/inventory.js` | No auth, no validation |
| `backend/server.js` | Memory leak, unprofessional messages |
| `frontend/src/components/Pages/Chat/Chat.js` | Bad React keys |
| `frontend/src/components/Pages/Merch/Merch.js` | Missing useMemo |
| `.github/workflows/ci.yml` | Tests disabled |

---

## Recommended Order of Operations

1. Rotate all exposed credentials
2. Add `.env` to `.gitignore`
3. Add webhook signature verification
4. Add auth to inventory endpoint
5. Add input validation
6. Add rate limiting
7. Add security headers (helmet)
8. Clean up dead code
9. Write tests
10. Consider TypeScript migration
