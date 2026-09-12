# ⭐ Store Rating Platform

A full-stack web application for managing stores, users, and ratings with **role-based access control**.

The platform provides different functionalities for **Administrators, Normal Users, and Store Owners**, including store management, user management, ratings, dashboards, search, filtering, and sorting.

---

## 🚀 Features

### 👨‍💼 Administrator

* 📊 Dashboard with total Users, Stores & Ratings
* ➕ Add Users, Admins & Stores
* 👥 View and manage users
* 🏪 View and manage stores
* 🔍 Search & filter records
* ↕️ Sort records in ascending/descending order
* 📋 View complete user and store details
* 🔐 Change password & Logout

### 👤 Normal User

* 📝 Signup & Login
* 🏪 View all stores
* 🔎 Search stores by Name & Address
* ⭐ Submit ratings from **1–5**
* ✏️ Modify submitted ratings
* 📊 View overall store rating
* 🔐 Change password & Logout

### 🏪 Store Owner

* 🔑 Login
* 📊 Store rating dashboard
* 👥 View users who submitted ratings
* ⭐ View received ratings
* 📈 View average store rating
* 🔐 Change password & Logout

---

## ✅ Validation

| Field        | Validation                        |
| ------------ | --------------------------------- |
| 👤 Name      | 20–60 characters                  |
| 📍 Address   | Maximum 400 characters            |
| 🔑 Password  | 8–16 characters                   |
| 🛡️ Password | 1 uppercase + 1 special character |
| 📧 Email     | Standard email validation         |
| ⭐ Rating     | 1–5 only                          |

---

## 🛠️ Tech Stack

* 🎨 **Frontend:** React.js
* ⚙️ **Backend:** Node.js, Express.js
* 🗄️ **Database:** MySQL
* 🔐 **Authentication:** JWT, bcrypt
* 🔗 **API:** REST API
* 🧰 **Tools:** Git, GitHub, Postman

---

## 🗃️ Database

The application uses three main entities:

```text
👤 Users
   │
   ├── ⭐ Ratings ──── 🏪 Stores
   │
   └── 🏪 Store Owner
```

### Main Tables

* **Users** — user details, credentials and roles
* **Stores** — store details and owner information
* **Ratings** — ratings submitted by users

Each user can submit **one rating per store** and can update the rating later.

---

## 🔐 Role-Based Access

```text
                    🔑 Login
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       👨‍💼 ADMIN     👤 USER    🏪 OWNER
          │            │            │
          ▼            ▼            ▼
      Dashboard    Store List    Dashboard
      Users         Search        Ratings
      Stores        Rating        Average
      Ratings       Update        Users
```

---

## 🔎 Search • Filter • Sort

* 🔍 Search stores by **Name & Address**
* 🔎 Filter users/stores by relevant fields
* ↕️ Ascending & descending sorting
* 📊 View store rating information

---

## ⚙️ Setup

### Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd store-rating-platform
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Configure the MySQL database and environment variables in the backend `.env` file.

---

## 🧪 Testing

The application can be tested for:

* ✅ Authentication & authorization
* ✅ Role-based access
* ✅ User signup/login
* ✅ Store management
* ✅ Rating submission & modification
* ✅ Average rating calculation
* ✅ Search, filtering & sorting
* ✅ Form validation
* ✅ Password change
* ✅ Logout

---

## 👩‍💻 Author

**Saloni Sawant**

🔗 GitHub: https://github.com/Salonisawant7

---
⭐ **Store Rating Platform**
