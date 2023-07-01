const dotenv = require("dotenv");
dotenv.config();

const GENDER_MALE = 'Nam';
const GENDER_FEMALE = 'Nữ';
const GENDER_SECRET = 'Bí mật';

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

