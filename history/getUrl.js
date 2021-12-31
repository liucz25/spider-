/*全局变量*/
var version = "vweb";


/**********************环境变量***********************/

var isApp = false; //是否是app
var isWeixin = false; //是否是微信（手机微信和pc微信统称为微信）
var isWeixnOrqqbrower = false; //是否是微信或者qq
var isPc = false; //pc端（pc微信端也是pc）
var isAndroids = false; //安卓
var isIos = false; //苹果
var g_server = 2; // 环境配置：0=测试环境，2=正式环境
var g_debugmode = 1; //0=本地模式。1=部署到服务器模式



/**********************初始化环境变量***********************/
// 加载sdk
document.write('<script src="' + getVersion() + 'dev/js/jsSdk.js?t=' + Math.random() + '" type="text/javascript"><\/script>');

if (is_app()) {
    isApp = true;
}
if (is_weixn()) {
    isWeixin = true;
}
if (is_weixn() || is_mqqbrowser()) {
    isWeixnOrqqbrower = true;
}
if (is_pcbrowser()) {
    isPc = true;
}
if (isAndroid()) {
    isAndroids = true;
}
if (is_ios()) {
    isIos = true;
}
/**********************初始化接口信息和用户信息变量***********************/
var user = {
    //环境url
    urlBrand: '', //web
    urlFile: '', //file
    urlFile2: '', //file2
    urlVideo: '', //video
    urlGod: '', //pay
    medicalDetail: '', //info
    urlMedical: '', //pro
    url: '', //data
    urlOther: '', //other
    urlBanner: '', //h5
    urlQuestionnaire: '', //diaowen
    im: '', //im
    urlApp: '', //新框架app.haoyigong.com
    //用户信息
    //10482学海 //唐金迪25595 // 永晨 31276 //  金娜 70581 // 78797 d丁姐
    userid: '10482', //g_debugmode=0本地环境，固定userid
    token: '',
    identity: '',
}
/*初始化接口信息*/
if (true) {
    if (g_server == 0) {
        //测试环境
        user.urlBrand = "https://webtest.haoyigong.com";
        user.urlFile = "https://filetest.haoyigong.com";
        user.urlFile2 = "https://file2test.haoyigong.com";
        user.urlVideo = "https://videotest.haoyigong.com";
        user.urlGod = "https://paytest.haoyigong.com";
        user.medicalDetail = "https://infotest.haoyigong.com";
        user.urlMedical = "https://protest.haoyigong.com";
        user.url = "https://datatest.haoyigong.com";
        user.urlOther = "https://othertest.haoyigong.com";
        user.urlBanner = "https://h5test.haoyigong.com";
        user.urlQuestionnaire = "https://diaowentest.haoyigong.com";
        user.im = "wss://imtest.haoyigong.com:8098";
        user.urlApp = "https://apptest.haoyigong.com"
    } else if (g_server == 2) {
        //正式环境
        user.url = "https://data.haoyigong.com";
        user.urlBrand = "https://web.haoyigong.com";
        user.urlMedical = "https://pro.haoyigong.com";
        user.medicalDetail = "https://info.haoyigong.com";
        user.urlGod = "https://pay.haoyigong.com";
        user.urlBanner = "https://h5.haoyigong.com";
        user.urlQuestionnaire = "https://diaowen.haoyigong.com";
        user.urlFile = "https://file.haoyigong.com";
        user.urlFile2 = "https://file2.haoyigong.com";
        user.urlVideo = "https://video.haoyigong.com";
        user.urlOther = "https://other.haoyigong.com";
        user.im = "wss://im.haoyigong.com:8098";
        //user.im = "ws://60.195.252.75:9098";
        user.urlApp = "https://app.haoyigong.com"
    }
}
/*初始化用户信息*/
if (true) {
    var g_userid, g_identity, g_token;
    //app新版webview
    if (isApp) {
        g_userid = getCookie("g_userid")
        g_identity = getCookie("identity")
        g_token = getCookie("token")
    }
    //微信（手机微信和pc微信统称为微信）
    else if (isWeixin) {
        g_userid = getCookie("g_userid")

        g_identity = getUrlParam('identity')
        if (g_identity == null || g_identity == "null") {
            g_identity = window.sessionStorage.getItem("g_identity");
        } else {
            window.sessionStorage.setItem("g_identity", g_identity);
        }

        g_token = getCookie("token")
    }
    //pc（else可以排除pc微信浏览器）
    else if (isPc) {
        g_userid = getCookie("g_userid")

        g_identity = getUrlParam('identity')
        if (g_identity == null || g_identity == "null") {
            g_identity = window.sessionStorage.getItem("g_identity");
        } else {
            window.sessionStorage.setItem("g_identity", g_identity);
        }

        g_token = getCookie("token")
    }
    //app老版webview
    else {
        g_userid = getUrlParam('userid')
        g_identity = getCookie("identity")
        g_token = getUrlParam("token")
    }

    //赋值
    user.identity = g_identity;
    user.token = g_token;
    if (g_debugmode == 1) {
        user.userid = g_userid ? g_userid : 0;
    }
}




