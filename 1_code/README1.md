# Library Management System	
Authors: Monica Galvez, Dalton Burge, and William Applegate
School: Indiana University
Course: INFO-C451
 Instructor: Jafrina Jabin
## Description
The Library management system is a Node.js Express MVC web application intended to increase efficiency of library check out processes and improve tracking of active loans. The application persists data via Maria DB.

Node.js Express is a lightweight web framework that uses JavaScript. 

MVC, or Model View Controller, is a web architecture. The application routes requests to their corresponding controller, which then handles the request, populates data into  a model, and dynamically creates files using the EJS html builder. 
## Folder structure
#### Node Modules
- Directory is created automatically when installing project dependencies (npm install). We will not directly work in this directory. 
#### Public
- Used to store the application's static assets/content. This is where CSS, JavaScript, images, and any other static assets would be stored. 
#### Scripts
- Stored SQL scripts that create the database solution. The scripts folder isn't directly used by the node.js app, rather it's just a place to store scripts so we can quickly copy and paste into a database query.
#### SRC
- Stores all the node.js code for the web application, which includes JavaScript files and .EJS files. We will actively work in this directory. It includes a config folder which contains database and security set up. The data folder contains the files responsible for calling the database. The routers folder contains the controller methods used to respond to requests. The views folder stores the .EJS files that are used to dynamically create and deliver html pages to the user. 
#### .env file
- Used to store secrets or settings used to run the application. These settings may differ depending on where the environment is being run. This file should be private and not shared in version control, however I have left it to speed up setup.
#### .gitignore 
- Special git file used to ignore certain files in version control. Files matching .gitignore will not be tracked in source control.
#### app.js
- The starting file for our application. This is the file that starts everything.
#### package-lock.json
- Handles details with the Node Modules directory. Leaving it alone.
#### package.json
- Contains details and instructions for starting up the application. Also defines the dependencies used in the application.
## Setup guide

#### Intall Node JS / node package manager (npm)
#### Install git
#### Install preferred IDE (VS Code for example)
#### clone github repository into a local environment
#### open the application in an IDE or in a terminal
- In the terminal, run the command: npm install
- This will install the dependencies listed in the package.json file.
#### Install MariaDB or MySQL
- Either or will work. MySQL may be easier to set up on MacOS.
- Make sure to keep track of your database port number, database username, and password. 
- Open up Heidi SQL (or MySQL Workbench)
- Connect to the database, open a query window, and run the script found in the github solution's script folder. 
- Update the project's .env file to match database setup (DB_HOST, DB_NAME, DB_PORT, DB_USER, and DB_PASS)
#### Run application
- In the application, run the command: npm run debug
- While the application is running, open a browser and go to localhost:4000 (or the port you specified in .env), and verify you see a default login page.
