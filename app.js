const express = require("express");
const app = express();

const router = require("./routes/userRoutes");
const eventRouter = require('./routes/eventRoutes');

app.use(express.json());

app.use("/event-management/api/v1", router);
app.use("/event-management/api/v1/service", eventRouter);

module.exports = app;