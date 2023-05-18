const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: false
    },
    clicks: {
        type: Number,
        required: false,
        default: 0
    },
});

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: String,
        url: String,
        publicId: String
    },
    // số lượng sản phẩm trong cửa hàng
    products: {
        type: Number,
        required: false,
        default: 0
    },
    followers: {
        type: Number,
        required: false,
        default: 0
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    },
});

const categorySchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    parentCategory: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    guarantee: {
        type: Number,
        required: true
    },
    expiredYear: {
        type: Number,
        required: true
    },
    // html
    description: {
        type: String,
        required: true
    },
    category_id: {type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true},
    brand_id: {type: mongoose.Schema.Types.ObjectId, ref: 'brands', required: true},
    images: [{filename: String, url: String, publicId: String}],
    price: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        required: false,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    sold: {
        type: Number,
        require: false,
        default: 0
    },
    // sản phẩm còn bán hay không thôi, ít tác dụng
    available: {
        type: Boolean,
        required: false,
        default: true
    },
    // availableInStoreList: [{type: mongoose.Schema.Types.ObjectId, ref: 'stores'}],
    type: {
        type: String,
        enum: ['Featured', 'Upcoming', 'New', 'Normal'],
        required: false
    },
    // số lượng yêu thích sản phẩm (tổng nhiều người) --> Tạo thêm Schema LoveProductUser lưu giữ refer của product và userid
    loves: {
        type: Number,
        required: false,
        default: 0
    },
    // số lượng đánh giá
    reviews: {
        type: Number,
        required: false,
        default: 0
    },
    // trung bình rate sản phẩm
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    // top 10 review gần đây // hãy dùng cronJob - Dùng CronJob để tự động tính reviews - rating - recentReviewList - highestStarReviewList, bây giờ UI get ra 4 cái này chỉ dùng mỗi model Review thôi, sau này thì sửa lại get trực tiếp
    recentReviewList: [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
    // top 10 review có đánh giá cao nhất
    highestStarReviewList: [{type: mongoose.Schema.Types.ObjectId, ref: 'reviews'}],
    gender: [ {type: String, enum: ['Nam', 'Nữ', 'Other']} ],
    skin: [{type: String}],
    // các tag khác dành cho lọc
    tag: [{type: String}],
    relateProductList: [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}],

});

const couponSchema = new mongoose.Schema({
    coupon_code: {
        type: String,
        required: true
    },
    coupon_type: {
        type: String,
        enum: ['Percent', 'Fixed amount']
    },
    coupon_value: {
        required: true,
        type: Number
    },
    couponStartDate: {
        required: true,
        type: Date
    },
    couponEndDate: {
        required: true,
        type: Date
    },
    // Số tiền tối thiểu để sử dụng coupon
    couponMinSpend: {
        type: Number,
        required: true,
        default: 0
    },
    // Số tiền tối đa được giảm giá khi sử dụng coupon
    couponMaxSpend: {
        type: Number,
        required: true
    },
    coupon_uses_per_customer: {
        type: Number,
        required: true,
        default: 1
    },
    // Số lần sử dụng coupon tối đa cho chính coupon đó
    couponUsesPerCoupon: {
        type: Number,
        required: true
    },
    couponStatus: {
        type: String,
        enum: ['Active', 'Expired', 'Disabled']
    },
    // mặc định false có thể là toàn cửa hàng
    brand_id: {type: mongoose.Schema.Types.ObjectId, ref: 'brands', required: false}
});

// 1 Product có nhiều Review (lúc này bắt chước Product - Comment) , 1 Review có nhiều Reply (lúc này bắt chước Product - Comment)
const reviewSchema = new mongoose.Schema({
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'products'},
    userReview_id: {type: mongoose.Schema.Types.ObjectId, ref: 'accounts'},
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    // tương tự described
    content: {
        type: String,
        required: true
    },
    images: [{filename: String, url: String, publicId: String}],
    video: {filename: String, url: String, publicId: String},
    // tương tự likedAccounts
    settedUsefulAccounts: [{type: mongoose.Schema.Types.ObjectId, ref: 'accounts'}],
    // tương tự commentList
    replyList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'replies'
    }],
    // số lượt hữu ích - tương tự likes
    usefuls: {
        type: Number,
        required: false,
        default: 0
    },
    // số lượt reply - tương tự comments
    replies: {
        type: Number,
        required: false,
        default: 0
    },
    // không có status

    // tương tự canComment
    canReply: {
        type: Boolean,
        required: true,
        default: true
    },
    banned: {
        type: Boolean,
        required: true,
        default: false
    },
    reports_review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reports'
    }]
});

reviewSchema.set('timestamps', true);

const Review = mongoose.model('Review', reviewSchema);

const Coupon = mongoose.model('Coupon', couponSchema);

const Category = mongoose.model('Category', categorySchema);

const Brand = mongoose.model('Brand', brandSchema);

const Product = mongoose.model('Product', productSchema);

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = {
    Carousel,
    Brand,
    Category,
    Product,
    Review
}