const mongoose = require("mongoose");
const { GENDER_SECRET } = require("../constants/constants");
const { GENDER_FEMALE } = require("../constants/constants");
const { GENDER_MALE } = require("../constants/constants");

// thống nhất, tất cả các trường chuyển sang tiếng việt
const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "Người dùng",
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    max: 255,
    min: 6,
    required: true,
  },
  avatar: {
    filename: {type: String, default: 'default_avatar.png'},
    url: {type: String, default: 'https://res.cloudinary.com/dnway4ykc/image/upload/v1688633857/datn/images/default_avatar_s559gq.png'},
    publicId: {type: String, default: 'default_avatar'},
    required: false,
  },
  coverImage: {
    filename: {type: String, default: 'cover_image.png'},
    url: {type: String, default: 'https://res.cloudinary.com/dnway4ykc/image/upload/v1688633966/datn/images/cover_image_gjdtlm.png'},
    publicId: {type: String, default: 'cover_image'},
    required: false,
  },
  gender: {
    type: String,
    enum: [GENDER_MALE, GENDER_FEMALE, GENDER_SECRET],  // chuyển sang tiếng việt, nhưng biến lưu giữ là tiếng anh
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
    default: 'Hiện chưa có mô tả nào'
  },
  link: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
    default: 'Hà Nội'
  },
  country: {
    type: String,
    required: false,
    default: 'Việt Nam'
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
  },
  isBrand: {
    type: Boolean,
    required: false,
    default: false
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
    required: false,
  }
});

accountSchema.index({ name: "text" });
accountSchema.set("timestamps", true);

// Do not declare methods using ES6 arrow functions (=>). Arrow functions explicitly prevent binding this, so your method will not have access to the document ...
accountSchema.methods.getDefaultAvatar = function () {
  return "https://res.cloudinary.com/dnway4ykc/image/upload/v1688633857/datn/images/default_avatar_s559gq.png";
};
accountSchema.methods.getAvatar = function () {
  // console.log(this.avatar);
  if (!this.avatar)
    return "https://res.cloudinary.com/dnway4ykc/image/upload/v1688633857/datn/images/default_avatar_s559gq.png";
  return this.avatar.url;
};


const Account = mongoose.model("Account", accountSchema);

module.exports = Account;