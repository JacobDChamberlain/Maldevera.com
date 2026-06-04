# Chat Updates

Remaining issues to address in the chat app.

---

## Frontend

### ~~Enter key to send~~ ✓ Done
Neither the username input nor the message input handles `onKeyDown`. Users have to click the button to submit — pressing Enter does nothing.

### Username sent untrimmed to server
`socket.emit('setUsername', usernameInput, ...)` sends the raw (untrimmed) value. The server trims it before storing, and the client sets state to `usernameInput.trim()`, so they end up matching — but sending the trimmed value from the start would be cleaner.

### `username` variable shadowing
In the messages `map`, `{ username, msg }` shadows the outer `username` state variable. Works fine now but easy to cause a confusing bug later if the map callback gets more complex.

---

## Backend

### `onlineUsers` count includes unregistered connections
The count goes up as soon as anyone connects a socket, even before they set a username. So the number can be inflated by people who are on the username screen or have stale connections.

### Express CORS is wide open
`app.use(cors())` has no origin restrictions, so all REST API endpoints (`/api/inventory`, `/api/checkout`, etc.) are reachable from any origin. The socket.io CORS is properly locked down to `maldevera.com` and `localhost:3000` — the Express middleware should match.

---

## Features

### Image uploads
Three options, roughly in order of complexity:

- **Base64 over socket.io** — Encode the image client-side, emit it as a message, render with an `<img>` tag. Easiest (~1 hour). Downside: full binary goes to every connected client over the socket, so large images will be slow/heavy.

- **Upload to server + share URL** — Add a multipart upload endpoint to Express (e.g. `multer`), store on disk or S3, emit just the URL in chat. More robust, but requires a storage solution and a new API route.

- **Upload directly to S3/Cloudinary + share URL** — Client uploads straight to the storage service via presigned URLs, drops the URL in chat. Most scalable, offloads bandwidth entirely from the server. Requires a bucket/account setup.