/*--分割线-----------------------------------------------------

_____ | _____        \     /   /______    |  |     / /_  /
()____)+()____)     -----  /       |       | -+-.  /_.|_|/_.
()____)+()____)      \ /  /___   __|__   | |  | |   / | | /
()____)+()____)     ----- | |    | |     |_| _|_|_ /_\`-'/_\
()____)+()____)     __|__ | |  __|_|____   |  |     ___|___
()____)+()____)      /|\  | |      |       | / \     _/|\_
     / | \
*/







/*****************************************************公共方法***********************************************************************/
//获取用户信息
function commonMessage() {
    return user;
}
/**
 * @description 分享需要配置version的地址
 * @author dongqizhen
 * @date 2019-03-13
 * @returns String
 */
function getVersion() {
    if (g_debugmode == 0) {
        return window.location.protocol + "//" + window.location.host + "/";
    } else {
        return window.location.protocol + "//" + window.location.host + "/" + version + "/";
    }
}
// H5 分享URl
function getShareVersion() {
    return str = window.location.protocol + "//" + window.location.host + "/vweb/";
}

function isAndroid() {
    var u = navigator.userAgent,
        flag = true;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    //解决fastClick与iscroll插件的冲突
    if (isAndroid) {
        return true;
    } else {
        return false;
    }
}
/**
 * @description 判断是安卓/ios
 * @returns {"true/false"} 
 */
function is_ios() {
    var u = navigator.userAgent,
        flag = true;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //解决fastClick与iscroll插件的冲突
    if (isIOS) {
        return true;
    } else {
        return false;
    }
}
/**
 * 判断是否是新版的app-webview
 */
function is_app() {
    if (navigator.userAgent.toLowerCase().indexOf('haoyigong') > -1) {
        return true;
    } else {
        return false;
    }
}
/**
 * 判断是否是微信内置浏览器
 */
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
/**
 * 判断是否是qq内置浏览器
 */
function is_mqqbrowser() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('qq') > -1) {
        if (/nettype/i.test(ua)) {
            if (!/micromessenger/i.test(ua)) {
                //qq内置浏览器
                return true;
            }
            return false
        }
        return false
    } else {
        return false;
    }
}
/**
 * 判断是否是pc
 */
function is_pcbrowser() {
    if (!(/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent))) {
        return true;
    } else {
        return false;
    }
}
// 新加密方式
function toDataNew(json) {
    json.identity = g_identity;
    if (!json.identity) {
        json.identity = 1;
    }
    var data = JSON.stringify(json);
    data = aesEncrypt(data);
    var _data = {
        'data': '' + data
    }
    _data = JSON.stringify(_data);
    return _data;
}







/*****************************************************cookie***********************************************************************/
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(arr[2]);
    } else {
        return "";
    }
}

function setCookie(name, value, Hours) {
    //var Hours = 30;小时
    var exp = new Date();
    exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
    if (g_debugmode == 1) {
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + "; path=/;domain=.haoyigong.com";
    } else {
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + "; path=/;";
    }
}
//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        if (g_debugmode == 1) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/;domain=.haoyigong.com";
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/;";
        } else {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/;";
        }

    }
}







/*****************************************************老webview的交互***********************************************************************/
/**
 * open remote web page or local web page inside app.
 * @param url string
 * @param params string  params格式：id=" + questionTypeId + "&type=" + questionType+"     不用这种格式：{"自定义参数":"自定义值","自定义参数2":"自定义值2"}
 */
function openWebPage(url) {
    openWebPage(url, null, null, false);
}

function openWebPage(url, params) {
    openWebPage(url, params, null, false);
}

function openWebPage(url, params, fileName) {
    openWebPage(url, params, fileName, false);
}
/**
 * open remote web page or local web page inside app.
 * @param {any} url 
 * @param {any} params               地址中参数
 * @param {any} fileName             文件夹名字
 * @param {any} needCloseThisWindow  跳转后页面是否关闭
 * @param {any} functionName         当页面跳转后，又返回该页面时如果需要刷新数据，出入数据请求的函数
 * @param {any} isFunctionBackInvoke 是否拦截安卓的返回按钮
 * @param {any} pageid 页面的ID，可以根据ID来实现其他功能
 */
