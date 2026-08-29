# BookTix Backend — Python Flask + SQLite3

This is the backend for your BookTix project. It's a Flask API that stores
everything (events, bookings, users, organizers) in a local **SQLite3** database,
and it's what your React frontend will talk to instead of using browser
storage.

**Zero setup needed for the database** — SQLite3 comes built into Python,
and the database tables and seed data will initialize automatically the first
time you start `python app.py`.

---

## 0. The big picture (read this first)

Right now your **frontend** (the React site) stores everything in your
browser using `localStorage` — that's why it works without a backend, but
also why the data disappears if you clear your browser or open the site on
a different computer.

This **backend** replaces that. It's a separate program that:
1. Runs on your computer (or a server) listening on a port (`5000`)
2. Talks to a SQLite database (`database/booktix.db`) to permanently store data
3. Exposes URLs like `http://localhost:5000/api/events` that your React app
   will call to get/save real data

**You will run TWO things at once** while developing:
- Terminal 1: your React frontend (`npm run dev`, port 5173)
- Terminal 2: this Flask backend (`python app.py`, port 5000)

They're two separate programs that talk to each other over HTTP.

---

## 1. Install the tools you need

You only need:

### Python
1. Install Python 3 (3.10+) if not already installed.
2. Verify: open Command Prompt and run:
   ```
   python --version
   ```

### Node.js
1. Verify: open Command Prompt and run:
   ```
   node --version
   ```


---

## 2. Unzip and open the project

1. Unzip **booktix-backend.zip** somewhere on your computer (e.g. Desktop).
2. Open VS Code → **File → Open Folder** → select the `booktix-backend`
   folder (same way you opened the frontend project).
3. Open a terminal inside VS Code (**Terminal → New Terminal**).

---

## 3. Create the database

## 2. Open the project
Open this folder in VS Code.

---

## 3. Database Setup (Automatic!)
You **do not** need to install MySQL or create databases manually.
When you run `python app.py`, the backend will automatically create `database/booktix.db` with all tables and sample data.

Default Admin credentials:
```
Email:    admin@booktix.com
Password: admin123
```


## 5. Install the Python packages

In the VS Code terminal, inside the `booktix-backend` folder, run:

```
pip install -r requirements.txt
```

This installs Flask and everything else the backend needs (listed in
`requirements.txt`).

> If `pip` isn't recognized, try `pip3` or `python -m pip install -r requirements.txt` instead.

---

## 6. Run the backend

```
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

Leave this terminal running. Open `http://localhost:5000/api/health` in
your browser — you should see:
```json
{"status": "ok", "message": "BookTix backend is running"}
```

If you see that, your backend is fully working. 🎉

---

## 7. What each folder does

| Folder/file | What it's for |
|---|---|
| `app.py` | Starts the server, connects all the routes together |
| `config.py` | Reads your `.env` settings |
| `database/schema.sql` | The table structure (run once to set up MySQL) |
| `database/seed.sql` | Sample data + the admin login |
| `models/` | Every SQL query the app runs, one file per table |
| `routes/` | Every URL the app responds to, grouped by feature |
| `utils/auth.py` | Password security + login tokens (JWT) |

**How a request flows:** Your React app calls a URL like
`GET /api/events` → Flask finds the matching route in
`routes/event_routes.py` → that route calls a function in
`models/event.py` → that function runs SQL against MySQL → the result
goes back to React as JSON.

---

## 8. All the API endpoints

| Method | URL | Who can use it | What it does |
|---|---|---|---|
| POST | `/api/auth/register` | Anyone | Create an attendee account |
| POST | `/api/auth/login` | Anyone | Log in, get a token back |
| GET | `/api/events` | Anyone | List events (`?category=&city=&q=` filters) |
| GET | `/api/events/<id>` | Anyone | View one event |
| POST | `/api/events` | Admin only | Add a new event |
| PUT | `/api/events/<id>` | Admin only | Edit an event |
| DELETE | `/api/events/<id>` | Admin only | Delete an event |
| POST | `/api/bookings` | Anyone | Book tickets |
| GET | `/api/bookings?email=...` | Anyone | Look up your own bookings |
| GET | `/api/bookings` | Admin only | View ALL bookings |
| PUT | `/api/bookings/<id>/pay` | Anyone | Confirm/fail a payment |
| GET | `/api/users` | Admin only | List registered users |
| GET/POST/PUT/DELETE | `/api/organizers` | Admin only | Manage organizers |
| GET | `/api/reports/summary` | Admin only | Revenue & stats |

**"Admin only"** routes require a header:
`Authorization: Bearer <the token you got from /login>`

---

## 9. Connecting your React frontend to this backend

Right now, `src/context/AppContext.jsx` in your frontend reads/writes
`localStorage`. To make it use this real backend instead, you'll replace
each function's insides with a `fetch()` call. For example:

**Before (demo/mock):**
```js
const login = ({ email, password }) => {
  const isAdmin = email.toLowerCase().includes('admin');
  const user = { name: ..., email, role: isAdmin ? 'Admin' : 'Attendee' };
  setCurrentUser(user);
  return { ok: true, user };
};
```

**After (real backend):**
```js
const login = async ({ email, password }) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { ok: false, message: data.error };
  localStorage.setItem('booktix_token', data.token); // save the token
  setCurrentUser(data.user);
  return { ok: true, user: data.user };
};
```

For admin actions (add event, view users, etc.), you'll add the saved
token to the request:
```js
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('booktix_token')}`,
},
```

I can do this whole rewrite of `AppContext.jsx` for you next — just say the
word and I'll wire the two projects together completely, so you can run
both and see it all working end-to-end.

---

## 10. Common problems

| Problem | Fix |
|---|---|
| `Could not connect to MySQL` when running `python app.py` | Your `.env` password is wrong, or MySQL isn't running. Re-check step 4. |
| `ModuleNotFoundError: No module named 'flask'` | Run `pip install -r requirements.txt` again inside the `booktix-backend` folder. |
| `pip` / `python` not recognized | Python wasn't added to PATH — reinstall Python and tick that box. |
| CORS error in the browser console | Make sure `python app.py` is actually running — the frontend can't reach a backend that isn't started. |
| `Address already in use` | Something else is using port 5000. Stop it, or change `PORT=5001` in `.env` and update the frontend's URL to match. |
