<h1>🔐 SecureAuthExpressReact</h1>

<p align="center">
  <strong>A Full-Stack, Security-First Authentication System</strong><br>
  Express.js Backend & React.js Frontend
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge" alt="MIT License">
</p>

<h2>Project Overview</h2>

<p>This project implements a secure, full-stack authentication system designed for robustness and production-readiness. It features a separate <strong>Express.js backend</strong> API and a <strong>React.js frontend</strong>, demonstrating a complete separation of concerns.</p>

<p>The system is built from the ground up with security as the top priority, incorporating CSRF protection, secure cookie management, rate limiting, and a full-featured Role-Based Access Control (RBAC) system.</p>

<hr>

<h2>Features & Functionality</h2>

<p>This project goes beyond a simple login system and includes a wide range of production-grade features.</p>

<h3>🛡️ Robust Security</h3>

<ul>
  <li><strong>CSRF Protection:</strong> Implemented using <code>csurf</code>. All state-changing requests (POST, PATCH, DELETE) require a valid <code>x-csrf-token</code> header, which is fetched securely by the client.</li>
  <li><strong>Secure <code>HttpOnly</code> Cookies:</strong> Both JWT tokens and session IDs are stored in <code>HttpOnly</code> cookies, making them inaccessible to client-side JavaScript (mitigating XSS attacks).</li>
  <li><strong>Password Hashing:</strong> All user passwords are securely hashed using <code>bcryptjs</code>.</li>
  <li><strong>Rate Limiting:</strong> Login routes are protected by <code>express-rate-limit</code> to defend against brute-force attacks.</li>
  <li><strong>Secure Headers:</strong> Uses <code>helmet</code> to automatically set important HTTP security headers.</li>
  <li><strong>JWT Blacklisting:</strong> On logout, JWTs are added to a <code>tokens_blacklist</code> table in the database, invalidating them immediately even if they have not expired.</li>
  <li><strong>Input Validation:</strong> All API routes use <code>express-validator</code> to sanitize and validate incoming data (e.g., ensuring valid emails, password lengths).</li>
</ul>

<h3>🚦 Dual Authentication Strategies</h3>

<p>The application is uniquely configured to support <em>both</em> stateful and stateless authentication, allowing you to compare the two approaches:</p>

<ol>
  <li><strong>Stateless (JWT):</strong> Login via <code>POST /api/auth/login</code>. This method validates the user and returns a JSON Web Token (JWT) in a secure <code>HttpOnly</code> cookie (<code>accessToken</code>). Subsequent requests are authenticated by this token.</li>
  <li><strong>Stateful (Sessions):</strong> Login via <code>POST /api/auth/login-session</code>. This method uses traditional <code>express-session</code> backed by <code>connect-sqlite3</code> to store session data on the server and provides a session ID cookie (<code>connect.sid</code>) to the client.</li>
</ol>

<h3>👑 Role-Based Access Control (RBAC)</h3>

<ul>
  <li><strong>Two User Roles:</strong> The system is built with two distinct roles: <code>Usuario</code> (User) and <code>Administrador</code> (Admin).</li>
  <li><strong>Backend Middleware:</strong>
    <ul>
      <li><code>auth.middleware.js</code>: Protects routes by verifying a user is authenticated (via <em>either</em> session or JWT).</li>
      <li><code>rol.middleware.js</code>: A flexible middleware that gates routes for specific roles (e.g., <code>checkRole(['Administrador'])</code>).</li>
    </ul>
  </li>
  <li><strong>Frontend Route Guards:</strong>
    <ul>
      <li><code>&lt;IsAnon&gt;</code>: Protects routes for unauthenticated users (like Login, Register).</li>
      <li><code>&lt;IsPrivate&gt;</code>: Protects routes for any authenticated user (like the Dashboard).</li>
      <li><code>&lt;IsAdmin&gt;</code>: Protects routes exclusively for Admin users (like the Admin Panel).</li>
    </ul>
  </li>
</ul>

<h3>🛠️ Full-Featured Admin Panel</h3>

<p>A dedicated admin-only section (<code>/admin</code>) allows administrators to manage the application's user base.</p>

<ul>
  <li>View a complete list of all registered users.</li>
  <li>Promote any <code>Usuario</code> to an <code>Administrador</code>.</li>
  <li>Demote any <code>Administrador</code> to a <code>Usuario</code>.</li>
  <li>Delete users from the database.</li>
</ul>

<hr>

<h2>Quick Start (Local)</h2>

<h3>1. Clone the repository</h3>