function openWewbPage(url, params, fileName, needCloseThisWindow, functionName, isFunctionBackInvoke, pageid) {
    var fullUrl = null;
    if (g_debugmode == 0) {
        // connect directly to remote web page.
        fullUrl = "../" + fileName + "/" + url;
        console.log(fullUrl)
        if (params != null) {
            fullUrl += "?" + params;
        }
        window.location.href = fullUrl;
    } else {
        // open web page inside app.
        if (fileName != null) {
            fullUrl = "kaction://openLocalWeb?fileName=" + fileName + "/" + url;
        } else {
            fullUrl = "kaction://openLocalWeb?fileName=" + url;
        }
        if (needCloseThisWindow != null && needCloseThisWindow == true) {
            fullUrl += "&closeThis=true";
        }
        if (functionName) {
            fullUrl += "&functionName=" + functionName;
        }
        if (params != null) {
            fullUrl += "&" + params;
        }
        if (isFunctionBackInvoke != null) {
            fullUrl += "&" + "isFunctionBackInvoke=" + isFunctionBackInvoke
        }
        if (pageid != null) {
            fullUrl += "&" + "pageid=" + pageid
        }
        window.location.href = fullUrl;
    }
}

/**
 * @description open local native app page.
 * @param {any} url 
 * @param {any} params string  params格式：id=" + questionTypeId + "&type=" + questionType+"     不用这种格式：{"自定义参数":"自定义值","自定义参数2":"自定义值2"}
 * @param {boolean} needCloseThisWindow 
 */
function openNativePage(url, params, needCloseThisWindow) {
    if (g_debugmode == 0) {} else {
        // inside app.
        var fullUrl = "kaction://openPage?actionName=" + url;
        if (needCloseThisWindow != null && needCloseThisWindow == true) {
            fullUrl += "&closeThis=true";
        }
        if (params != null) {
            fullUrl += "&" + params;
        }
        window.location.href = fullUrl;
    }
}

/**
 * 打开登录页面
 */
function openLoginPage(needCloseThisWindow) {
    var fullUrl = "kaction://openPage?actionName=loginPage";
    if (needCloseThisWindow != null && needCloseThisWindow == true) {
        fullUrl += "&closeThis=true";
    }
    window.location.href = fullUrl;
}

/**
 * @description 打开第三方外链连接
 * @param {String} url 外链地址
 * @param {String} param 传入的参数 //* 如果需要返回刷新，传入回调函数使用 funName = * 形式
 * @param {String} funName 返回需要调用的函数
 * @param {String} isCanShare 是否需要分享按钮 0不需要1需要
 * @param {String} type 分享模块id
 */
function openThirdPage(url, param, funName, isCanShare, type, closeThis) {
    var fullUrl = "";

    //由于与原生交互影响url的切割，用"$-$"代替"?",用"*-*"代替"&";
    var IsCanShare = isCanShare === 0 ? isCanShare : 1
    if (param) {
        if (param.indexOf("&") != -1) {
            param = param.replace(/&/g, '*-*');
        }
        fullUrl = "kaction://openPage?actionName=webPage&type=" + (type ? type : '') + '&closeThis=' + (closeThis ? closeThis : 'false') + "&isCanShare=" + IsCanShare + "&url=" + url + "$-$" + param;
    } else {
        fullUrl = "kaction://openPage?actionName=webPage&type=" + (type ? type : '') + '&closeThis=' + (closeThis ? closeThis : 'false') + "&isCanShare=" + IsCanShare + "&url=" + url;
    }
    if (funName) {
        fullUrl = fullUrl + "&funName=" + funName;
    }
    window.location.href = fullUrl;
}
/**
 * 返回上一步
 * @param {any} funName 安卓手机，返回上一个页面需要刷新页面的数据部分，出入对应的函数
 */
function goBackPageNew(funName) {
    if (g_debugmode == 0) {
        // go to back web page
        history.back();
    } else {
        // go to back local page.
        //关闭当前界面(需要urlEncode转码)
        if (funName) {
            // window.location.href = "kaction://closeThis?functionName=" + funName;
            hyg.jsNative_close()
        } else {
            if (isWeixnOrqqbrower || isPc) {
                history.back();
            } else {
                // window.location.href = "kaction://closeThis";
                hyg.jsNative_close()
            }
        }
    }
}
/**
 * 返回上一步
 * @param {any} funName 安卓手机，返回上一个页面需要刷新页面的数据部分，出入对应的函数
 */
function goBackPage(funName) {
    if (g_debugmode == 0) {
        // go to back web page
        history.back();
    } else {
        // go to back local page.
        //关闭当前界面(需要urlEncode转码)
        if (funName) {
            window.location.href = "kaction://closeThis?functionName=" + funName;
        } else {
            if (isWeixnOrqqbrower || isPc) {
                history.back();
            } else {
                window.location.href = "kaction://closeThis";
            }
        }
    }
}
//微课堂 TinyClassRoomActivity
function goBackPageAndReload() {
    if (g_debugmode == 0) {
        // go to back web page
        history.back();
    } else {
        // go to back local page.
        //关闭当前界面(需要urlEncode转码)
        window.location.href = "kaction://closeThisAndReload";
    }
}
//维修宝 goBackPageAndReload
function mainGoBackPageAndReload() {
    if (g_debugmode == 0) {
        // go to back web page
        history.back();
    } else {
        // go to back local page.
        //关闭当前界面(需要urlEncode转码)
        window.location.href = "kaction://closeMainAndReload";
    }
}

