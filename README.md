# 🛒 Amazon Sample Storefront

This project is a simplified **Amazon-style e-commerce frontend** built using plain JavaScript, HTML, and CSS. It simulates core shopping functionality including:

- Product listings with search
- Product detail pages
- Shopping cart and checkout
- Order history
- Order tracking
- Delivery options

---

## 🚀 Features

- 🔎 **Product Search**
- 📦 **Product Detail View**
- 🛒 **Cart Management (localStorage)**
- 💸 **Checkout Summary with Tax/Shipping**
- 🧾 **Orders Page**
- 🚚 **Order Tracking Progress Bar**
- 📦 **Reusable Product Types** (Appliances, Clothing)
- 🎨 **SwiperJS Carousel Integration**

---

## 🧠 Technologies Used

- ✅ Vanilla JavaScript (ES6+)
- ✅ HTML5 & CSS3
- ✅ SwiperJS (carousel)
- ✅ `localStorage` for cart and orders
- ✅ [Day.js](https://day.js.org) for date formatting
- ✅ [Jasmine](https://jasmine.github.io/) for testing

## 📦 Data Models

- **Product** – Base class with methods for price and rating display.
- **Clothing & Appliance** – Extend `Product` with extra HTML info.
- **Cart** – Handles add/remove/update/clear and syncs with `localStorage`.
- **Orders** – Stored locally after checkout; includes order date, total, products, delivery dates.

## 🧪 Sample API Integration

Products are fetched from:
```bash
https://supersimplebackend.dev/products
```

Orders are posted to:
```bash
https://supersimplebackend.dev/orders
```

## 🛠 Setup Instructions
1. Clone the repo:
```bash
git clone https://github.com/shar0ff/amazon-sample.git
cd amazon-sample
```

2. Open amazon.html in your browser (via Live Server or a simple file server).

## 👨‍💻 Authors
- [Ivan Sharov](https://www.linkedin.com/in/ivan-sharov-964421282/)