<pre><code>git clone https://github.com/ManuCodello/SecureAuthExpressReact.git
cd SecureAuthExpressReact
</code></pre>

<h3>2. Backend Setup</h3>

<p>The backend runs on <strong>SQLite</strong>, so there is <strong>no database server required</strong>.</p>

<pre><code># Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create the environment file
cp .env.example .env
</code></pre>

<p>Now, edit the <code>.env</code> file with your own secrets:</p>

<p><strong>.env (backend)</strong></p>
<pre><code># A secret string for signing sessions
SESSION_SECRET=myStrongSessionSecret123

# A secret string for signing JSON Web Tokens
JWT_SECRET=myStrongJWTSecret456

# The port to run the server on
PORT=5001

# Set to 'production' to enable secure cookies
NODE_ENV=development
</code></pre>

<p><strong>Run the backend:</strong></p>
<pre><code># Run the development server (with nodemon)
npm run dev
</code></pre>

<p>The backend server will start on <code>http://localhost:5001</code>.</p>

<h3>3. Create Your Admin User</h3>

<p>To test the admin panel, you must first create an admin user. You can either:<br>
A) Register a new user via the app and then run the seed script, or<br>
B) Run the seed script to create one from scratch.</p>

<pre><code># This script will find 'admin@passport.com' and make it an admin,
# or create it if it doesn't exist.
node seed-admin.js
</code></pre>

<h3>4. Frontend Setup</h3>

<pre><code># Open a new terminal and navigate to the frontend
cd ../frontend

# Install dependencies
npm install

# Run the React development server
npm run dev
</code></pre>

<p>The frontend will start on <code>http://localhost:5173</code> (as configured in <code>backend/server.js</code>'s CORS options). You can now register, log in, and test the application.</p>

<hr>

<h2>API Endpoints</h2>

<h3>Auth</h3>
<ul>
  <li><code>GET /api/csrf-token</code>: Gets a CSRF token required for state-changing requests.</li>
  <li><code>POST /api/auth/register</code>: Register a new user (default role: <code>Usuario</code>).</li>
  <li><code>POST /api/auth/login</code>: Log in using JWT (stateless). Sets <code>accessToken</code> cookie.</li>
  <li><code>POST /api/auth/login-session</code>: Log in using Sessions (stateful). Sets <code>connect.sid</code> cookie.</li>
  <li><code>POST /api/auth/logout</code>: Logs out by clearing all cookies, destroying the session, and blacklisting the JWT.</li>
  <li><code>GET /api/auth/verify</code>: A silent endpoint (used by React context) to check if the user is currently authenticated via session or JWT.</li>
</ul>

<h3>Profile</h3>
<ul>
  <li><code>GET /api/profile/me</code>: (Private) Gets the profile information of the currently logged-in user.</li>
</ul>

<h3>Users (Admin Only)</h3>
<ul>
  <li><code>GET /api/users</code>: (Admin) Gets a list of all users in the database.</li>
  <li><code>POST /api/users/create</code>: (Admin) Creates a new user (can specify role).</li>
  <li><code>PATCH /api/users/:id/role</code>: (Admin) Updates the role of a specific user.</li>
  <li><code>DELETE /api/users/:id</code>: (Admin) Deletes a specific user.</li>
</ul>

<hr>

<h2>Folder Structure</h2>

<pre><code>SecureAuthExpressReact/
├── backend/
│   ├── config/
│   │   ├── database.js     # SQLite setup and schema
│   │   └── database.sqlite   # The database file
│   ├── controllers/        # Handles request logic (auth, user, profile)
│   ├── middleware/         # Auth and Role-checking middleware
│   ├── models/             # Database interaction (User, TokenBlacklist)
│   ├── routes/             # API route definitions
│   ├── __test__/           # Jest/Supertest unit tests
│   ├── .env.example
│   ├── package.json
│   └── server.js           # Express server initialization
│
└── frontend/
    ├── src/
    │   ├── components/     # Route Guards (IsAdmin, IsPrivate, IsAnon)
    │   ├── context/        # AuthContext (global state)
    │   ├── pages/          # React components for each page
    │   ├── services/       # Axios services (auth.service, user.service)
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
</code></pre>

<hr>

<h2>Author</h2>

<p><strong>Manu Codello</strong> — Full-stack developer passionate about secure applications.<br>
GitHub: <a href="https://github.com/ManuCodello">github.com/ManuCodello</a></p>

<h2>License</h2>

<p>This project is licensed under the <strong>MIT License</strong>.</p>
