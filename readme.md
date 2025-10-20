🏡 Housify - Your Next Home Awaits
---
📖 Introduction
---
Housify is a full-stack web application designed to be a modern, user-friendly platform for discovering, listing, and booking rental properties. Inspired by platforms like Airbnb, Housify provides a seamless experience for both property owners looking to list their spaces and users searching for their next getaway or temporary home.

The application is built with a classic MVC (Model-View-Controller) architecture, ensuring a clean separation of concerns and making the codebase scalable and easy to maintain.
---
✨ Key Features
---
👤 User Authentication: Secure user registration and login system with session management.

🏡 Property Listings: Users can browse a wide variety of property listings with detailed descriptions and images.

➕ Create & Manage Listings: Authenticated users can create, edit, and manage their own property listings through a dedicated dashboard.

🖼️ Image Uploads: Seamlessly upload multiple images for property listings to attract potential renters.

📅 Booking System: A simple and effective system for users to book available properties.

⭐ Reviews & Ratings: Users can leave reviews and ratings for properties they've stayed at, building a trustworthy community.

👤 User Profiles: A dedicated profile page for users to manage their information and view their booking history.

🎨 EJS Templating: Dynamic server-side rendering of views using EJS for a fast and interactive user experience.
---
🛠️ Tech Stack & Tools
---
This project is built with a robust and widely-used set of technologies:
---
Backend:
---
Node.js: A JavaScript runtime for the server.

Express.js: A web application framework for Node.js.
---
Frontend / View Engine:
---
EJS (Embedded JavaScript): A simple templating language that lets you generate HTML markup with plain JavaScript.

Styling:

CSS: For custom styling of the application.

Possibly Tailwind CSS for utility-first styling.

Database:

Likely a SQL (e.g., MySQL, PostgreSQL) or NoSQL (e.g., MongoDB) database for data persistence.

File Handling:

Multer: Middleware for handling multipart/form-data, used for file uploads.
---
##📂 Repository Structure

The project follows a classic MVC (Model-View-Controller) architecture for clear separation of concerns.

```
├── config/
│   └── database.js         # Database connection and configuration
│
├── controllers/
│   ├── authController.js     # Logic for user registration, login, logout
│   ├── listingController.js  # Logic for creating, viewing, updating listings
│   ├── bookingController.js  # Logic for handling property bookings
│   └── userController.js     # Logic for user profile management
│
├── middleware/
│   ├── authMiddleware.js     # Protects routes, checks if user is logged in
│   └── uploadMiddleware.js   # Handles file uploads using Multer
│
├── models/
│   ├── User.js               # User schema/model
│   ├── Listing.js            # Listing/Property schema/model
│   ├── Booking.js            # Booking schema/model
│   └── Review.js             # Review schema/model
│
├── public/
│   ├── css/
│   │   └── styles.css        # Main stylesheet
│   ├── images/               # Static images and assets
│   └── js/
│       └── main.js           # Client-side JavaScript
│
├── routes/
│   ├── authRoutes.js         # Routes for /register, /login, etc.
│   ├── listingRoutes.js      # Routes for /listings, /listings/:id, etc.
│   └── userRoutes.js         # Routes for user-specific pages like /profile
│
├── views/
│   ├── partials/
│   │   ├── header.ejs        # Reusable header component
│   │   └── footer.ejs        # Reusable footer component
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── listings/
│   │   ├── index.ejs         # Show all listings
│   │   ├── show.ejs          # Show a single listing
│   │   └── new.ejs           # Form to create a new listing
│   └── index.ejs             # Homepage
│
├── .env.example              # Example environment variables
├── .gitignore                # Specifies intentionally untracked files
├── index.js                  # Main application entry point
├── package.json              # Project metadata and dependencies
└── README.md

```
![GSSoC Logo](https://github.com/dimpal-yadav/Foodie/blob/main/images/GSSoC.png)

🌟 **Exciting News...**

🚀 This project is now an official part of GirlScript Summer of Code – GSSoC'25! 💻 We're thrilled to welcome contributors from all over India and beyond to collaborate, build, and grow *Housify* Let’s make learning and career development smarter – together! 🌟

GSSoC is one of India’s **largest 3-month-long open-source programs** that encourages developers of all levels to contribute to real-world projects while learning, collaborating, and growing together.

🌈 With **mentorship, community support**, and **collaborative coding**, it's the perfect platform for developers to:

- ✨ Improve their skills
- 🤝 Contribute to impactful projects
- 🏆 Get recognized for their work
- 📜 Receive certificates and swag!

🎉 **I can’t wait to welcome new contributors** from GSSoC 2025 to this Housify project family! Let's build, learn, and grow together — one commit at a time. 

---

🚀 Getting Started
---
To get a local copy up and running, please follow these simple steps.
---
*Prerequisites
---
-Node.js (v18.x or higher)

-npm or yarn

-A configured database (e.g., MySQL, MongoDB)

---
*Installation & Setup
---
##Clone the repository:

-git clone [https://github.com/Naveenkumar30838/Housify.git]

-cd housify

---
Install Dependencies:
---

npm install

---


Configure Environment Variables:
---
Rename .env.example to .env.

Update the .env file with your database credentials and other necessary secrets.

---
Initialize the Database:
---
Run any necessary database migration or seeding scripts (e.g., DataInsertionQueries.js).

Run the Application:

npm start

---


The application should now be running on http://localhost:3000 (or the port specified in your config).

---
