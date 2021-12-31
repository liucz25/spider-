// var CryptoJS = require('./zaes');
// var CryptoJS = require("zaes-js");
// console.log(CryptoJS.HmacSHA1("Message", "Key"));
var CryptoJS = require('crypto-js');


var keyStr = CryptoJS.enc.Latin1.parse("4590auf34567hilm2390noqrst890uyz");
// console.log(keyStr);

var g_encrypt = 1; //0=接口不加密 1=接口加密
function toData(json) {

    // console.log("json:    " + json);
    var data = JSON.stringify(json);

    // console.log("beforedata:    " + data);
    if (g_encrypt == 0) {
        return "data=" + data;
    } else {
        // console.log("8888:    " + data);
        _data = aesEncrypt(data);
        // console.log("afterdata:    " + _data);
        return "data=" + _data;
    }
}

var aesEncrypt = function(data) {
    // console.log("data:    " + data);
    var sendData = CryptoJS.enc.Utf8.parse(data);
    // console.log("senddata:    " + sendData)
    var encrypted = CryptoJS.AES.encrypt(sendData, keyStr, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted;
};

var aesDecrypt = function(data) {
    // var sendData = CryptoJS.enc.Utf8.parse(data);
    // console.log(sendData)
    var encrypted = CryptoJS.AES.decrypt(data, keyStr, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted;
};
var json = { "method ": "getVideoById_v45 ", "userid ": 0, "token ": "", "params ": { "id ": 3 }, "identity": null };
// data_aes = aesEncrypt(data);
// var json2 = { words: [], sigBytes: 0 }

data_aes = toData(json);
// console.log("miwem:     " + data_aes);

//反向流程，还原密文


// mima = "uEFrG2GhYK3wy4iGu5FsPUK6gofOd0uo3RE3GCy2AIrrqnxxFkxEwMSdLSLbTgIFInKlecyCZbTIdkhBl6sen44Q1/LlONeE7P/q2rRcNitWTItkaaLPZGVAqys0SsGe";
// mingwen = aesDecrypt(mima);
// wenzi = CryptoJS.enc.Utf8.stringify(mingwen)
// mi = aesEncrypt(mingwen);

// console.log("_________________________________________________________________________");

// // C:\Users\liuch\Desktop\wkt
// // λ node my.js
// // data:    7b226d6574686f64223a22676574566964656f427949645f763435222c22757365726964223a302c22746f6b656e223a22222c22706172616d73223a7b226964223a2233227d2c226964656e74697479223a6e756c6c7d
// // senddata:    376232323664363537343638366636343232336132323637363537343536363936343635366634323739343936343566373633343335323232633232373537333635373236393634323233613330326332323734366636623635366532323361323232323263323237303631373236313664373332323361376232323639363432323361323233333232376432633232363936343635366537343639373437393232336136653735366336633764
// // _________________________________________________________________________
// // 明文：    7b226d6574686f64223a22676574566964656f427949645f763435222c22757365726964223a302c22746f6b656e223a22222c22706172616d73223a7b226964223a2233227d2c226964656e74697479223a6e756c6c7d
// // mima:     uEFrG2GhYK3wy4iGu5FsPUK6gofOd0uo3RE3GCy2AIrrqnxxFkxEwMSdLSLbTgIFInKlecyCZbTIdkhBl6sen44Q1/LlONeE7P/q2rRcNitWTItkaaLPZGVAqys0SsGe
// // mi=       n7VAty7mCU+46504csUyxazd6mCpkWY/c22HsvuM0/1JxYLD9lyY48/s22if6sizvVdsqSX7P2PQ4RIlEmbPIT8m4IPRy0FWy3VkD9Duttfh89VAydxPBBs8W70DCetsathJBHS8+HlnnhBE1v7UtyveJ5LXMiKHA2UQe3ZgMoERVO7B49DGemPpe8XahoAB/sFD1ZqDHRIjWvKRDkIbdMqsImDPBX3Q5UauuPHmBoM=
// // weizi=     {"method":"getVideoById_v45","userid":0,"token":"","params":{"id":"3"},"identity":null}

//不同密文可解密为相同原文
// mima2 = "E0yB5P0tEYkcUOCxD/VK2MaeRNNvErZ06xrG+kWDLUQMeOvN5PIuVo0QwqDKN2y/U58XRSJ4XrFfgVuEYy1GtwvVyAiLt9Sr4oN1BygJeP9//upa1v5JtD3+fIrjwHIi";
// mingwen = aesDecrypt(mima2);
// wenzi = CryptoJS.enc.Utf8.stringify(mingwen)
// console.log("weizi=     " + wenzi);














const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
const window = document.defaultView;
const $ = require('jquery')(window);
//some var

//some function
var url = "https://pro.haoyigong.com/server_pro/microClassroom!request.action";
var data = "data=uEFrG2GhYK3wy4iGu5FsPUK6gofOd0uo3RE3GCy2AIrrqnxxFkxEwMSdLSLbTgIFInKlecyCZbTIdkhBl6sen44Q1/LlONeE7P/q2rRcNitWTItkaaLPZGVAqys0SsGe";

htmlobj = $.ajax({
    type: 'post',
    url: url,
    async: false,
    data: data,
    success: function(_data) {
        // console.log(_data);
        console.log(_data.result.course.title)
    },
    error: function(xhr, type) {
        error ? error(xhr, type) : null
    }
});


// console.log(data_aes);