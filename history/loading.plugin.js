$(function() {

    var str = '<div class="fixeds loading" style="display: none;">\
    <div class="spinner">\
        <div class="spinner-container container1">\
            <div class="circle1"></div>\
            <div class="circle2"></div>\
            <div class="circle3"></div>\
            <div class="circle4"></div>\
        </div>\
        <div class="spinner-container container2">\
            <div class="circle1"></div>\
            <div class="circle2"></div>\
            <div class="circle3"></div>\
            <div class="circle4"></div>\
        </div>\
        <div class="spinner-container container3">\
            <div class="circle1"></div>\
            <div class="circle2"></div>\
            <div class="circle3"></div>\
            <div class="circle4"></div>\
        </div>\
    </div>\
</div>';

    $("body").append(str);

})

;
(function($) {
    $.fn.extend({
        showLoading: function(opts) {
            // console.log(this)
            this.show();
            return this;
        },
        hideLoading: function(opts) {
            $(this).hide();
            return this;
        }
    })
})(window.jQuery)