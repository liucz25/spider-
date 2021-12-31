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
        _ajax("post", _url, _data, true, function(res) {
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
                setTimeout(() => {
                    App.playbackRate()
                }, 500)
            } else {
                alert(res.status.message)
            }
        })