/**
 * @description 显示dialog框
 * @param {*} title 显示标题
 * @param {*} content 显示内容
 */
function showDialog(title, content) {
    if (isApp) {
        layer.open({
            content: content,
            skin: 'msg',
            anim: 'scale',
            time: 1 //2秒后自动关闭
        });
    } else {
        if (g_debugmode == 0) {
            // alert in web page
            alert(title + "\n" + content);
        } else {
            // go to back local page.
            window.location.href = "kaction://showDialog?title=" + title + "&content=" + content;
        }
    }
}

/**
 * @description 确认提示框
 * @param {*} title 标题
 * @param {*} content 内容
 * @param {*} confirmFunctionName 确认后执行的函数
 */
function showConfirmDialog(title, content, confirmFunctionName) {
    if (isApp) {
        layer.open({
            content: content,
            skin: 'msg',
            anim: 'scale',
            time: 1 //2秒后自动关闭
        });
    } else {
        if (g_debugmode == 0) {
            var r = confirm(content);
            if (r == true) {
                window.location.href = "javascript:" + confirmFunctionName + "();";
            }
        } else {
            window.location.href = "kaction://showConfirmDialog?title=" + title + "&content=" + content + "&confirmFunctionName=" + confirmFunctionName;
        }
    }
}

//只提示文字的提示框
function stringShowDialog(content) {
    if (isApp) {
        layer.open({
            content: content,
            skin: 'msg',
            anim: 'scale',
            time: 1 //2秒后自动关闭
        });
    } else {
        if (g_debugmode == 0) {
            // alert in web page
            alert(content);
        } else {
            // go to back local page.
            window.location.href = "kaction://stringShowDialog?content=" + content;
        }
    }
}

/**
 * @description 调用原生没有取消按钮的confirm
 * @author dongqizhen
 * @date 2018-12-13
 * @param {*} title 标题
 * @param {*} content 内容
 * @param {*} confirmFuntionName 确认后执行的函数
 */
function showConfirmNoCancleDialog(title, content, confirmFunctionName) {
    if (isApp) {
        layer.open({
            content: content,
            skin: 'msg',
            anim: 'scale',
            time: 1 //2秒后自动关闭
        });
    } else {
        if (g_debugmode == 0) {
            // alert in web page
            var r = confirm(content);
            if (r == true) {
                window.location.href = "javascript:" + confirmFunctionName + "();";
            }
        } else {
            // go to back local page.
            window.location.href = "kaction://showConfirmNoCancleDialog?title=" + title + "&content=" + content + "&confirmFunctionName=" + confirmFunctionName;
        }
    }
}


/**
 * @description  打赏功能
 * @param {"6微课堂/7广场/5维修宝"} type 模块类型
 * @param {any} id 
 * @param {any} moduleActionCode 模块标识：维修宝打赏 REPAIRWARD /维修宝评论打赏 MCOMMENTREWARD  /会议通知详情 MEETINGDETAILS
 */
function moreOpetation(type, id, moduleActionCode) {
    if (g_debugmode == 0) {
        // alert in web page
        alert("can not reward " + "kaction://moreOpetationReward?type=" + type + "&id=" + id + "&moduleActionCode=" + moduleActionCode)
    } else {
        window.location.href = "kaction://moreOpetationReward?type=" + type + "&id=" + id + "&moduleActionCode=" + moduleActionCode;
    }
}

/**
 * @description 分享
 * @param {any} type 模块类型
 * @param {any} id 文章id
 * @param {any} title 分享标题
 * @param {any} content 分享显示内容
 * @param {any} imgurl 分享显示图片
 * @param {any} linkurl 分享跳转链接
 * @param {any} success 分享到医疗圈成功后成功的回调函数名
 * @param {any} params 传入的参数 //!由于与原生交互影响url的切割，用"$-$"代替"?",用"*-*"代替"&";
 */
