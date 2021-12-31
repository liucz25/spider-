//import Cryptojs
var CryptoJS = require('crypto-js');

//import jquery
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
const window = document.defaultView;
const $ = require('jquery')(window);


//全局变量
var keyStr = CryptoJS.enc.Latin1.parse("4590auf34567hilm2390noqrst890uyz");
var url = "https://pro.haoyigong.com/server_pro/microClassroom!request.action";
var jsontmpl = { "method": "getVideoById_v45", "userid": 0, "token": "", "params": { "id": 3 }, "identity": null };



var g_encrypt = 1; //0=接口不加密 1=接口加密
function toData(js) {

    // console.log("json:    " + json);
    var data = JSON.stringify(js);

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

function success(data) {
    if (data.status.code == 200) {
        // console.log(data);
        console.log(data.result.course.id + "    ----    " + data.result.course.title)
        r = data.result.course.id + "    ----    " + data.result.course.title
        return r
    }
}

function setImmediate(id) {
    // var js = JSON.parse(jsontmpl);
    // console.log(jsontmpl['params ']['id ']);
    jsontmpl['params']['id'] = id;
    jsontmpl['identity'] = null;
    // console.log(jsontmpl['params ']['id ']);
    // str = JSON.stringify(jsontmpl);
    // console.log(str);
    return jsontmpl;
}

function main(id) {
    js = setImmediate(id); //把jsontmpl的id换掉
    // console.log(js);
    data = toData(js);
    // console.log(data);
    //一个正确的密码，测试用    
    // var data = "data=uEFrG2GhYK3wy4iGu5FsPUK6gofOd0uo3RE3GCy2AIrrqnxxFkxEwMSdLSLbTgIFInKlecyCZbTIdkhBl6sen44Q1/LlONeE7P/q2rRcNitWTItkaaLPZGVAqys0SsGe";
    // // var data = "data=E0yB5P0tEYkcUOCxD/VK2MaeRNNvErZ06xrG+kWDLUQMeOvN5PIuVo0QwqDKN2y/U58XRSJ4XrFfgVuEYy1GtwvVyAiLt9Sr4oN1BygJeP9//upa1v5JtD3+fIrjwHIi";

    htmlobj = $.ajax({
        type: 'post',
        url: url,
        async: true,
        data: data,
        success: success,
        error: function(xhr, type) {
            console("error!!")
                // error ? error(xhr, type) : null
        }
    });

}

function all(min, max) {
    for (i = min; i < max; i++) {
        main(i)
    }
}

all(3600, 3800);