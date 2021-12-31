/*function toStr2(json) {
    return JSON.stringify(json);
}

function toData(json) {
    if(json instanceof  Object){
        return "data=" + JSON.stringify(json);
    }else{
        return "data=" + json;
    }
}*/

var g_encrypt = 1; //0=接口不加密 1=接口加密
function toData(json) {
    var data = JSON.stringify(json);
    if (g_encrypt == 0) {
        return "data=" + data;
    } else {
        console.log(data);
        data = aesEncrypt(data);
        return "data=" + data;
    }
}