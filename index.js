const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

const mainRouter = require("./routes/routes");
const {PORT} = require("./constants/constants");

const app = express();
const connectDatabase = require("./config/MongoDB");
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

