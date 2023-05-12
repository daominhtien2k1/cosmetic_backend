const dotenv = require("dotenv");
dotenv.config();

const GENDER_MALE = 'Male';
const GENDER_FEMALE = 'Female';
const GENDER_SECRET = 'Secret';

const PRIVATE_CHAT = 'PRIVATE_CHAT';
const GROUP_CHAT = 'GROUP_CHAT';

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

module.exports = {
    GENDER_MALE,
    GENDER_FEMALE,
    GENDER_SECRET,
    JWT_SECRET,
    MONGO_URI,
    PORT,
    PRIVATE_CHAT,
    GROUP_CHAT
}

