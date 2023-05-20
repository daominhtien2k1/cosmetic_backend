const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const cron = require('node-cron');

const mainRouter = require("./routes/routes");
const {PORT} = require("./constants/constants");

const app = express();
const connectDatabase = require("./config/MongoDB");
const {Product, Review} = require("./models/product.model");
connectDatabase();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // raw - json chạy được
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing x-www-form-urlencoded

app.get('/settings', function (req, res) {
    res.send('Settings Page');
});
app.post('/settings', function (req,res) {
    const { value } = req.body;
    res.json({value: value});
})
app.use("/", mainRouter);

// cron.schedule('*/2 * * * *', async () => {
//     try {
//         const products = await Product.find();
//
//         for (const product of products) {
//             const productId = product._id;
//
//             const recentReviews = await Review.find({ product_id: productId })
//                 .sort("-createdAt")
//                 .limit(2);
//
//             const reviewIds = recentReviews.map(review => review._id);
//
//             product.recentReviewList = reviewIds;
//
//             await product.save();
//         }
//
//         console.log("Cron job thành công");
//     } catch (err) {
//         console.error("Lỗi trong quá trình thực hiện cron job:", err);
//     }
// });

// cron.schedule('*/2 * * * *', async () => {
//     try {
//         const products = await Product.find();
//
//         for (const product of products) {
//             const productId = product._id;
//
//             const highestStarReviews = await Review.find({ product_id: productId })
//                 .sort({ rating: -1 })
//                 .limit(2);
//
//             const reviewIds = highestStarReviews.map(review => review._id);
//
//             product.highestStarReviewList = reviewIds;
//
//             await product.save();
//         }
//
//         console.log("Cron job thành công");
//     } catch (err) {
//         console.error("Lỗi trong quá trình thực hiện cron job:", err);
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

