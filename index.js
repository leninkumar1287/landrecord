const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const expressEndpoints = require("express-list-endpoints");
const path = require("path");
const logger = require("./src/logger/logger");
const morgan = require("morgan");
const { config } = require("./configuration/config");
const application = express();
const router = require("./src/router/index");


application.use(cors());
application.use(morgan("common"));
application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(express.static(path.join(__dirname, "public")));
application.use(express.static(path.join(__dirname, "uploads")));

const db = async () => {
    try {
        const connectionString = `${config.db}${config.dbConnection}${config.database}`;
        console.log("Connecting to MongoDB:", connectionString);
        
        // const response = await mongoose.connect(connectionString);
        const databaseResponseMessage = "Database connected successfully";
        console.log(databaseResponseMessage);
        logger.success(databaseResponseMessage);
        
        // Start the server after database connection
        const server = application.listen(config.port, () => {
            const address = server.address();
            const serverResponseMessage = `Server is running on ${address.address}:${address.port}`;
            const ipFamily = address.family === address.family ? 'IPv6' : 'IPv4';
            logger.success(serverResponseMessage);
            console.log(serverResponseMessage);
            console.log(`The :: means it's listening on all available network interfaces ${ipFamily}`);
        });
        
    } catch (error) { 
        const databaseConnectionErrorMessage = `Database connection error: ${error.message}`;
        console.log(databaseConnectionErrorMessage);
        logger.error(databaseConnectionErrorMessage);
    }
}
db();

application.get("/", (request, response) => {
    response.sendFile(path.join(__dirname + "/src/welcomePage", "welcome_page.html"));
});



application.get("/api/v1/endpoints", (request, response) => {
    const endpoints = expressEndpoints(application);
    logger.success('All Endpoints fetched successfully');
    logger.ack(console.table(endpoints));
    response.json(endpoints);
});

application.use('/api/v1', (req, res, next) => {
    next()
}, router);

process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception: ", error);
    process.exit(1);
});

process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection: ", error);
    process.exit(1);
});