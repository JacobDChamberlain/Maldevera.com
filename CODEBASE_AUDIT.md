# Maldevera Codebase Audit

## Summary

**Stack:** React 18 frontend + Express/PostgreSQL backend (monorepo)
**Lines:** ~1,725 frontend + ~500 backend
**Verdict:** Several critical security issues need immediate attention. Code quality is moderate with significant dead code and missing best practices.

---

## CRITICAL - Fix Immediately

### 1. Exposed Credentials in Git
**Location:** `backend/.env` (committed to repo)

Exposed secrets:
- Stripe test key
- JWT secret
- Gmail app password
- OpenAI API key
- Database password

**Also:** `docker-compose.yml` has hardcoded `panda666` password

**Action:** Rotate ALL credentials immediately, remove from git history with `git-filter-repo`

### 2. Missing Webhook Signature Verification
**Location:** `backend/routes/webhooks.js:6-7`

```javascript
router.post('/', async (req, res) => {
    const event = req.body;  // NO SIGNATURE VERIFICATION
```

Attackers can fake payment completion events.

### 3. Unprotected Inventory API
**Location:** `backend/routes/inventory.js:30-51`

PUT endpoint has:
- No authentication
- No input validation
- No type checking

Anyone can modify stock levels.

### 4. Race Condition in Stock Management
**Location:** `backend/routes/checkout.js`

Stock checked before payment, deducted after - concurrent purchases can oversell inventory.

---

## HIGH - Fix Soon

### 5. No Rate Limiting on Login
**Location:** `backend/routes/login.js`

Vulnerable to brute force attacks.

### 6. Missing Security Headers
**Location:** `backend/server.js`

No `helmet()` middleware - missing CSP, X-Frame-Options, HSTS, etc.

### 7. JWT in localStorage
**Location:** `frontend/src/components/Login/Login.js:20`

Vulnerable to XSS. Consider httpOnly cookies.

### 8. Socket.io Memory Leak
**Location:** `backend/server.js:43-47`

`connectedUsers` object grows indefinitely if disconnect handlers fail.

---

## MEDIUM - Code Quality

### 9. Dead Code (~150+ lines)
| File | Lines | Description |
|------|-------|-------------|
| `App.js` | 30-73 | Commented HTML decorations |
| `Tours.js` | 20-147 | Commented tour data/CSS |
| `Shows.js` | 6-42 | Commented imports |
| `Home.js` | 12, 18-21 | Commented embed IDs |

### 10. Missing useMemo
**Location:** `frontend/src/components/Pages/Merch/Merch.js:10-16`

Expensive `reduce()` with nested `find()` runs every render.

### 11. Bad React Keys
**Location:** `frontend/src/components/Pages/Chat/Chat.js:87`

Using array index as key - causes bugs with message updates.

### 12. No Centralized API Client
Fetch calls scattered in 5+ files with duplicated error handling patterns:
- `InventoryContext.js`
- `MerchCart.js`
- `Login.js`
- `CurrentStock.js`
- `Chat.js` (inconsistent fallback URL)

### 13. Console Logs
22 total (12 backend, 10 frontend) - reasonable amount. A few have unprofessional messages.

### 14. Large Files Need Splitting
| File | Lines | Concerns Mixed |
|------|-------|----------------|
| `webhooks.js` | 165 | Stripe + stock + email templating + sending |
| `CurrentStock.js` | 190 | Auth + fetching + editing + UI |
| `MerchCartContext.js` | 86 | Context + logic + UI rendering |

---

## LOW - Nice to Have

### 15. No Tests
Testing libraries installed but zero test files exist.

### 16. No Error Boundary
Unhandled component errors crash entire app.

### 17. No Code Splitting
All components bundled together, no lazy loading.

### 18. No TypeScript/PropTypes
Entire codebase untyped.

### 19. Unused Dependency
`react-zoom-pan-pinch` in package.json but never imported.

### 20. Unprofessional Messages
- `server.js:95` - "probably because you're a bitch"
- `server.js:93` - "Database connected! Fuck on!"
- `checkout.js:59` - Cancel URL `/sad-yeet`
- `Login.js` - "Who amst you", "prove it"

---

## Fix Priority Checklist

```
[ ] 1. Rotate all exposed credentials
[ ] 2. Remove .env from git history
[ ] 3. Add Stripe webhook signature verification
[ ] 4. Add auth to inventory PUT endpoint
[ ] 5. Add rate limiting to login
[ ] 6. Add helmet() middleware
[ ] 7. Fix stock race condition with transactions
[ ] 8. Remove dead commented code
[ ] 9. Add useMemo to Merch.js
[ ] 10. Fix Chat.js React keys
[ ] 11. Create centralized API client
[ ] 12. Add Error Boundary
[ ] 13. Split large files
[ ] 14. Clean up unprofessional messages
[ ] 15. Add basic tests
```

---

## Architecture Notes

**Current Structure:**
```
maldevera_com/
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/ # 32 component files
│   │   ├── context/    # 2 context providers
│   │   └── hooks/      # 1 custom hook
│   └── package.json
├── backend/            # Express API
│   ├── routes/         # 5 route files
│   ├── models/         # 2 Sequelize models
│   └── server.js
└── docker-compose.yml
```

**Recommended Changes:**
1. Add `/backend/middleware/` for auth, validation, rate limiting
2. Add `/backend/services/` for email, stripe logic extraction
3. Add `/frontend/src/api/` for centralized fetch client
4. Add `/frontend/src/components/common/ErrorBoundary.js`
