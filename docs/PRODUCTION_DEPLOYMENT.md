# Production Deployment & Infrastructure Guide

---

## 1. Architecture Overview

```
[Customer Browser / Android App]
            │
       HTTPS / WSS
            ▼
   [Reverse Proxy: Nginx / Cloudflare]
      ├── /api/v1/*   ──► [Node.js Express API :5000]
      ├── /socket.io/*──► [Socket.io WebSocket :5000]
      └── /*          ──► [Next.js 15 Web/Admin :3000]
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
        [MongoDB Atlas Replica]        [Redis Cloud / Upstash]
```

---

## 2. Environment Variables Configuration

Copy `.env.example` to production `.env` and configure real credentials:

```bash
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1
CORS_ORIGIN=https://kittucafe.in,https://admin.kittucafe.in

# MongoDB Atlas URI (Use SSL with strong replica set)
MONGODB_URI=mongodb+srv://kittu_user:<PASSWORD>@cluster0.mongodb.net/kittu_cafe_prod?retryWrites=true&w=majority

# Production Redis URL
REDIS_URL=rediss://default:<PASSWORD>@redis-cluster.cloud:6379

# Cryptographically Secure JWT Secret (64+ random characters)
JWT_SECRET=<GENERATE_64_CHAR_HEX_SECRET>
JWT_EXPIRES_IN=7d

# Live Razorpay Credentials
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyyyyyyyyyy
RAZORPAY_WEBHOOK_SECRET=zzzzzzzzzzzzzzzzzzzzzzzz

# SMS Gateway (Turn off mock mode in production)
MOCK_SMS_OTP=false
```

---

## 3. Nginx Reverse Proxy & SSL Configuration

```nginx
server {
    server_name kittucafe.in www.kittucafe.in;

    # Next.js Customer Web & Admin Portal
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Node.js REST API
    location /api/v1/ {
        proxy_pass http://127.0.0.1:5000/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSockets (Socket.io)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/kittucafe.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kittucafe.in/privkey.pem;
}
```

---

## 4. Razorpay Webhook Configuration

1. In the Razorpay Dashboard -> Settings -> Webhooks -> Add New Webhook.
2. Webhook URL: `https://kittucafe.in/api/v1/payments/webhooks/razorpay`
3. Secret: Enter the same secret configured in `RAZORPAY_WEBHOOK_SECRET`.
4. Active Events:
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`
