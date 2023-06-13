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
    required: false,
  },
  coverImage: {
    filename: String,
    url: String,
    publicId: String,
    required: false,
  },
  gender: {
    type: String,
    enum: [GENDER_MALE, GENDER_FEMALE, GENDER_SECRET],
    required: false,
    default: GENDER_SECRET,
  },
  online: {
    type: Boolean,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  isBlocked: {
    type: Boolean,
    required: false,
    default: false,
  },
  uuid: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    required: false,
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
    required: false,
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
  skin: {
    type: {
      type: String,
      required: false,
      default: "Da thường"
    },
    obstacle: {
      isSensitive: {
        type: Boolean,
        required: false,
        default: false
      },
      hasAcne: {
        type: Boolean,
        required: false,
        default: false
      }
    }
  },
  point: {
    type: Number,
    required: false,
    default: 0
  },
  level: {
    type: Number,
    required: false,
    default: 1
  }
});

accountSchema.index({ name: "text" });
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