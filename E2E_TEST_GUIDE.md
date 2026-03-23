# 📚 Book Library – QA Automation Framework

## 🚀 Overview

This project is a **comprehensive QA Automation Framework** built for a Book Library application. It combines:

* ✅ **End-to-End Testing** using Playwright
* ✅ **API + UI Validation**
* ✅ **Schema Validation**
* ✅ **Custom Fixtures (Page Object Model)**
* ✅ **Responsive Testing (Real Devices)**
* ✅ **Unit Testing (Vitest)**

The framework is designed to be **scalable, maintainable, and production-ready**.

---

## 🧰 Tech Stack

* **Playwright** – E2E Testing
* **TypeScript** – Strong typing
* **Vitest** – Unit testing
* **Schema** – JSON schema validation
* **Page Object Model (POM)** – Clean test structure

---

## 🏗️ Architecture

```
tests/
│
├── api/ # 🔌 API E2E Tests
│ ├── tests/
│ │ ├── api.happy.spec.ts # ✅ Positive API scenarios
│ │ └── api.negative.spec.ts # ❌ Negative API scenarios
│ │
│ └── utils/
│ ├── api-client.ts # 🌐 API request wrapper (GET, POST, etc.)
│ ├── endpoints.ts # 🔗 API endpoints/constants
│ └── schema.validator.ts # 📊 Response schema validation
│
├── ui/ # 🖥️ UI E2E Tests
│ ├── pages/ # 📄 Page Object Models (POM)
│ │ ├── DashboardPage.ts
│ │ ├── AddBookPage.ts
│ │ └── BookDetailsPage.ts
│ │
│ ├── tests/
│ │ └── book.e2e.spec.ts # 🔁 End-to-End UI + API flows
│ │
│ └── utils/
│ ├── apiHelper.ts # 🔄 UI + API validation helper
│ └── testData.ts # 🧪 Test data management
│
├── playwright.config.ts # ⚙️ Playwright configuration
├── package.json # 📦 Project dependencies & scripts
└── README.md # 📘 Project documentation
```

---

## 🧠 Framework Design

# Separation of Concerns
    * UI and API layers are independently structured
# Page Object Model (POM)
    * Encapsulates UI interactions
# Reusable Utilities
    * API client for requests
    * Schema validation for responses
    * Centralized test data
# Scalable Structure
    * Easy to extend for new features/tests

---

## ⚙️ Setup & Installation

### Install dependencies

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install
```

---
## ▶️ Running Tests

### Run all tests

```bash
npx playwright test
```

---

### Run UI tests

```bash
npm run test:ui:e2e
```
### Run API tests

```bash
npm run test:api:e2e
```
### Run smoke tests

```bash
npm run test:smoke
```
---

### 5️⃣ Run unit tests (Vitest)

```bash
npm run test
```

---

## 🧪 Test Coverage

### ✅ Functional Testing

* Add Book → Validate UI + API → View Details
* Form validation (empty fields, invalid inputs)
* Boundary validations (rating, published year)

---

### 🔗 API + UI Testing

* Create book (positive flow)
* Validate response using schema
* Negative scenarios (invalid payloads, errors)

---

### 📱 Responsive Testing

* Mobile (iPhone, Pixel)
* Tablet (iPad)
* Desktop

---

### 🏷️ Test Tagging Strategy

Tag	    |   Purpose
@smoke	|   Critical user flows
@sanity	|   Feature-level validation
@regression |	Full test suite

```ts
Example:

test('@ui @smoke Add Book flow', async () => {});
test('@api @regression Create Book API', async () => {});
```

---

### 🧠 Unit Testing (Vitest)

* Data builders (`bookBuilder`)
* Validation helpers
* Logger utility
* Schema validation

---

## 🧠 Key Design Decisions

* Avoided browser-dependent validation messages
* Used HTML5 validity API for stable form validation
* Implemented API + UI validation together for true E2E coverage

---

### 🔹 Custom Fixtures

Reusable test setup:

```ts
test('example', async ({ homePage, addBookPage }) => {
  await homePage.goToAddBook();
});
```

---

### 🔹 Cross-Browser Validation Handling

Different browsers return different validation messages:

* Chrome → *"Value must be greater than..."*
* Safari → *"range underflow"*

Handled using flexible matching:

```ts
expect(message.toLowerCase()).toMatch(/greater|underflow/);
```

---

### 🔹 Smart Waiting Strategy

Avoids flaky tests by waiting for UI state:

```ts
await expect(page).toHaveURL(/\/book\/\d+/);
await expect(locator).toBeVisible();
```
---

## 🔥 Advanced Features

* ✅ UI + API combined validation
* ✅ Network interception for API verification
* ✅ Schema validation for responses
* ✅ Reusable utilities for maintainability
* ✅ Tag-based execution strategy
* ✅ Cross-browser validation handling

---

## ⚠️ Common Challenges Handled

| Challenge                | Solution                |
| ------------------------ | ----------------------- |
| Slow navigation          | Wait for URL + UI       |
| Cross-browser validation | Flexible matching       |
| Dynamic data             | Data builders           |
| Flaky tests              | Smart waits             |
| Duplicate locators       | Strict locator strategy |

---

## 👩‍💻 Author

**Aravind Reddy K**

---

## ⭐ Final Note

This framework is designed not just to test functionality, but to ensure:

> ✅ Reliability
> ✅ Maintainability
> ✅ Real-world test coverage