function shareFunction(type, id, title, content, imgurl, linkurl, successfun, params) {
    var success = "";
    if (successfun != null) {
        success = successfun;
    }
    var content = content || "欢迎点击链接，查看详情。“好医工”APP_融合医学与工程 | 服务医疗与设备";

    if (params && params.indexOf("&") != -1) {
        params = params.replace(/&/g, '*-*');
    }
    console.log(params)
    console.log(linkurl)
    if (g_debugmode == 0) {
        // alert in web page
        // alert("can not share " + title);
        if (params) {
            alert("kaction://moreOpetationShare?type=" + type + "&id=" + id + "&title=" + title + "&content=" + content + "&imgurl=" + imgurl + "&successfunname=" + success + "&url=" + linkurl + '$-$' + params)
        } else {
            alert("kaction://moreOpetationShare?type=" + type + "&id=" + id + "&title=" + title + "&content=" + content + "&imgurl=" + imgurl + "&successfunname=" + success + "&url=" + linkurl)
        }
    } else {
        if (params) {
            window.location.href = "kaction://moreOpetationShare?type=" + type + "&id=" + id + "&title=" + title + "&content=" + content + "&imgurl=" + imgurl + "&successfunname=" + success + "&url=" + linkurl + '$-$' + params;
        } else {
            window.location.href = "kaction://moreOpetationShare?type=" + type + "&id=" + id + "&title=" + title + "&content=" + content + "&imgurl=" + imgurl + "&successfunname=" + success + "&url=" + linkurl;
        }

    }
}

/**
 * @description 弹出更多操作按钮
 * @param {*} type 分类(按模块自定义)(模块拼音全拼)
 * @param {*} id 模块下项的id
 * @param {*} collectStatus 收藏状态 0=未收藏 1=已收藏	(无此功能，可不传)
 * @param {*} praiseStatus 点赞状态 0=未点赞 1=已点赞	(无此功能，可不传)
 * @param {*} shareTitle 分享标题  (无分享功能，可不传)
 * @param {*} shareContent 分享内容	(无分享功能，可不传)
 * @param {*} shareImgUrl 分享图片	(无分享功能，可不传)
 * @param {*} shareUrl 分享的URL	(无分享功能，可不传)
 */
function showMoreBtn(type, id, collectStatus, praiseStatus, shareTitle, shareContent, shareImgUrl, shareUrl) {
    if (g_debugmode == 0) {
        // alert in web page
        alert("showMoreBtn type:" + type + ' id:' + id + ' collectStatus:' + collectStatus + ' praiseStatus:' + praiseStatus + " shareTitle:" + shareTitle + " shareContent:" + shareContent + " shareImgUrl:" + shareImgUrl + " shareUrl:" + shareUrl);
    } else {
        var fullUrl = "kaction://moreOperation?type=" + type;
        if (id != null) {
            fullUrl += "&id=" + id;
        }
        if (collectStatus != null) {
            fullUrl += "&collectStatus=" + collectStatus;
        }
        if (praiseStatus != null) {
            fullUrl += "&praiseStatus=" + praiseStatus;
        }
        if (shareTitle != null) {
            fullUrl += "&shareTitle=" + shareTitle;
        }
        if (shareContent != null) {
            fullUrl += "&shareContent=" + shareContent;
        }
        if (shareImgUrl != null) {
            fullUrl += "&shareImgUrl=" + shareImgUrl;
        }
        if (shareUrl != null) {
            fullUrl += "&shareUrl=" + shareUrl;
        }

        window.location.href = fullUrl;
    }
}

/**
 * @description 下载阅读PDF
 * @param {*} downloadUrl 下载地址 (需要urlEncode转码)
 * @param {*} fileName 文件名称
 * @param {*} type 分类(按模块自定义)(模块拼音全拼)
 * @param {*} id 模块下项的id
 * @param {*} collectStatus 收藏状态 0=未收藏 1=已收藏	(无此功能，可不传)
 * @param {*} praiseStatus 点赞状态 0=未点赞 1=已点赞	(无此功能，可不传)
 * @param {*} shareTitle 分享标题  (无分享功能，可不传)
 * @param {*} shareContent 分享内容	(无分享功能，可不传)
 * @param {*} shareImgUrl 分享图片	(无分享功能，可不传)
 * @param {*} shareUrl 分享的URL (无分享功能，可不传)
 */
function downloadPdfFile(downloadUrl, fileName, type, id, collectStatus, praiseStatus, shareTitle, shareContent, shareImgUrl, shareUrl) {
    if (g_debugmode == 0) {
        // alert in web page
        alert("downloadPdfFile downloadUrl:" + downloadUrl + '  fileName:' + fileName + ' type:' + type + ' id:' + id);
    } else {
        var fullUrl = "kaction://readPdf?downloadUrl=" + downloadUrl;
        if (fileName != null || type != null || id != null) {
            fullUrl += "&fileName=" + fileName + "&type=" + type + "&id=" + id;
        }
        if (collectStatus != null) {
            fullUrl += "&collectStatus=" + collectStatus;
        }
        if (praiseStatus != null) {
            fullUrl += "&praiseStatus=" + praiseStatus;
        }
        if (shareTitle != null) {
            fullUrl += "&shareTitle=" + shareTitle;
        }
        if (shareContent != null) {
            fullUrl += "&shareContent=" + shareContent;
        }
        if (shareImgUrl != null) {
            fullUrl += "&shareImgUrl=" + shareImgUrl;
        }
        if (shareUrl != null) {
            fullUrl += "&shareUrl=" + shareUrl;
        }

        window.location.href = fullUrl;
    }
}

