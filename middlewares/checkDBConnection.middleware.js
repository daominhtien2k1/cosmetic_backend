const {status} = require('../config/MongoDB');
const {response} = require('../constants/response_code');

module.exports = (req, resp, next) => {
    if(status.connected) return next();
    response(resp, 1001);
}