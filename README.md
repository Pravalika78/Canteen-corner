<div align="center">

<img src="./Canteencorner.png" alt="Canteen Corner Logo" width="120" />

# Canteen Corner

**A full-stack canteen food ordering system — order, collect, enjoy.**

[![Made with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

[🌐 Live Demo](https://your-deployed-url.vercel.app) · [✨ Features](#-features) · [🚀 Quick Start](#-quick-start)

</div>

---

## 📖 About

**Canteen Corner** is a modern canteen ordering platform built for college campuses, offices, and small food courts. Customers browse the menu, add items to a cart, and place orders for pickup — while admins manage the entire menu and incoming orders in real time.

Built end-to-end with **React**, **Node.js/Express**, and **MongoDB Atlas**, with JWT-based authentication, Gmail-powered password recovery, and a fully responsive mobile-friendly UI.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 👤 User Side

- Sign up / Login with User ID + password
- Forgot password via Gmail reset link
- 12 food categories (Breakfast, Lunch, Smoothies, etc.)
- Browse items with images, price, and stock
- Add to cart with quantity controls
- Cash / UPI payment selection
- Order success confirmation with receipt
- Order history ("My Orders" page)

</td>
<td width="50%" valign="top">

### 🔐 Admin Side

- Secure admin login (Gmail + password + secret code)
- Dashboard with 3 modules
- **Add Items** — upload food with images
- **Update Items** — inline edit / delete
- **Orders** — view & remove handed-over orders
- Separate admin signup & password reset

</td>
</tr>
</table>

---

## 🛠 Tech Stack

<table>
<tr>
<td><b>Frontend</b></td>
<td>
<img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/React_Scripts-5.0-61DAFB?logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" />
</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>
<img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" />
</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>
<img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white" />
</td>
</tr>
<tr>
<td><b>Auth</b></td>
<td>
<img src="https://img.shields.io/badge/JWT-000000?logo=json-web-tokens&logoColor=white" />
<img src="https://img.shields.io/badge/bcrypt-003A70?logo=letsencrypt&logoColor=white" />
</td>
</tr>
<tr>
<td><b>Email</b></td>
<td>
<img src="https://img.shields.io/badge/Nodemailer-22B573?logo=minutemailer&logoColor=white" />
</td>
</tr>
<tr>
<td><b>Hosting</b></td>
<td>
<img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white" />
</td>
</tr>
</table>

---

## 🚀 Quick Start

Run Canteen Corner on your own machine in under 5 minutes.

### Prerequisites

- [Node.js](https://nodejs.org) v16+
- [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)
- _(Optional)_ [Gmail App Password](https://myaccount.google.com/apppasswords) for password-reset emails

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/canteen-corner.git
cd canteen-corner
```

### 2️⃣ Setup the Backend

```bash
cd server
npm install
```

### 3️⃣ Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
# Windows PowerShell
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `server/.env` and fill in **your own values**:

| Variable       |  Required   | Description                            |
| -------------- | :---------: | -------------------------------------- |
| `MONGO_URI`    |     ✅      | Your MongoDB Atlas connection string   |
| `JWT_SECRET`   |     ✅      | Any random long text                   |
| `ADMIN_SECRET` |     ✅      | Any word you choose (admin login key)  |
| `PORT`         |     ⚠️      | Leave as `5000`                        |
| `EMAIL_USER`   | 🟡 Optional | Your Gmail (for reset-password emails) |
| `EMAIL_PASS`   | 🟡 Optional | Gmail App Password                     |
| `FRONTEND_URL` |     ⚠️      | Leave as `http://localhost:3000`       |

<details>
<summary>📌 How to get your MongoDB URI (click to expand)</summary>

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free cluster
2. Create a database user (remember the password)
3. Network Access → add IP `0.0.0.0/0` (allow all)
4. Click **Connect → Drivers** → copy the connection string
5. Replace `<password>` and add `/food_zone` before the `?`

**Example:**

```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/food_zone?retryWrites=true&w=majority
```

</details>

### 4️⃣ Start the Backend

```bash
npm start
```

You should see:

```
MongoDB Connected (Atlas)
Server running on port 5000
```

✅ Leave this terminal running.

### 5️⃣ Start the Frontend (new terminal)

Open a **second terminal** in VS Code (click the `+` icon):

```bash
cd client
npm install
npm start
```

React opens automatically at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Admin Access

The admin panel is protected by a secret code that **you set yourself**.

1. On the home page, click **"I'm an Admin"**
2. Click **"Sign up"**
3. Enter your Gmail ID + password
4. After signup, log in with your credentials **+ the `ADMIN_SECRET` from your `.env`**

> ⚠️ Never share your `ADMIN_SECRET` publicly. If leaked, change it in `.env` immediately.

---

## 📁 Project Structure

```
canteen-corner/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js              # Main app (all pages)
│   │   ├── App.css             # Global styles
│   │   ├── Header.js           # Header component
│   │   ├── index.js            # Entry point
│   │   └── ...
│   ├── .env.example            # Client env template
│   └── package.json
│
├── server/                     # Node.js backend
│   ├── server.js               # Express + all routes
│   ├── .env.example            # Server env template
│   ├── .env                    # Your secrets (NOT on GitHub)
│   └── package.json
│
├── Canteencorner.png           # Logo for README
├── .gitignore
└── README.md
```

---

## 🌐 Deployment

Deploy your own instance for free using **Vercel** (frontend) and **Render** (backend).

<details>
<summary>🚀 Deploy Backend on Render (click to expand)</summary>

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables**:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ADMIN_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL` _(fill after frontend deploys)_
6. Deploy → you get `https://your-app.onrender.com`

</details>

<details>
<summary>🚀 Deploy Frontend on Vercel (click to expand)</summary>

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the same GitHub repo
3. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Create React App
4. Add **Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-app.onrender.com`
5. Deploy → you get `https://your-app.vercel.app`

Finally, go back to Render and set `FRONTEND_URL` to your Vercel URL.

</details>

---

## 🔒 Security

- ✅ Passwords hashed with **bcrypt**
- ✅ Login tokens signed with **JWT**
- ✅ Admin access gated by **secret code**
- ✅ `.env` files are **gitignored** — real secrets never reach GitHub
- ✅ Password reset tokens expire in **15 minutes**

**If a secret ever leaks:**

1. Rotate your MongoDB password
2. Revoke and recreate your Gmail App Password
3. Change `JWT_SECRET` and `ADMIN_SECRET` to new random values

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and share.

---

<div align="center">

**Built by [Your Name](https://github.com/<your-username>)**

⭐ If this project helped you, consider giving it a star!

</div>
