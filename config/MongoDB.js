const mongoose = require("mongoose");
const {MONGO_URI} = require("../constants/constants");

const status = {connected: false};

const connectDatabase = async () => {
    try {
        // MongoDB Roles: atlasAdmin@admin
        // trong url có phần tên database mongodb.net:27017/facebookgroup7?
        const connection = await mongoose.connect(MONGO_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        status.connected = true;
        console.log("Mongo connected");
    }catch (error){
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports.status = status;
module.exports = connectDatabase;