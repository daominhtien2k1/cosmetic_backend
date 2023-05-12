function isValidName(username){
    // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
    var regexp = /^((?![0-9\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\;\:\"\\\/\<\>\?]).)+$/;

    return regexp.test(username);
}

function isValidPassword(password){
    // được phép là chữ, số, gạch dưới, độ dài từ 6 -> 30 kí tự
    const regChar = /^[\w_]{6,30}$/;
    const regPhone = /^0\d{9}$/;
    if(!regChar.test(password)){
        return false;
    }
    if(regPhone.test(password)){
        return false;
    }
    return true;
}

function isNumber(num){
    const regNum = /^\d+$/;
    return regNum.test(num);
}
// function isNumber(num){
//     const regNum = /^-?\d+$/;
//     return regNum.test(num);
// }

function isValidId(id){
    const regId = /^[0-9a-fA-F]{24}$/;
    return regId.test(id);
}

function isPhoneNumber(number){
    const regPhone = /^0\d{9}$/;
    return regPhone.test(number);
}

function isValidCoordinates(latitude, longitude) {
    const floatNumReg = /^-?\d+(\.\d+)?$/;
    if(!floatNumReg.test(latitude) || !floatNumReg.test(longitude)) return false;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if(lat < -90 || lat > 90) return false;
    if(lng < -180 || lng > 180) return false;
    return true;
}

// check link
function checkLink (link) {
    let banLink = ['bilutv.com', 'hayhaytv.com', 'hdviet.com', 'phimmoi.net', 'hdonline.vn', 'phimbathu.com', 'vnhackers.com'];
    let result = banLink.filter(e => link.includes(e));
    if (result.length > 0) return false;
    else return true;
}

function isGender(gender) {
    return ["Male", "Female", "Secret"].includes(gender);
}

module.exports = {
    isValidName,
    isValidPassword,
    isPhoneNumber,
    isValidId,
    isNumber,
    isValidCoordinates,
    checkLink,
    isGender
}



