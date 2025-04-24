Data Insertion Queries contains the Queries that will insert Data in bulk in the database , just call these three functions to insert : 
callinserUser
callinserListing
callinserBooking

and the Data Will Be Automatically inserted in the database , these function will automatically connect and remove the connection to the database and run required queries to insert data in the database 

<!-- Dont forget to set the Sql Database password in the .env file SQLPASSWORD -->

Run the schema.sql file to create the schema of the database , then run the Server file : the server file calls a check function to check if the USer , Listing and bookings table in the database are empty if they are then it automatically calls the functions in defined in the DataInsertionQueries file to insert USER LISTING BOOKING Table's data ....