/**
 * @description 拨打电话
 * @param {*} mobile
 */
function callPhone(mobile) {
    if (g_debugmode == 0) {
        // alert in web page
        alert(mobile);
    } else {
        // go to back local page.
        window.location.href = "kaction://callPhone?mobile=" + mobile;
    }
}

/**
 * @description 选择联系人
 * @param {*} maxNumber 最多选择几个
 * @param {*} callBack 回调Function名称  参数Array
 */
function selectContacts(maxNumber, callBack) {
    if (g_debugmode == 0) {
        window.location.href = "javascript:" + callBack + "(new Array('1'));";
    } else {
        window.location.href = "kaction://selectContacts?maxNumber=" + maxNumber + "&callBack=" + callBack;
    }
}

/**
 * @description 发送自定义回调,带3个自定义参数
 * @param {*} functionName 
 * @param {*} param1
 * @param {*} param2
 * @param {*} param3
 */
function sendCallFunction(functionName, param1, param2, param3) {
    if (g_debugmode == 0) {
        alert(functionName + " " + param1 + " " + param2 + " " + param3);
    } else {
        var fullUrl = "kaction://callFunction";
        if (functionName != null) {
            fullUrl += "?";
            fullUrl += "functionName=" + functionName;
        }
        if (param1 != null) {
            fullUrl += "&param1=" + param1;
        }
        if (param2 != null) {
            fullUrl += "&param2=" + param2;
        }
        if (param3 != null) {
            fullUrl += "&param3=" + param3;
        }
        //alert("fullUrl:"+fullUrl);
        window.location.href = fullUrl;
    }
}

/**
 * @description 调用原生2.9.0的支付页面
 * @author dongqizhen
 * @date 2018-12-11
 * @param {*} type 模块类型标识 2 维修宝 3 会议通知
 * @param {*} typeID 购买产品id
 * @param {*} orderName 购买产品的name
 * @param {*} orderDetails 购买产品的详情
 * @param {*} payAmount 购买产品所需要的钻石数
 * @param {*} pay 购买产品所需要的金币数
 * @param {*} passCode 购买口令码
 * @param {*} functionName 返回上一页的回调函数
 */
function newOrderPay(type, typeID, orderName, orderDetails, payAmount, pay, passCode, functionName) {
    console.log("kaction://newOrderPay?type=" + type + '&typeID=' + typeID + '&orderName=' + orderName + "&orderDetails=" + orderDetails + "&payAmount=" + payAmount + "&pay=" + pay + "&passCode=" + passCode + "&functionName=" + functionName)
    if (g_debugmode == 1) {
        var fullUrl = "kaction://newOrderPay?type=" + type + '&typeID=' + typeID + '&orderName=' + orderName + "&orderDetails=" + orderDetails + "&payAmount=" + payAmount + "&pay=" + pay + "&passCode=" + passCode + "&functionName=" + functionName;
        window.location.href = fullUrl;
    }
}
/**
 * @description 调用原生3.6.0的支付页面
 * @author dongqizhen
 * @date 2018-12-11
 * @param {*} type 模块类型标识 2 维修宝 3 会议通知
 * @param {*} typeID 购买产品id
 * @param {*} orderName 购买产品的name
 * @param {*} orderDetails 购买产品的详情
 * @param {*} payAmount 购买产品所需要的钻石数
 * @param {*} pay 购买产品所需要的金币数
 * @param {*} passCode 购买口令码
 * @param {*} functionName 返回上一页的回调函数
 */
function upNewOrderPay(type, typeID, orderName, orderDetails, payAmount, pay, passCode, functionName, payDiamond) {
    console.log("kaction://upNewOrderPay?type=" + type + '&typeID=' + typeID + '&orderName=' + orderName + "&orderDetails=" + orderDetails + "&payAmount=" + payAmount + "&pay=" + pay + "&passCode=" + passCode + "&functionName=" + functionName + "&payDiamond=" + payDiamond)
    if (g_debugmode == 1) {
        var fullUrl = "kaction://upNewOrderPay?type=" + type + '&typeID=' + typeID + '&orderName=' + orderName + "&orderDetails=" + orderDetails + "&payAmount=" + payAmount + "&pay=" + pay + "&passCode=" + passCode + "&functionName=" + functionName + "&payDiamond=" + payDiamond;
        window.location.href = fullUrl;
    }
}
/**
 * @description 支付
 * @param {*} orderNo 订单号
 * @param {*} orderPrice 订单金额 double类型 如1.00 = 1元
 * @param {*} productName 商品名称
 * @param {*} attach 用于支付表示具体是哪个模块的支付
 * @param {*} productContent 商品详情
 * @param {*} callBackSuccess 成功之后的回调function的名字 无参方法
 * @param {*} callBackFail 失败之后的回调function的名字 参数 failCode,failMsg
 */
