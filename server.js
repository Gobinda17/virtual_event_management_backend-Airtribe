require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT;

app.listen(PORT, (error) => {
    if(error) {
        return console.error("❌ Something went wrong!!!", error)
    }
    console.log(`✅ Server is listening in ${PORT}`);
});

