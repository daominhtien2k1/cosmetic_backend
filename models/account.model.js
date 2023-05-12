const mongoose = require("mongoose");
const { GENDER_SECRET } = require("../constants/constants");
const { GENDER_FEMALE } = require("../constants/constants");
const { GENDER_MALE } = require("../constants/constants");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "UserName",
  },
  password: {
    type: String,
    max: 255,
    min: 6,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: {
    filename: String,
    url: String,
    publicId: String,
    require: false,
  },
  coverImage: {
    filename: String,
    url: String,
    publicId: String,
    require: false,
  },
  gender: {
    type: String,
    enum: [GENDER_MALE, GENDER_FEMALE, GENDER_SECRET],
    required: false,
    default: GENDER_SECRET,
  },
  online: {
    type: Boolean,
    require: false,
  },
  token: {
    type: String,
    require: false,
  },
  isBlocked: {
    type: Boolean,
    require: false,
    default: false,
  },
  uuid: {
    type: String,
    require: false,
  },
  active: {
    type: Boolean,
    require: false,
    default: false,
  },
  description: {
    type: String,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  coordinates: {
    latitude: String,
    longitude: String,
    require: false,
  },
  blockedAccounts: [
    {
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  friends: [
    {
      friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  friendRequestReceived: [
    {
      fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  friendRequestSent: [
    {
      toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

accountSchema.index({ phoneNumber: "text" });
accountSchema.set("timestamps", true);

// Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this, so your method will not have access to the document ...
accountSchema.methods.getDefaultAvatar = function () {
  return "https://res.cloudinary.com/it4895/image/upload/v1607791757/it4895/avatars/default-avatar_jklwc7.jpg";
};
accountSchema.methods.getAvatar = function () {
  // console.log(this.avatar);
  if (!this.avatar)
    return "https://res.cloudinary.com/it4895/image/upload/v1607791757/it4895/avatars/default-avatar_jklwc7.jpg";
  return this.avatar.url;
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;