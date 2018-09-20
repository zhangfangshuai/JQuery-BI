/**
 * Created: dameng by webstorm
 * Date: 2017/11/16 11:46
 * Update: zhangfs by Atom
 * Date: 2018/04/24 15:32
 */
$('.box').css({'height':$(window).height()});
window.onload = function () {
   document.addEventListener('touchstart', function(event) {
       if (event.touches.length > 1){
           event.preventDefault();
       }
   }, false)
   var lastTouchEnd = 0;
   document.addEventListener('touchend',function (event) {
       var now = (new Date()).getTime();
       if (now - lastTouchEnd <= 300){
           event.preventDefault();
       }
       lastTouchEnd = now;
   },false)
};


$(function () {
    // reportEntry();
    if(localStorage.user && localStorage.password){
        $('.userName').val(localStorage.user);
        $('.wordsName').val(localStorage.password);
    }

    $('.loginBtn').on('click', function(){
        if(!$('.userName').val()){
            Tip.success('请输入用户名');
            return false;
        };
        if(!$('.wordsName').val()){
            Tip.success('请输入密码');
            return false;
        };
        $.ajax({
            url:http + 'mobile/loginOn',
            type: 'get',
            dataType: 'json',
            data: {
                username:$('.userName').val(),
                password:$('.wordsName').val()
            },
            success: function(res) {
                if (res.code == 200) {
                    localStorage.user = $('.userName').val();
                    localStorage.password = $('.wordsName').val();
                    sessionStorage.token = res.data.token;
                    sessionStorage.nickname = res.data.nickname;
                    sessionStorage.adminId = res.data.adminId;
                    $.ajax({
                        url: http+'/mobile/getMenu',
                        type: 'get',
                        dataType: 'json',
                        data:{
                            token:sessionStorage.token
                        },
                        success: function(res) {
                            if (res.code == 200 || res.code == 201) {
                                res.code == 201 && Tip.success('密码到期，请及时修改');
                                if (res.data.length == 0) {
                                    Tip.success('您没有访问权限');
                                    // reportEvent(localStorage.user + ' 没有访问权限');
                                    return;
                                }
                                for (let d of res.data) {
                                    for (let m of menuConfig) {
                                        if (d.menuId == m.id) {
                                            sessionStorage.page = m.page;
                                            // reportLeave();
                                            window.location.href = './html/' + m.page + '.html?v=' + version;
                                            return;
                                        }
                                    }
                                }
                                Tip.success('您没有访问权限');
                            }

                            // 用户埋点数据收集
                            try {
                                sessionStorage.entryTime = new Date().toISOString();
                                sessionStorage.ip = returnCitySN.cip;
                                sessionStorage.address = returnCitySN.cname;
                                sessionStorage.platform = window.navigator.platform;
                                var md = new MobileDetect(window.navigator.userAgent);
                                sessionStorage.device = md.mobile() +'-'+ md.os();
                            } catch (e) {
                                console.log(e);
                                Tip.success(e);
                                // reportEvent('登录失败');
                            }
                        },
                        error: function(res) {
                            console.log(res);
                        }
                    });
                } else {
                    Tip.success(res.desc)
                }
            },
            error: function(res) {
                console.log(res, '失败');
            }
        });
    })
})
