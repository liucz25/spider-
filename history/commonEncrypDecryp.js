var keyStr = CryptoJS.enc.Latin1.parse("4590auf34567hilm2390noqrst890uyz");
// console.log(keyStr)

/**
 * 加密数据
 * 
 * @param {type}
 *            data 待加密的字符串
 * @param {type}
 *            keyStr 秘钥
 * @param {type}
 *            ivStr 向量
 * @returns {unresolved} 加密后的数据
 */
var aesEncrypt = function(data) {
    var sendData = CryptoJS.enc.Utf8.parse(data);
    // console.log(sendData)
    var encrypted = CryptoJS.AES.encrypt(sendData, keyStr, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted;
};