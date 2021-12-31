var user = commonMessage();
var _player;
var _tradeType = 0; //是否收费
var _ispay = 0; //是否付费
var _trySee = 0;
var flg = false;
// 当前视频播放id;
var currentPlayVideoId = '';
// 最后一次观看时长
var lastWatchTime = 0;
var commentDropload = '';
var isFirst = true;
var miniRefresh = ''
var openAppUrl = '';

// 在微信端判断未登录使用openid换取用户信息
if (isWeixnOrqqbrower) {
    var openid = getCookie("_openid");
    if (!user.userid && openid) {
        getUserByOpenid()
    } else {
        // 获取微信openId  正式环境需要开放
        initOpenid();
    }
}

// //临时跳转
/*
var nurl = location.href;
if (nurl.indexOf('https') > -1) {
    var nurl = nurl.replace('https://', 'http://');
    location.href = nurl + '&back=1';
}
*/

setTimeout(() => {
    initOnce();
    new FastClick(document.body);
})

function initOnce() {
    var data, App;
    window.data = data = {
        // 系列直播间id
        _id: '',
        // _id: '2780',
        // _id: '1213',
        // _id: '2772',
        // tab 状态
        navStatus: 'course',
        // 显示专题文字
        zhuantiText: '',
        // 专题详情
        courseDetail: {},
        // 专题详情数据
        courseData: {},
        // 是否显示该课程属于多个专题
        showZhuantiList: false,
        watchAmountData: '',
        // 问答列表
        commentList: [],
        trySeeTime: '',
        // 判断试看是否结束
        isTrySeeOver: false,
        isShowTrySee: false,
        showAllTeacher: false,
        commentNumber: 0,
        page: 1,
        currentVideoId: '',
        isLogin: '',
        //课程详情内图片
        imgArr: [],
        bannerBottom: [],
        // 优惠券列表
        couponList: [],
        // 查看备注id
        remarkId: '',
        // 分页
        pages: 0,
        // 是否显示优惠券弹窗
        showCouponModel: false,
        // 优惠券领取model
        couponModel: '', // app app专享  authentication：认证用户  researcher：研究员
        showOnline: false
    };

    window.App = App = new Vue({
        el: "#app",
        data: data,
        mounted: function () {
            this.isLogin = user.userid
            data._id = getUrlParam("id");
            this._id = getUrlParam("id");
            this.initData()
            this.getCommentNumber();
            // 海报分享跳转
            $('.share_icon').on('click', function () {
                location.href = '../share/sharePoster.html?templateType=2&id=' + data._id
            })
            $('.share_icon_play').on('click', function () {
                location.href = '../share/sharePoster.html?templateType=2&id=' + data._id
            })
            // 图片预览事件
            this.previewImageEvent();
            // 获取广告banner
            this.getBannerList();
            // 下载App重新绑定事件
            $(".download")
                .unbind("click")
                .on("click", () => {
                    openAppUrl = '../share/download_app.html?type=microClassDetails&params=' + data._id;
                    this.downloadApp()
                })
        },
        methods: {
            // 倍速播放
            playbackRate() {
                $('.rate').remove()
                $('.vcp-controls-panel').append(' <div class="rate">' +
                    ' <span class="rateItem">1.0×</span>' +
                    '<ul class="rateList">' +
                    // ' <li data-rate="3.0">3.0×</li>' +
                    ' <li data-rate="2.5">2.5×</li>' +
                    ' <li data-rate="2.0">2.0×</li>' +
                    ' <li data-rate="1.5">1.5×</li>' +
                    ' <li data-rate="1.0">1.0×</li>' +
                    ' <li data-rate="0.5">0.5×</li>' +
                    '</ul>' +
                    '</div>')
                $('.rateItem').on('click', function () {
                    if ($('.rateList').hasClass('showRate')) {
                        $('.rateList').removeClass('showRate')
                    } else {
                        $('.rateList').addClass('showRate')
                    }
                })
                $('.rateList').on('click', 'li', function () {
                    document.querySelector("video").playbackRate = $(this).data('rate')
                    $('.rateItem').html($(this).html())
                    $('.rateList').removeClass('showRate')

                })
            },
            clooseOnline() {
                if (isWeixnOrqqbrower) {
                    window.WeixinJSBridge.call('closeWindow')
                } else {
                    window.close()
                }
            },
            // 下载app
            downloadApp() {
                // window.location.href = '../share/download_app.html?type=microClassDetails&params=' + data._id;
                location.href = openAppUrl;
            },
            // 获取广告banner
            getBannerList() {
                let _self = this;
                var post_data = {};
                post_data.userid = user.userid;
                post_data.token = user.token;
                post_data.params = {
                    businessId: this._id,
                    moduleId: "90701" //类型：String  必有字段  备注：微课堂：90701
                }
                $.ajax({
                    type: 'POST',
                    data: toDataNew(post_data),
                    contentType: 'application/json;charset=utf-8',
                    url: user.urlApp + '/master/bannerApp/getBannerListByBusinessId',
                    success: function (res) {
                        _self.bannerBottom = res.result;
                        setTimeout(() => {
                            new Swiper(".swiper-container2", {
                                loop: data.bannerBottom.length == 1 ? false : true, // 循环模式选项
                                autoplay: {
                                    delay: 3000,
                                    stopOnLastSlide: false,
                                    disableOnInteraction: false,
                                },
                                on: {
                                    init: function (swiper) {},
                                    click: function (e) {
                                        var obj = $(e.target.parentNode).data('data')
                                        App.openPage(obj)
                                    }
                                },
                                pagination: {
                                    el: '.swiper-pagination',
                                    clickable: true,
                                },
                            });
                        }, 500)
                    }
                });
            },
            //关闭广告
            closeLittleAp() {
                $(".adware-min").hide();
            },
            // 点击计数接口
            addBannerHits(id) {
                var post_data = {};
                post_data.userid = user.userid;
                post_data.token = user.token;
                post_data.params = {
                    id: id
                }
                $.ajax({
                    type: 'POST',
                    data: toDataNew(post_data),
                    contentType: 'application/json;charset=utf-8',
                    url: user.urlApp + '/master/bannerApp/addBannerHits',
                    success: function (res) {

                    }
                });
            },
            //轮播图跳转页面
            openPage(item) {
                this.addBannerHits(item.id)
                if (isWeixnOrqqbrower || isPc) {
                    if (item.linkType == 2) {
                        // hyg.jsNative_openWebPage({
                        //     url:item.linkUrl,
                        //     isShowNav:1,//是否显示原生头部，默认显示；isShowNav=1显示，isShowNav=0隐藏；
                        //     title:"",
                        //     isShowShare:item.enableShare
                        // });
                        window.location.href = item.linkUrl
                    } else if (item.linkType == 1) {
                        var _url
                        switch (item.linkModuleCode) {
                            case 'video':
                                // 微课堂详情页
                                _url = getVersion() + 'microClass/videoPlay.html?id=' + item.linkObjectId
                                break;
                            case 'videoTranied':
                                // 微课堂专题页
                                _url = getVersion() + 'microClass/projectDetails.html?id=' + item.linkObjectId
                                break;
                            case 'live':
                                // 直播详情页
                                _url = getVersion() + 'pay/liveDetail.html?id=' + item.linkObjectId
                                break;
                            case 'liveSerial':
                                // 系列直播间
                                _url = getVersion() + 'pay/seriesLive.html?id=' + item.linkObjectId
                                break;
                            case 'meeting':
                                // 会议通知详情页
                                _url = getVersion() + 'meetingNotice/dispatch.html?id=' + item.linkObjectId
                                break;
                            case 'subscribe':
                                // 订阅首页
                                _url = getVersion() + 'subscription/index.html?id=' + item.linkObjectId
                                break;
                            case 'article':
                                // 行业资讯详情页
                                _url = getVersion() + 'industryInformation/informationDetail.html?id=' + item.linkObjectId
                                break;
                            default:
                                break;
                        }
                        window.location.href = _url;
                    }
                } else {
                    // openThirdPage(url);
                    if (item.linkType == 2) {
                        hyg.jsNative_openWebPage({
                            url: item.linkUrl,
                            isShowNav: 1, //是否显示原生头部，默认显示；isShowNav=1显示，isShowNav=0隐藏；
                            title: "",
                            isShowShare: item.enableShare ? item.enableShare : 0
                        });
                    } else if (item.linkType == 1) {
                        switch (item.linkModuleCode) {
                            case 'video':
                                // 微课堂详情页
                                hyg.jsNative_openNativePage_microClassroomDetail({
                                    id: item.linkObjectId
                                });
                                break;
                            case 'videoTranied':
                                // 微课堂专题页
                                hyg.jsNative_openNativePage_microClassroomSubject({
                                    id: item.linkObjectId
                                });
                                break;
                            case 'live':
                                // 直播详情页
                                _url = getVersion() + 'pay/liveDetail.html?id=' + item.linkObjectId
                                window.location.href = _url;
                                break;
                            case 'liveSerial':
                                // 系列直播间
                                _url = getVersion() + 'pay/seriesLive.html?id=' + item.linkObjectId
                                window.location.href = _url;
                                break;
                            case 'meeting':
                                // 会议通知详情页
                                _url = getVersion() + 'meetingNotice/dispatch.html?id=' + item.linkObjectId
                                window.location.href = _url;
                                break;
                            case 'subscribe':
                                // 订阅首页
                                hyg.jsNative_openNativePage_subscriptionPersonalHome({
                                    id: item.linkObjectId
                                });
                                break;
                            case 'article':
                                // 行业资讯详情页
                                _url = getVersion() + 'industryInformation/informationDetail.html?id=' + item.linkObjectId
                                window.location.href = _url;
                                break;
                            default:
                                break;
                        }
                    }
                }
            },
            // 购买
            onBuy() {
                if (_ispay == 0) {
                    if (validateLogin()) {
                        location.href = "../pay/order.html?id=" + data._id + "_2";
                    }
                }
            },
            // 查看全部讲师
            showteacherList() {
                if (this.courseDetail.lecturerList.length < 9) {
                    this.showAllTeacher = true
                } else {
                    location.href = './teacherList.html?id=' + data._id;
                }
            },
            // 讲师详情
            goTeacherDetail(item) {
                if (item.subscribeId) {
                    window.location.href = '../subscription/index.html?id=' + item.subscribeId
                } else {
                    window.location.href = './teacherInfo.html?id=' + item.id
                }
            },
            selectNav(nav, index) {
                this.navStatus = nav;
                if (nav == 'question') {
                    initDropload()
                }
            },
            // 下载提示
            downloadTip() {
                openAppUrl = '../share/download_app.html?type=microClassDetails&params=' + data._id;
                appAlert()
            },
            // 获取课程详情 
            initData() {
                let _this = this;
                var _url = user.urlMedical + "/server_pro/microClassroom!request.action";
                var _data = {
                    "method": "getVideoById_v45",
                    "userid": user.userid,
                    "token": user.token,
                    "params": {
                        "id": _this._id
                    }
                };
                _ajax("post", _url, _data, true, function (res) {
                    if (res.status.code == '200') {
                        console.log(res.result)
                        _this.courseDetail = res.result.course;
                        _this.courseData = res.result;
                        // 判断是否有专题
                        _this.zhuantiText = _this.courseDetail.traniedTip.replace('@', '<span>' + _this.courseDetail.traniedPrice + '</span>');
                        // 判断是否为收费视频
                        _tradeType = _this.courseDetail.tradeType;
                        // 判断是否购买
                        _ispay = _this.courseDetail.ispay;
                        if (user.userid && user.userid == _this.courseData.userId) {
                            _ispay = 1;
                        }
                        // 判断观看人数
                        var watchAmount = _this.courseDetail.watchAmount;
                        if (_this._id == 1723) {
                            watchAmount = parseInt(watchAmount * 4.5);
                        }
                        if (watchAmount >= 10000) {
                            var num = parseFloat(watchAmount / 10000);
                            var num2 = Math.round(num * 100) / 100;
                            _this.watchAmountData = num2 + '万人次播放'
                        } else {
                            _this.watchAmountData = watchAmount + '人次播放'
                        }
                        // 试看
                        if (_tradeType == 1 && _ispay == 0) {
                            _this.trySeeTime = _this.courseData.videoSubList[0].trySee;
                            if (_this.trySeeTime > 0) {
                                _this.isShowTrySee = true;
                                _trySee = _this.trySeeTime * 60;
                            } else {
                                _trySee = 0
                                _this.isShowTrySee = false;
                            }
                        }
                        // 视频地址
                        let videoUrl = _this.courseData.videoSubList[0].url;
                        currentPlayVideoId = _this.courseData.videoSubList[0].id;
                        _this.currentVideoId = currentPlayVideoId;
                        lastWatchTime = _this.courseData.videoSubList[0].watchTime;
                        initTcPlayer(_this.courseDetail.image, videoUrl);
                        if (isWeixnOrqqbrower) {
                            wxconfig()
                        }
                        // 判断收费课程
                        if (_this.courseDetail.tradeType == 1) {
                            _this.initMiniRefresh()
                        }
                        if (res.result.isAudit == 0) {
                            data.showOnline = true
                        }
                        setTimeout(()=>{
                            App.playbackRate()
                        },500)
                    } else {
                        alert(res.status.message)
                    }
                })
            },
            initMiniRefresh() {
                let _self = this;
                miniRefresh = new MiniRefresh({
                    container: '#expertListBox',
                    down: {
                        // isLock: true,//是否禁用下拉刷新
                        callback: function () {
                            _self.getBusinessCouponList('down');
                        }
                    },
                    up: {
                        isAuto: true,
                        callback: function () {
                            _self.getBusinessCouponList('up');
                        }
                    }
                });
            },
            // 获取优惠券列表
            getBusinessCouponList(downOrUp) {
                let _self = this;
                if (downOrUp == 'down') {
                    _self.pages = 1; // 下拉刷新页码设置
                } else {
                    _self.pages++; // 上拉加载递增页码
                }
                var post_data = {};
                post_data.userid = user.userid;
                post_data.token = user.token;
                post_data.params = {
                    businessId: this._id,
                    moduleId: "90701",
                    "pageNo": _self.pages, //类型：String  必有字段  备注：无
                    "pageSize": 10, //类型：String  必有字段  备注：无
                    "businessType": 2, //类型：Number  必有字段  备注：2:微课堂 3:直播 4:会议通知 5:行业数据 6:微课堂专题 7:系列直播间
                }
                $.ajax({
                    type: 'POST',
                    data: toDataNew(post_data),
                    contentType: 'application/json;charset=utf-8',
                    url: user.urlApp + '/master/couponPro/getBusinessCouponList/v510',
                    success: function (res) {
                        // _self.couponList = res.result.list
                        if (res.status.code == 200) {
                            if (res.result.list.length > 0) {
                                if (downOrUp == 'down') {
                                    _self.couponList = [];
                                    setTimeout(() => {
                                        _self.couponList = res.result.list;
                                        miniRefresh.endDownLoading(true); // 结束下拉刷新
                                    }, 200)
                                } else {
                                    _self.couponList = _self.couponList.concat(res.result.list)
                                    if (res.result.list.length == 10) {
                                        miniRefresh.endUpLoading(false);
                                    } else {
                                        miniRefresh.endUpLoading(true); // 结束上拉加载
                                    }
                                }
                            } else {
                                if (_self.pages == 1) {
                                    _self.couponList = []
                                }
                                if (downOrUp == 'down') {
                                    miniRefresh.endDownLoading(true);
                                } else {
                                    miniRefresh.endUpLoading(true);
                                }
                            }
                            // _self.couponList = res.result.list;
                        } else {
                            layer.open({
                                content: res.status.message,
                                skin: 'msg',
                                anim: 'scale',
                                time: 1 //2秒后自动关闭
                            });
                        }
                    }
                });
            },
            // 点击领取按钮
            onReceive(item) {
                if (validateLogin()) {
                    // 判断在App内领取
                    if (item.receiveInsideApp == 1 && !isApp) {
                        this.couponModel = 'app';
                        return false;
                    }
                    // // 判断为特定用户。
                    if (item.receive == 2) {
                        // 判断为研究员用户
                        if (item.receiveUser == 2 && item.userIdentity == -1) {
                            this.couponModel = 'researcher';
                            return false;
                        } else if (item.receiveUser == 1 && item.isActive != 2) {
                            // 判断为认证用户
                            this.couponModel = 'authentication';
                            return false;
                        }
                    }
                    var post_data = {
                        userid: user.userid,
                        token: user.token,
                        params: {
                            couponProTemplateId: item.id
                        }
                    };


                    $.ajax({
                        type: 'POST',
                        data: toDataNew(post_data),
                        contentType: 'application/json;charset=utf-8',
                        async: true,
                        url: user.urlApp + '/master/couponPro/getCoupon/v510',
                        success: function (res) {
                            if (res.status.code == 200) {
                                item.useStatus = 1;
                                layer.open({
                                    content: '领取成功',
                                    skin: 'msg',
                                    anim: 'scale',
                                    time: 1 //2秒后自动关闭
                                });
                            } else {
                                layer.open({
                                    content: res.status.message,
                                    skin: 'msg',
                                    anim: 'scale',
                                    time: 1 //2秒后自动关闭
                                });
                            }

                        }
                    });
                }
            },
            // 查看备注
            showRemark(id) {
                // this.remarkId == id ? '' : (this.remarkId = id);
                if (this.remarkId == id) {
                    this.remarkId = ''
                } else {
                    this.remarkId = id
                }
            },
            // 显示优惠券弹窗
            onShowCouponModel() {
                this.showCouponModel = true
            },
            // 隐藏优惠券弹窗
            onHideCouponModel() {
                this.showCouponModel = false
            },
            // 可用商品
            useShop(item) {
                //availableBusiness  必有字段  备注：1:全平台通用 2:微课堂 3:直播 4:会议通知 5：行业数据 6：微课堂专题 7:直播间
                // availableBusinessSelect  1:全部通用 2:指定通用',
                // 全平台通用
                if (item.availableBusiness == 1) {
                    if (isApp) {
                        hyg.jsNative_openNativePage_appHome()
                    } else {
                        openAppUrl = '../share/download_app.html'
                        appAlert()
                    }
                } else if (item.availableBusiness == 2) {
                    // 微课堂
                    if (item.availableBusinessSelect == 2) {
                        if (isApp) {
                            hyg.jsNative_openWebPage({
                                isShowNav: 0,
                                url: getVersion() + 'microClass/couponlist.html?id=' + item.id, //是否显示原生头部，默认显示；isShowNav=1显示，isShowNav=false隐藏；
                            })
                        } else {
                            location.href = '../microClass/couponlist.html?id=' + item.id
                        }
                    } else {
                        if (isApp) {
                            hyg.jsNative_openNativePage_microClassroomHome()
                        } else {
                            // h5 打开微课堂首页
                            openAppUrl = '../share/download_app.html?type=microClassHome&params='
                            appAlert()
                        }
                    }
                } else if (item.availableBusiness == 3) {
                    // 直播
                    if (item.availableBusinessSelect == 2) {
                        if (isApp) {
                            hyg.jsNative_openWebPage({
                                isShowNav: 0,
                                url: getVersion() + 'live/couponlist.html?id=' + item.id, //是否显示原生头部，默认显示；isShowNav=1显示，isShowNav=false隐藏；
                            })
                        } else {
                            location.href = '../live/couponlist.html?id=' + item.id
                        }
                    } else {
                        if (isApp) {
                            hyg.jsNative_openNativePage_liveHome();
                        } else {
                            // h5 打开直播首页
                            openAppUrl = '../share/download_app.html?type=liveHome&params='
                            appAlert()
                        }
                    }
                } else if (item.availableBusiness == 4) {
                    // 会议通知
                    if (item.availableBusinessSelect == 2) {
                        if (isApp) {
                            hyg.jsNative_openWebPage({
                                isShowNav: 0,
                                url: getVersion() + 'meetingNotice/couponlist.html?id=' + item.id, //是否显示原生头部，默认显示；isShowNav=1显示，isShowNav=false隐藏；
                            })
                        } else {
                            location.href = '../meetingNotice/couponlist.html?id=' + item.id
                        }
                    } else {
                        if (isApp) {
                            hyg.jsNative_openWebPage({
                                isShowNav: 0,
                                url: getVersion() + 'meetingNotice/meetingIndex.html', //是否显示原生头部，默认显示；isShowNav=1显示，isShowNav=false隐藏；
                            })
                        } else {
                            // h5 打开会议通知首页
                            openAppUrl = '../share/download_app.html?type=h5link&params=meetingNotice/meetingIndex.html'
                            appAlert()
                        }
                    }
                } else if (item.availableBusiness == 5) {
                    // 行业数据
                    if (isApp) {
                        if (item.availableBusinessSelect == 2) {
                            hyg.jsNative_openNativePage_availableGoods({
                                id: item.id //优惠券id
                            })
                        } else {
                            hyg.jsNative_openNativePage_industryDataHome()
                        }
                    } else {
                        if (item.availableBusinessSelect == 2) {
                            openAppUrl = '../share/download_app.html?type=industryAvailableGoods&params=' + item.id
                            appAlert()
                        } else {
                            openAppUrl = '../share/download_app.html?type=industryHome'
                            appAlert()
                        }
                    }
                }
            },
            hideCouponModel() {
                this.couponModel = ''
            },
            onOpenApp() {
                openAppUrl = '../share/download_app.html?type=microClassDetails&params=' + data._id;
                this.downloadApp()
            },
            // 去认证
            onAuthentication() {
                if (isApp) {
                    hyg.jsNative_openNativePage_realNameAuthenticationInfo()
                } else {
                    location.href = '../share/download_app.html?type=authenticationInfo'
                }
            },
            onZhuanti() {
                if (this.courseDetail.traniedList.length == 1) {
                    window.location.href = './projectDetails.html?id=' + this.courseDetail.traniedList[0].id
                } else {
                    this.showZhuantiList = true
                    // $('.more_special_model').css('display', 'flex')
                }
            },
            // 跳转专题
            goZhuantiDetail(id) {
                window.location.href = './projectDetails.html?id=' + id;
            },
            // 点击目录播放
            playVideoItem(item) {
                // 判断播放时间大于0
                // 目的是：切换视频是更精准记录上一个视频播放时间
                if (_player.currentTime().toFixed(0) > 0) {
                    upDataWatchVideoTime(_player.currentTime().toFixed(0), parseInt(_player.duration()))
                }
                currentPlayVideoId = item.id;
                this.currentVideoId = currentPlayVideoId;
                lastWatchTime = item.watchTime;
                //  判断收费
                if (_tradeType == 1 && _ispay == 0) {
                    this.trySeeTime = item.trySee;
                    if (this.trySeeTime > 0) {
                        this.isShowTrySee = true;
                        _trySee = this.trySeeTime * 60;
                    } else {
                        _trySee = 0
                        this.isShowTrySee = false;
                    }
                }
                $('.share_icon').show();
                $('.share_icon_play').hide();
                $('.pause').addClass('shows');
                this.isTrySeeOver = false;
                initTcPlayer(this.courseDetail.image, item.url)
                setTimeout(() => {
                    App.playbackRate()
                    _player.play()
                }, 100)
            },
            getCommentNumber() {
                let _url = user.urlMedical + "/server_pro/video!request.action?";;
                let params = {
                    "method": "getReportCommentListV1",
                    "userid": user.userid,
                    "token": user.token,
                    "params": {
                        "id": data._id,
                        "currentPage": 1,
                        "countPerPage": 10,
                        "type": "2"
                    },
                    "identity": ""
                }
                _ajax("post", _url, params, true, function (res) {
                    data.commentNumber = res.result.amount;
                })
            },
            onDocument(url) {
                if (_tradeType && (!_ispay)) {
                    layer.open({
                        content: '请购买后查看课程资料',
                        skin: 'msg',
                        time: 20 //2秒后自动关闭
                    });
                    return false
                }
                location.href = url;
                layer.open({
                    content: '打开中，请稍后...',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
                return false;
            },
            // 图片放大事件
            previewImageEvent() {
                let _self = this;
                setTimeout(() => {
                    // 课程详情内图片
                    $(".detail_content img").each(function () {
                        let imgUrl = $(this).attr("src")
                        _self.imgArr.push(imgUrl.replace('https://', 'http://'));
                        $(this).css('max-width', '100%')
                        $(this).on('click', function (e) {
                            wx.previewImage({
                                current: $(this).attr("src").replace('https://', 'http://'), // 当前显示图片的http链接
                                urls: _self.imgArr // 需要预览的图片http链接列表
                            });
                        })
                    });
                    // 阻止a标签的默认事件
                    $(".detail_content a").each(function () {
                        this.addEventListener("click", function (e) {
                            e.preventDefault()
                            if (this.getAttribute('href')) {
                                location.href = this.getAttribute('href')
                                e.stopPropagation();
                            }
                        }, true);
                    });
                }, 2000)
            },
        }
    });
}

function initTcPlayer(headImage, videoFile) {
    if (videoFile) {
        if (location.href.indexOf('https://') == 0) {
            videoFile = videoFile.replace('http://', 'https://');
        }
        if (location.href.indexOf('http://') == 0) {
            videoFile = videoFile.replace('https://', 'http://');
        }
    }
    isFirst = true;
    if (_player) {
        _player.destroy();
        $('#player').html('')
    }
    var w = document.body.clientWidth;
    var h = w / (16 / 9);
    $('.playerBox').css('width', w)
    $('.playerBox').css('height', h)
    $('.pause').css('background-image', 'url(' + headImage + ')')
    // $('#player').html('')
    // $(".live-container").height(h);
    _player = new TcPlayer("player", {
        m3u8: videoFile || "0", //请替换成实际可用的播放地址
        mp4: videoFile || "0",
        live: false, //是否是直播
        autoplay: false,
        poster: {
            style: "stretch",
            src: headImage,
        },
        width: w, //视频的显示宽度，请尽量使用视频分辨率宽度
        height: h, //视频的显示高度，请尽量使用视频分辨率高度
        // controls: "system",
        // volume: 0.5,
        flash: false,
        h5_flv: false,
        x5_player: false,
        x5_playsinline: "true",
        // x5_type: 'h5',
        // x5_fullscreen: false,
        wording: {
            2032: "请求视频失败，请检查网络",
            2048: "请求m3u8文件失败，可能是网络错误或者跨域问题",
        },
        pausePosterEnabled: true,
        listener: function (msg) {
            switch (msg.type) {
                case "loadeddata":
                    // _player.currentTime(lastWatchTime);
                    break;
                case "play":
                    // 判断是否在App中观看
                    if (data.courseData.limitInapp) {
                        openAppUrl = '../share/download_app.html?type=microClassDetails&params=' + data._id;
                        appTip();
                        _player.pause();
                        return false
                    } else if (data.courseData.limitLogin) {
                        // 判断是需要登录观看
                        if (!user.userid) {
                            //弹层风格
                            layer.open({
                                shadeClose: false,
                                content: '该课程需要登录才能查看完整内容',
                                btn: ['确定'],
                                yes: function () {
                                    validateLogin()
                                }
                            });
                            _player.pause();
                            return false
                        }
                    }
                    // 已经开始播放，调用 play() 方法或者设置了 autoplay 为 true 且生效时触发，这时 paused 属性为 false。
                    $('.share_icon_play').show();
                    $('.share_icon').hide();
                    //收费视频并且没有购买，当不提供试看时，提示付费观看
                    if (_tradeType == 1 && _ispay == 0) {
                        if (_trySee > 0) {
                            if (_player.currentTime().toFixed(0) >= parseInt(_trySee)) {
                                _player.pause();
                                $('.pause').addClass('shows')
                                $('#player').css('display', 'none')
                            }
                        } else if (_trySee <= 0) {

                            App.onBuy();
                            _player.pause();
                        }
                    }
                    if (isFirst) {
                        setTimeout(() => {
                            _player.currentTime(lastWatchTime);
                        }, 1000)
                        isFirst = false;
                    }
                    break;
                case "seeked":
                    break;
                case "pause":
                    // 暂停

                    $('.share_icon').show();
                    $('.share_icon_play').hide();
                    $('.pause').addClass('shows');
                    // 判读试看结束，不显示播放按钮
                    if (data.isTrySeeOver) {
                        $('.pause img').hide()
                    }
                    // 判断为收费视频并且有试看
                    if (_tradeType == 1 && _ispay == 0 && _trySee > 0) {
                        data.isShowTrySee = true;
                    }
                    upDataWatchVideoTime(_player.currentTime().toFixed(0), parseInt(_player.duration()))
                    break;
                case "playing":
                    // 因缓冲而暂停或停止后恢复播放时触发，paused 属性为 false 。通常用这个事件来标记视频真正播放，play 事件只是开始播放，画面并没有开始渲染。

                    // 判断是否在App中观看
                    if (data.courseData.limitInapp) {
                        openAppUrl = '../share/download_app.html?type=microClassDetails&params=' + data._id;
                        appTip();
                        _player.pause();
                    } else if (data.courseData.limitLogin) {
                        // 判断是需要登录观看
                        if (!user.userid) {
                            //弹层风格
                            layer.open({
                                shadeClose: false,
                                content: '该课程需要登录才能查看完整内容',
                                btn: ['确定'],
                                yes: function () {
                                    validateLogin()
                                }
                            });
                            _player.pause();
                        }
                    }
                    $('.pause').removeClass('shows')
                    if (_tradeType == 1 && _ispay == 0) {
                        if (_trySee > 0) {
                            if (_player.currentTime().toFixed(0) >= parseInt(_trySee)) {
                                _player.pause();
                                $('.pause').addClass('shows')
                                $('#player').css('display', 'none')
                            }
                        } else if (_trySee <= 0) {
                            _player.pause();
                            $('.pause').addClass('shows')
                            appAlertPay();
                        }
                    }
                    break;
                case "timeupdate":
                    // 播放中

                    data.isShowTrySee = false;
                    if (_tradeType == 1 && _ispay == 0) {
                        if (_trySee > 0) {
                            if (_player.currentTime().toFixed(0) >= parseInt(_trySee)) {
                                _player.pause();
                                data.isTrySeeOver = true;
                                $('#player').css('display', 'none')
                            }
                        } else if (_trySee <= 0) {
                            _player.pause();
                            $('.pause').addClass('shows')
                            appAlertPay();
                        }
                    }
                    if (flg) {
                        return false
                    }
                    flg = true
                    setTimeout(function () {
                        upDataWatchVideoTime(_player.currentTime().toFixed(0), parseInt(_player.duration()))
                        flg = false
                    }, 10000);
                    break;
                case "ended":
                    // 视频停止触发
                    upDataWatchVideoTime(0, parseInt(_player.duration()));
                    _player.currentTime(0);
                    let courseIndex = data.courseData.videoSubList.findIndex(item => {
                        return item.id == currentPlayVideoId
                    })
                    let nextItem = data.courseData.videoSubList[courseIndex + 1]
                    if (nextItem) {
                        layer.open({
                            content: '即将播放 ' + nextItem.title,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        setTimeout(() => {
                            App.playVideoItem(nextItem)
                        })
                    }
                    break;
                case "error":
                    // console.log(msg)
                    layer.open({
                        content: '视频播放错误，请刷新页面',
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    break;
            }
        },
    });

    $('.pause').click(function () {
        _player.play()
        $('.pause').removeClass('shows')
    })
}

function appAlert() {
    //弹层风格
    layer.open({
        shadeClose: false,
        content: '更多精彩，请下载好医工App。',
        btn: ['确定', '取消'],
        yes: function () {
            App.downloadApp()
        }
    });
}

function validateLogin() {
    if (user.userid == null || user.userid == "null" || user.userid == "") {
        if (isApp) {
            openLoginPage();
        } else {
            location.href = "../login/login.html?backurl=" + location.href;
        }
        return false;
    } else {
        return true;
    }
}

function upDataWatchVideoTime(watchTiem, videoTiem) {
    let courseItem = data.courseData.videoSubList.find(item => {
        return item.id == currentPlayVideoId
    })
    courseItem.watchTime = watchTiem;
    let _url = user.urlMedical + "/server_pro/video!request.action?";
    let params = {
        "method": "saveWatchRecord",
        "userid": user.userid,
        "token": user.token,
        "params": {
            "videoSubId": currentPlayVideoId,
            "watchTime": watchTiem,
            "totalTime": videoTiem
        }
    }
    _ajax("post", _url, params, true, function (res) {

    })
}

// 提问初始化上拉方法
function initDropload() {
    if (commentDropload) {
        return false;
    }
    commentDropload = $('#question').dropload({
        domUp: {
            domClass: 'dropload-up',
            domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
            domUpdate: '<div class="dropload-update">↑释放更新</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData: '<div class="dropload-noData">暂无数据</div>'
        },
        loadUpFn: function (me) {
            // me.unlock();
            // me.noData(false);
            let _url = user.urlMedical + "/server_pro/video!request.action?";;
            let params = {
                "method": "getReportCommentListV1",
                "userid": user.userid,
                "token": user.token,
                "params": {
                    "id": data._id,
                    "currentPage": 1,
                    "countPerPage": 10,
                    "type": "2"
                },
                "identity": ""
            }
            _ajax("post", _url, params, true, function (res) {
                data.page = 2;
                data.commentNumber = res.result.amount;
                if (res.result.commentList.length) {
                    data.commentList = res.result.commentList;
                    // 每次数据加载完，必须重置
                    setTimeout(() => {
                        me.resetload();
                        // 解锁loadDownFn里锁定的情况
                        me.unlock();
                        me.noData(false);
                    }, 500);

                } else {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                    me.resetload();
                }
            })
        },
        loadDownFn: function (me) {
            let _url = user.urlMedical + "/server_pro/video!request.action?";;
            let params = {
                "method": "getReportCommentListV1",
                "userid": user.userid,
                "token": user.token,
                "params": {
                    "id": data._id,
                    "currentPage": data.page,
                    "countPerPage": 10,
                    "type": "2"
                },
                "identity": ""
            }
            _ajax("post", _url, params, true, function (res) {
                data.page++;
                data.commentNumber = res.result.amount;
                if (res.result.commentList.length) {
                    data.commentList = data.commentList.concat(res.result.commentList);
                    data.commentNumber = res.result.amount;
                    // 每次数据加载完，必须重置
                    setTimeout(() => {
                        me.resetload();
                    }, 500)
                } else {
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                    me.resetload();
                }
            })
        }
    });
}

function wxconfig() {
    let courseTitle = data.courseDetail.title;
    let __desc = "欢迎下载好医工APP--微课堂模块进行查看相关视频。如已下载好医工APP，请直接从手机打开观看。";
    let _img = data.courseDetail.image;
    //二次分享
    var weixinURL = user.urlMedical + '/server_pro/sign!request.action';
    var weixinConfig = {
        "method": "connectStr",
        "userid": "0",
        "token": "",
        "params": {
            "url": location.href.split('#')[0]
        }
    };
    $.ajax({
        type: 'POST',
        async: true,
        data: toData(weixinConfig),
        dataType: "text",
        url: weixinURL,
        success: function (data) {
            var newData = JSON.parse(data);
            if (newData.status.code == 200) {
                wx.config({
                    debug: false,
                    appId: "wx05b2feaff085fe9c",
                    timestamp: newData.result.timestamp,
                    nonceStr: newData.result.nonce_str,
                    signature: newData.result.signature,
                    jsApiList: [
                        "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareQZone", "previewImage"
                    ]
                });
            }
        }
    });

    if (data._id == 1790) {
        __desc = "北京市海淀医院北医三院海淀院区，张晓蓉教授";
    }
    if (data._id == 1781) {
        __desc = "郑州大学第一附属医院，贺晓博士";
    }
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: courseTitle, // 分享标题
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: _img, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareAppMessage({
            title: courseTitle, // 分享标题
            desc: __desc, //(_desc.substring(0,20) + "..."), // 分享描述
            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: _img, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQQ({
            title: courseTitle, // 分享标题
            desc: __desc, //(_desc.substring(0,20) + "..."), // 分享描述
            link: location.href, // 分享链接
            imgUrl: _img, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareQZone({
            title: courseTitle, // 分享标题
            desc: __desc, //(_desc.substring(0,20) + "..."), // 分享描述
            link: location.href, // 分享链接
            imgUrl: _img, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

    });
}

// 通过openid获取用户信息
function getUserByOpenid() {
    let loginData = {
        "userid": "",
        "method": "getUserByOpenid",
        "params": {
            "openid": getCookie('_openid'),
        },
        "token": ""
    };
    var codeUrl = user.urlBrand + "/server/user!request.action";
    _ajax('post', codeUrl, loginData, false, function (data) {
        if (data.status.code == 200) {
            if (data.result.id) {
                var userId = data.result.id;
                setCookie("g_userid", userId, 2400);
                window.location.reload()
            }
        } else {
            alert('获取信息失败！')
        }
    })
}

function initOpenid() {
    var _openid = getCookie("_openid");
    var wxhref = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05b2feaff085fe9c&redirect_uri=" + (location.href.split("?")[0] + ("?id=" + getQueryString("id"))) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
    // var wxhref = location.href.split("?")[0] + ("?id=" + _id);
    if (!_openid) {
        _code = getQueryString("code");
        if (!_code) {
            $(".fixeds").showLoading();
            location.href = wxhref;
        } else {
            $(".fixeds").showLoading();
            var url = user.urlGod + '/server_pay/weixinAuth!request.action';
            var params = {
                "method": "getwxOpenId",
                "userid": user.userid,
                "token": "",
                "params": {
                    "code": _code
                }
            };
            $.ajax({
                type: 'POST',
                async: true,
                data: toData(params),
                dataType: "text",
                url: url,
                success: function (data) {
                    $(".fixeds").hideLoading();
                    var data = JSON.parse(data);
                    _openid = data.result.openid;
                    if (_openid) {
                        setCookie("_openid", _openid, 240);
                        getUserByOpenid()
                    } else {
                        location.href = wxhref;
                        return;
                    }
                }
            });
        }
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function appTip() {
    //弹层风格
    layer.open({
        shadeClose: false,
        content: '该课程需在好医工App内才能查看完整内容',
        btn: ['确定'],
        yes: function () {
            App.downloadApp()
        }
    });
}