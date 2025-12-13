# 🗞️ Paperboy API

> **A Serverless Microservice for Programmatic PDF Generation.**

![Node.js](https://img.shields.io/badge/Node.js-v18-green?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/Express-v4-blue?style=flat&logo=express)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)

Paperboy is a lightweight, high-performance API designed to solve the common pain point of generating professional documents (Invoices, Receipts, Reports) from web applications.

Instead of relying on buggy CSS-to-Print hacks on the frontend, Paperboy accepts raw JSON data, renders a pixel-perfect PDF using **PDFKit**, and **streams the binary data** directly to the client.

**[View the Live Frontend & Documentation](https://paperboy-web-three.vercel.app/)**

---

## ⚡ Key Features

* **Serverless Architecture:** Optimized for Vercel Functions (cold starts < 500ms).
* **Zero-Storage:** Uses Node.js Streams to pipe the PDF directly to the response. No files are ever saved to the disk, ensuring speed and privacy.
* **Dynamic Data:** Accepts dynamic lists of items, calculating totals and layouts automatically.
* **CORS Enabled:** Ready to be consumed by any frontend (React, Vue, Mobile Apps).

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js (handling routing and middleware)
* **PDF Engine:** PDFKit (programmatic vector drawing)
* **Infrastructure:** Vercel (Serverless Deployment)

---

## 🚀 Getting Started

Follow these steps to run the API locally on your machine.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/paperboy-api.git](https://github.com/yourusername/paperboy-api.git)
    cd paperboy-api
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    node api/index.js
    ```
    The server will start at `http://localhost:3000`.

---

## 📖 API Reference

### Generate Invoice

**Endpoint:** `POST /api/generate-invoice`

Generates a PDF file based on the provided client and item details.

#### Request Body (JSON)

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `client` | `string` | **Required.** The name of the client or company. |
| `items` | `array` | **Required.** A list of items to include in the invoice. |

#### Example Payload

```json
{
  "client": "Wayne Enterprises",
  "items": [
    { "name": "Security System Upgrade", "price": 50000 },
    { "name": "Consulting Fee", "price": 1500 }
  ]
}
```

#### Response

* **Status:** `200 OK`
* **Content-Type:** `application/pdf`
* **Body:** Binary PDF Stream

---

## 🧪 Testing

You can test the API locally using `curl` or Postman.

**Using Curl:**

```bash
curl -X POST http://localhost:3000/api/generate-invoice \
   -H "Content-Type: application/json" \
   -d '{"client": "Test Corp", "items": [{"name": "Test Item", "price": 100}]}' \
   --output invoice.pdf
```

---

## 📂 Project Structure

This project follows the **Vercel Serverless** convention.

```text
paperboy-api/
├── api/
│   └── index.js       # Main Express App & PDF Logic
├── vercel.json        # Vercel Routing Configuration
├── package.json       # Dependencies
└── README.md          # Documentation
```

* **`/api/index.js`**: Unlike a standard Express app, the entry point is located in the `/api` folder so Vercel recognizes it as a serverless function.
* **`vercel.json`**: Rewrites all incoming traffic to the API entry point to simulate a standard REST API structure.

---

## 🚢 Deployment

This project is configured for **zero-config deployment** on Vercel.

1.  Push your code to GitHub.
2.  Import the repository in the Vercel Dashboard.
3.  Vercel will automatically detect the `vercel.json` configuration.
4.  Click **Deploy**.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
