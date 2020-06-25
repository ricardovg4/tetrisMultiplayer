function randomString(length, chars) {
    let valueHolder = '';
    if (chars.indexOf('a') > -1) valueHolder += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) valueHolder += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) valueHolder += '0123456789';
    if (chars.indexOf('!') > -1) valueHolder += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';

    let result = '';
    for (let i = length; i > 0; --i) {
        result += valueHolder[Math.floor(Math.random() * valueHolder.length)];
    }
    return result;
}

module.exports = {
    randomString
};