function orderPay(orderNo, orderPrice, productName, attach, productContent, callBackSuccess, callBackFail) {
    if (g_debugmode == 0) {
        window.location.href = "javascript:" + callBackSuccess + "();";
    } else {
        var fullUrl = "kaction://orderPay?orderNo=" + orderNo + "&orderPrice=" + orderPrice;
        if (productName != null) {
            productName = encodeURI(encodeURI(productName))
            fullUrl += "&productName=" + productName;
        }
        if (attach != null) {
            fullUrl += "&attach=" + attach;
        }
        if (productContent != null) {
            fullUrl += "&productContent=" + productContent;
        }
        if (callBackSuccess != null) {
            fullUrl += "&callBackSuccess=" + callBackSuccess;
        }
        if (callBackFail != null) {
            fullUrl += "&callBackFail=" + callBackFail;
        }
        window.location.href = fullUrl;
    }
}

function urlEncode(str) {
    var resultStr = encodeURI(str);
    resultStr = resultStr.replace(/\&/g, '@@');
    return resultStr;
}

/**
 * @description 获取url中携带的参数的值
 * @param {*} name 想要获取的目标对象(字符串)
 * @returns 返回参数值
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.decodeURI(window.decodeURI(window.location.search.substr(1))).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

/**
 * @description 验证数字格式
 * @param {*} value
 * @returns
 */
function check_validate1(value) {
    //定义正则表达式部分
    var reg = /^-?[1-9]\d*(\.\d*)?$/;
    if (reg.test(value)) {
        return true;
    }
    return false;
}






/**
 * @_ajax
 * ajax  //ajax請求封装函数
 * @param {"请求类型"} type 默认：'post'
 * @param {"请求地址"} url 
 * @param {"请求数据"} data 
 * @param {"是否异步"} async 默认：true
 * @param {"成功回调函数"} success 
 * @param {"失败回调函数"} error
 */
function _ajax(type, url, data, async, success, error) {
    data.identity = user.identity;
    $.ajax({
        type: type ? type : 'post',
        url: url,
        async: async,
        data: toData(data),
        success: function (_data) {
            if (_data.result.admin_pay || (_data.result[0] ? _data.result[0].admin_pay : false)) {
                var admin_pay = _data.result.admin_pay || _data.result[0].admin_pay;
                // window.location.href = "kaction://goldCoinAnimation?goldCoinNum=" + admin_pay;
                setTimeout(function () {
                    success(_data);
                }, 1200)
            } else {
                success(_data);
            }
        },
        error: function (xhr, type) {
            error ? error(xhr, type) : null
        }
    });
}

/**
 * @description 图片预览
 * @author dongqizhen
 * @date 2019-10-14
 * @param {number} index 当前的索引值
 * @param {array} arr 需要预览图片数组
 */
function imagePreview(index, arr) {
    console.log(index, arr)
    window.location.href = "kaction://previewPicture?pictureInfo=" + JSON.stringify({
        index: index,
        pictureArray: arr
    });
}

