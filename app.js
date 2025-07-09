const express = require("express");
const app = express();

const router = require("./routes/userRoutes");

app.use(express.json());

app.use("/event-management/api/v1", router);

module.exports = app;