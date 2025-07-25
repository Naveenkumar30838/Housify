# 🏠 Housify

Housify is a modern, responsive web application designed to showcase property listings and connect buyers with agents in a sleek, user-friendly interface.


## 🚀 Features

- 🔍 Search and filter properties by type, location, price, etc.
- 🖼 View detailed property pages with image galleries
- 🧭 Interactive map integration
- 📱 Fully responsive design for all devices
- 💬 Contact agents directly via forms

---

## 🛠 Tech Stack

- *Frontend:* HTML, CSS, JavaScript (or React if applicable)
- *Backend:* Node.js / Express (if applicable)
- *API Integration:* Google Maps API / Property API
- *Design:* Figma / Canva mockups

---

📬 Contact
For suggestions, contributions or feedback, feel free to reach out or open an issue.

⭐ Contributing
Fork the repo 🍴

  Create your feature branch (git checkout -b feature-name)

  Commit your changes (git commit -m 'Add some feature')

  Push to the branch (git push origin feature-name)

  Open a Pull Request


<!-- Data Insertion Queries contains the Queries that will insert Data in bulk in the database , just call these three functions to insert : 
callinserUser
callinserListing
callinserBooking

and the Data Will Be Automatically inserted in the database , these function will automatically connect and remove the connection to the database and run required queries to insert data in the database 
-->
<!-- Dont forget to set the Sql Database password in the .env file SQLPASSWORD -->
<!--
Run the schema.sql file to create the schema of the database , then run the Server file : the server file calls a check function to check if the USer , Listing and bookings table in the database are empty if they are then it automatically calls the functions in defined in the DataInsertionQueries file to insert USER LISTING BOOKING Table's data ....
-->