////nijiayuan begin
function arrayToJson(o) {
    var r = [];
    if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push('"' + i + '"' + ":" + arrayToJson(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(arrayToJson(o[i]));
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}

/**
 * 
 * @param {* data:{beforeDate,afterDate,isUpdate}} params
 * @returns 调用函数
 */
function getDateRange(params) {
    var funname = params['funname'] || "",
        url = "kaction://getDateRange?";
    if (params.hasOwnProperty('data')) {
        params.data.beforeDate = params.data.beforeDate || "";
        params.data.afterDate = params.data.afterDate || "";
        params.data.isUpdate = params.data.hasOwnProperty('isUpdate') == true ? true : false;
    } else {
        params.data = {}
        params.data.beforeDate = "";
        params.data.afterDate = "";
        params.data.isUpdate = false;
    };
    var data = JSON.stringify(params.data) || "";
    url += "funname=" + funname + "&" + "data=" + data;
    window.location.href = url;
}

/**
 * 应付测试数据加密,生成随机字符串并解密,只适用于纯数字，比如id,index
 * 不要给字母加密,后果自负!
 * 加密:
 * @param {any} type true为解密 false为加密
 * @param {any} val type为true时:需要解密的数字 type为false时需要加密的数字
 * @param {any} min 最小位数
 * @param {any} max 最大位数
 * @param {any} charStr 随机字符串
 * @returns 返回字符串
 */
function encryptData(type, val, min, max, charStr) {
    var returnStr = "",
        range;
    if (typeof min == 'undefined') {
        min = 5;
    }
    if (typeof max == 'string') {
        charStr = max;
    }
    if (typeof val == 'undefined') {
        console.error('必须传入原始数据!')
        return;
    }
    if (type == true) {
        var res = val.replace(/[a-z]/ig, '')
        return res;
    }
    range = ((max && typeof max == 'number') ? Math.round(Math.random() * (max - min)) + min : min);
    charStr = charStr || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (var i = 0; i < range; i++) {
        var index = Math.round(Math.random() * (charStr.length - 1));
        returnStr += charStr.substring(index, index + 1);
    }
    return val + returnStr;
}

// 返回页面传递参数，调用函数
var Router = function () {
    return this;
}



/**
 ** 自由跳转到某个包含ID的页面
 *
 ** toid 跳转页面的的id //? home 跳转h5首页  homePageId 行业数据h5首页
 ** funname 返回需要回调的函数
 */
Router.prototype.topage = function (param) {
    if (isApp) {
        hyg.jsNative_openNativePage_industryDataHome();
    } else {
        var toid = param['toid'] == null ? null : param['toid'],
            closeid = param['closeid'] == null ? null : param['closeid'],
            data = param['data'] == null ? 'none' : param['data'],
            funname = param['funname'] == null ? 'none' : param['funname'],
            url = param['url'],
            closeIDStr = '';
        if (data !== 'none') {
            data = JSON.stringify(data)
        } else {
            data = JSON.stringify({
                'default': 'defalut'
            })
        }
        if (!g_debugmode) {
            window.location.href = url;
        } else {
            for (var i = 0; i < closeid.length; i++) {
                var el = closeid[i];
                if (i < closeid.length - 1) {
                    closeIDStr += el + ','
                } else {
                    closeIDStr += el;
                }
            }
            var url = "kaction://tosomePage?"
            url += "toid=" + toid + "&"
            url += "closeid=" + closeIDStr + "&"
            url += "params=" + data + "&"
            url += "funname=" + funname;

            window.location.href = url;
        }
    }

}
// 返回上一页，添加返回函数名，在上个页面调用的函数
Router.prototype.back = function (funname) {
    if (g_debugmode == 0) {
        history.back();
    } else {
        if (funName) {
            window.location.href = "kaction://closeThis?functionName=" + funName;
        } else {
            window.location.href = "kaction://closeThis";
        }
    }
}
// 打开新页面,调用方式和openwebpage一样
Router.prototype.open = function (params) {
    var isclose = params.file == null ? null : params.file,
        funname = params.funname == null ? null : params.funname,
        BackInvoke = params.BackInvoke == null ? null : params.BackInvoke,
        pageid = params.pageid == null ? null : params.pageid,
        urlparams = "";
    if (params.data == null) {
        params.data = null;
        urlparams = null;
    } else {
        for (var k in params.data) {
            if (params.data.hasOwnProperty(k)) {
                var el = params.data[k];
                urlparams += k + "=" + el + "&";
            }
        }
        urlparams = urlparams.substring(0, urlparams.length - 1)
    }
    openWebPage(params.url, urlparams, params.file, isclose, funname, BackInvoke, pageid)
}

// 只分享到QQ、和微信好友
/**
 * @param {String} imgUrl               分享的图片
 * @param {String} desc                 分享描述
 * @param {String} link                 分享链接
 * @param {String} title                分享标题
 * @param {String} funname              分享后的回调函数，成功传1，失败传0
 */
function shareFriends(param) {
    if (!param.imgurl) alert('imgUrl is not defined')
    if (!param.desc) alert('desc is not defined')
    if (!param.link) alert('link is not defined')
    if (!param.title) alert('title is not defined')
    if (!param.funname) alert('funname is not defined')
    console.log(param)
    // 用!代替?,用@代替&
    param.link = param.link.replace(/\?/g, '!')
    param.link = param.link.replace(/\&/g, '@')
    param = JSON.stringify(param)
    fullUrl = "kaction://shareMeetingTicket?shareData=" + param
    window.location.href = fullUrl;
}

/**
 * 导航
 * @param {String} param  {
 *     title:"定位的描述",
 *     position:"经纬度，用逗号隔开"
 * }
 */

function toNavigation(param) {
    var fullUrl = ''
    if (!param.title) stringShowDialog('title is not defined');
    if (!param.position) stringShowDialog('position is not defined');
    var navData = new Object({
        "longitude": param.position.split(',')[0],
        "latitude": param.position.split(',')[1],
        "title": param.title
    })
    navData = JSON.stringify(navData)
    fullUrl = "kaction://toNavigation?navData=" + navData
    window.location.href = fullUrl;
}


/**
 ** 加法函数，用来得到精确的加法结果
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}
/**
 ** 减法函数，用来得到精确的减法结果
 ** 
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}