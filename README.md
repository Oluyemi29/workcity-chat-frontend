# Real time Chat App

This is the frontend for **Real Time Chat App**, built using **React** and **Vite**. It provides a responsive interface for chatting with admin,agent,designer,merchant and customer.

---

## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Challenges](#challenges)

---

## Technologies

- **React 19** - Frontend library
- **Vite** - Fast development build tool
- **TypeScript** - Type safety for JavaScript
- **React Router** - Page routing
- **Tailwind CSS** - Styling

---

## Setup

1. **Clone the repository:**

```bash
git clone https://github.com/Oluyemi29/workcity-chat-frontend.git
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Running the Project:**
   Development mode (hot reload):

```bash
npm run dev
```

4. **Production build:**

```bash
npm run build
```

## Challenges

**Challenges**

Page Reload 404:
Using React Router with Vite required proper configuration in vercel.json to handle client-side routing.

Online Users Indicator:
Handling real-time updates for online users via WebSocket and managing state to prevent empty or duplicated entries.

Scroll-to-Bottom on Messages:
Implementing automatic scrolling for chat messages using useRef and useEffect

**Deployment**

The frontend is deployed on Vercel.
