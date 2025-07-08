require("dotenv").config();

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const app = require("./app");
const PORT = process.env.PORT;


(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        app.listen(PORT, (error) => {
            if (error) {
                return console.error("❌ Something went wrong!!!", error)
            }
            console.log(`✅ Server is listening in ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
    }
})();
