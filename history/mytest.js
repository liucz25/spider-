// var CryptoJS = require('./zaes');
// var data = "sometext";
// // var d = 
// console.log(CryptoJS);


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
        console.log(_data);
    },
    error: function(xhr, type) {
        error ? error(xhr, type) : null
    }
});



console.log("ok")