window.commonObj = {
    checkMobile : function (tel){ //手机号检查
      if(!(/^1\d{10}$/.test(tel))){
      // if(!(/^((1[35678]{1})+\d{9})$/.test(tel))){

        // alert("请输入正确的手机号码");
        return false;
      }else{
        return true;
      }
    },
    countDown : function(time,cb){
        cb(time)
        var timer = setInterval(function(){
            time--;
            cb(time)
            if(time<=0){
                clearInterval(timer)
                cb()
            }
        }, 1000)
    }
}
// sendCode({

// })
/* FUNCTION sendCode
** 基于jquery 2.0.3
** 依赖 https://img.shouqiev.com/h5/libs/common.js 中commonObj
** options = {
**      this:               //@request--发送验证码被点击的按钮的dom元素
**      url:                //@request--发送验证码请求的url
**      img_dom:            //@request--图片验证码对应的img标签的dom元素
** }
** var sendCode = SendCode(options)
** sendCode.getCode(sim@request--需要被发验证码的手机号,img_code@request--用户输入的图片验证码的value)
*/
function sendCode(options){
    this._this = options.this;
    $(this._this).html("获取验证码");$(this._this).val("获取验证码");
    this.needImgCode = false;
    this.ajax_url = options.url;
    this.data = {
        sim:options.sim,
        isPic:"n"
    }
    this.init = function(){
    }
    this.msgCountDown = function(resTime){
        commonObj.countDown(resTime,function(time){
            if(!time){
                $(this._this).val("获取验证码");$(this._this).html("获取验证码");
            } else {
                $(this._this).val(time+"秒后获取");$(this._this).html(time+"秒后获取");
            }
        })
    }
    this.getCode = function(sim,img_code){
        this.data.sim = sim;
        this.data.picCode = img_code;
        if(this.needImgCode){
            if(!this.data.picCode){
                alert("请输入图片验证码");
                return false;
            }
            this.data.isPic = "y";
        }
        if( ($(this._this).val() || $(this._this).html() )=="获取验证码"&&commonObj.checkMobile( this.data.sim )){
            $.ajax({
                url:"http://testapi30.shouqiev.com/app/updateSim/smsCodeV1.json",
                url: this.ajax_url,
                type:"GET",
                data: this.data,
                success:function(res){
                    if(res.code==200){
                        alert("发送成功")
                        msgCountDown(res.modelData.second)
                    } else if(res.code==3202){//操作过于频繁
                        msgCountDown(res.modelData.second)
                    } else if(res.code==3203){//缺少图片验证码
                        $(options.img_dom).attr('src','https://testapi30.shouqiev.com/app/updateSim/getPicCode.json?updateCode=0')
                        this.needImgCode = true;
                        $(options.img_dom).parent().show();//图片验证码的dom元素必须是需要被控制显示隐藏的dom元素的直接子元素
                    } else if(res.code==2100){
                        alert(res.desc)
                    } else {
                        alert(res.code+"---"+res.desc)
                    }
                }
            })
        }else{
            console.log("禁止点击")
        }
    }
}



// try{
//     shareTool.addShareAbility(shareMsg.title,shareMsg.desc,document.URL,shareMsg.img);
//     if (/Android (\d+\.\d+)/.test(navigator.userAgent)){
//         window.share.addShareBtn(shareMsg.title,shareMsg.desc,document.URL);
//     } else {
//         window.share.showShareNavWithTitleDescLink(shareMsg.title,shareMsg.desc,document.URL);
//     }
// }
// catch(err)
// {
//   txt = "此页面存在一个错误。\n"
//   txt += "错误描述: " + err + "\n\n"
//   console.info(txt)
// }



function isPc(){
    var ua = navigator.userAgent
    function isWap(value){
        return ua.match(value)
    }
    if( ua.match(/Android/i) || ua.match(/webOS/i) || ua.match(/iPhone/i) || ua.match(/iPad/i) || ua.match(/iPod/i) || ua.match(/BlackBerry/i) || ua.match(/Windows Phone/i) ){
        console.log('移动端');
        return false;
    }else{
        console.log('pc端');
        return true;
    }
}
// <!--友盟-->
// var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan style='display:none;'  id='cnzz_stat_icon_1263880670'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s22.cnzz.com/z_stat.php%3Fid%3D1264647065' type='text/javascript'%3E%3C/script%3E"));

// 百度统计
// var _hmt = _hmt || [];
// (function() {
//   var hm = document.createElement("script");
//   hm.src = "https://hm.baidu.com/hm.js?93a9e137393fca3dd0fcf57a44be5bbc";
//   var s = document.getElementsByTagName("script")[0];
//   s.parentNode.insertBefore(hm, s);
// })();



//Depends on jQuery 放在</body>前
//弹窗1
//具有半透背景的居中固定弹窗；具有标题，内容，和按钮（按钮可选单按钮或者双按钮）三部分；其中内容（content）与主按钮（mainBtn）为必填数据，其余均为选填。按钮均有回调函数，用法如下：
// Tip.popups({                //固定弹窗
//     'title':'标题',           //弹窗标题
//     'content':'内容',         //弹窗内容
//     'leftBtn':'左按钮文字',      //弹窗左侧按钮文字，左侧按钮非必填
//     'mainBtn':'主按钮文字',      //主按钮文字
//     'leftBtnColor':'',          //左侧按钮字体颜色
//     'rightBtnColor':'',          //右侧按钮字体颜色
//     'leftBtnCb':function(){     //辅助按钮回调函数
//
//     },
//     'mainCb':function(){           //主按钮回调函数
//     }
// });
//弹窗2
//居中显示，两秒后消失的tip弹窗。用法如下：
// Tip.success('弹窗内容')
//弹窗3 depends on gofun-loading.css
    // loading   有布满屏幕透明背景，loading动画和内容的弹窗 三个方法
//a   生成弹窗
    // Tip.addLoading({
    //     txt: '2张照片'  //弹窗内容
    // });
//b   改变弹窗内容
    // Tip.changeLoading({
    //     txt: '4张照片'
    // })
//c 清除弹窗
    //Tip.removeLoading()
function GlobalTip(config){
    this.timeout = (config&&config.timeout)||2000;
    this.hasInit = false;
    this.$tipEle = $("<p style='z-index: 9999;word-break:break-all;max-width: 7rem;min-height:1.067rem;color:white;font-size:0.373rem;padding:0.32rem 0.72rem;position:fixed;top:40%;left:50%;-webkit-transform: translate(-50%);-ms-transform: translate(-50%);transform: translate(-50%);background:rgba(46,55,53,0.90);border-radius: 0.133rem;-webkit-box-shadow: 0 0.053rem 0.08rem 0 rgba(66,75,71,0.20);-moz-box-shadow: 0 0.053rem 0.08rem 0 rgba(66,75,71,0.20);box-shadow: 0 0.053rem 0.08rem 0 rgba(66,75,71,0.20);-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;text-align: center;'><i class='icon icon-tipright' style='vertical-align:middle;margin-right:10px;text-align: center'></i><span></span></p></p>");
    this.tip=$('<div style="position: fixed;left: 0;top: 0;right: 0;bottom: 0;background-color: rgba(0,0,0,0.40);z-index: 9999;" id="doubleAlert">\n' +
        '\t<div style="position: absolute;left: 50%;top: 50%;width: 7.467rem;-webkit-transform: translateX(-50%) translateY(-50%);-moz-transform: translateX(-50%) translateY(-50%);-ms-transform: translateX(-50%) translateY(-50%);-o-transform: translateX(-50%) translateY(-50%);transform: translateX(-50%) translateY(-50%);background: #FFFFFF;-webkit-box-shadow:  0 0.053rem 0.133rem 0 rgba(0,0,0,0.10);-moz-box-shadow:  0 0.053rem 0.133rem 0 rgba(0,0,0,0.10);box-shadow:  0 0.053rem 0.133rem 0 rgba(0,0,0,0.10);-webkit-border-radius: 0.133rem;-moz-border-radius: 0.133rem;border-radius: 0.133rem;">\n' +
        '\t\t<h2 class="tipTitle" style="font-size: 0.4rem;color: #696969;letter-spacing: 0;width: 100%;\n' +
        '\t\theight: 1.067rem;padding-top: 0.4rem;text-align: center;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"></h2>\n' +
        '\t\t<p class="tipContent" style="width: 5.973rem;margin:0 auto;font-size: 0.373rem;color: #AAAAAA;\n' +
        'line-height: 0.533rem;padding: 0.373rem 0;word-break:break-all;"></p>\n' +
        '\t\t<div class="tipBtn" style="width: 100%;border: 0.027rem solid #FAFAFA;height: 1.173rem;text-align: center;line-height: 1.173rem;color: #0DB95F;font-size: 0.373rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;-webkit-border-radius: 0 0 0.133rem 0.133rem;-moz-border-radius: 0 0 0.133rem 0.133rem;border-radius:0 0 0.133rem 0.133rem;display: flex;">\n' +
        '            <div class="tipBtn1" style="height: 100%;border-right: 0.027rem solid #FAFAFA;height: 1.1rem;text-align: center;line-height: 1.17rem;color: #0DB95F;font-size: 0.373rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;flex: 1"></div>\n' +
        '            <div class="tipBtn2" style="height: 100%;height: 1.1rem;text-align: center;line-height: 1.1rem;color: #0DB95F;font-size: 0.373rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;flex: 1;"></div>\n' +
        '        </div>\n' +
        '\t</div>\n' +
        '</div>');
    this.loading=$('<div class="lodingbg-gofun clearfix">\n' +
            '    <div class="loading-gofun clearfix">\n' +
            '        <div class="loadingL-gofun clearfix">\n' +
            '            <div class="sk-fading-circle">\n' +
            '                <div class="sk-circle sk-circle1"></div>\n' +
            '                <div class="sk-circle sk-circle2"></div>\n' +
            '                <div class="sk-circle sk-circle3"></div>\n' +
            '                <div class="sk-circle sk-circle4"></div>\n' +
            '                <div class="sk-circle sk-circle5"></div>\n' +
            '                <div class="sk-circle sk-circle6"></div>\n' +
            '                <div class="sk-circle sk-circle7"></div>\n' +
            '                <div class="sk-circle sk-circle8"></div>\n' +
            '                <div class="sk-circle sk-circle9"></div>\n' +
            '                <div class="sk-circle sk-circle10"></div>\n' +
            '                <div class="sk-circle sk-circle11"></div>\n' +
            '                <div class="sk-circle sk-circle12"></div>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <p id="londingtxt" class="clearfix">12阿瑟费噶1122阿瑟</p>\n' +
            '    </div>\n' +
            '</div>');
}

var Tip = new GlobalTip();
GlobalTip.prototype.initDom=function(){
    $('body').append(this.$tipEle);
    this.hasInit = true;
};
GlobalTip.prototype.showTip=function(type, msg){
    if(!this.hasInit){
        this.initDom();
    }
    var icon_class = "icon icon-tipright";
    if(type=="error"){
        icon_class = "icon icon-tipwarn";
    }
    this.$tipEle.stop(true).fadeIn().delay(this.timeout).fadeOut().find("span").text(msg).end().find(".icon").attr("class", icon_class);
};
GlobalTip.prototype.success = function(msg){
    this.showTip("success", msg);
};
GlobalTip.prototype.error = function(msg){
    this.showTip("error", msg);
};
GlobalTip.prototype.popups=function(obj){

    $('body').append(this.tip);
    if(obj.title){
        this.tip.find('.tipTitle').show().html(obj.title);
    }else{
        this.tip.find('.tipTitle').hide();
    }
    this.tip.find('.tipContent').html(obj.content);
    if(obj.leftBtn){
        this.tip.find('.tipBtn1').show().html(obj.leftBtn);
        if(obj.leftBtnColor){
            this.tip.find('.tipBtn1').css({'color':obj.leftBtnColor})
        }
        this.tip.find('.tipBtn1').on('click',function(){
            if(obj.leftBtnCb){
                obj.leftBtnCb()
            }
            $('#doubleAlert').remove();
        });
    }else{
        this.tip.find('.tipBtn1').hide();
    }
    this.tip.find('.tipBtn2').html(obj.mainBtn);
    if(obj.rightBtnColor){
        this.tip.find('.tipBtn2').css({'color':obj.rightBtnColor})
    }
    this.tip.find('.tipBtn2').on('click',function(){
        if(obj.mainCb){
            obj.mainCb()
        }
        $('#doubleAlert').remove();
    });
};
GlobalTip.prototype.addLoading=function(obj){
    $('body').append(this.loading);
    this.loading.find('#londingtxt').html(obj.txt)
};
GlobalTip.prototype.changeLoading=function(obj){
    this.loading.find('#londingtxt').html(obj.txt)
};
GlobalTip.prototype.removeLoading=function(obj){
    $('body').find(this.loading).remove();
};



// function checkMobile(e){ //手机号检查
//   var sMobile = $("#cellphone").val();
//   if(!(/^((1[35678]{1})+\d{9})$/.test(sMobile))){
//     alert("请输入正确的手机号码");
//     $("#cellphone").focus().val("");
//     return false;
//   }else{
//     var url ='/activity/2015/leshi/index.php';
//     var data1 = {cellphone:sMobile};
//     $.get(url,data1,function(data){
//       if(data.code == 200){
//         alert('成功参与活动，请注意查收乐码短信');
//       }else{
//         alert(data.msg)
//       }
//     },'json');
//   }
// }


// $("#cellphone").each(function(index, el) {//手机号码输入框提示文字  placeholder
//   var _this = $(this);
//   var text = _this.val();
//   _this.focusin(function(event) {
//     if(_this.val() == text){
//       _this.val("");
//     }
//   }).focusout(function(event) {
//     if(_this.val() == ""){
//       _this.val(text);
//     }
//   });
// });



// function getCookie(name){
//     var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
//     if(arr=document.cookie.match(reg)){
//         return unescape(arr[2]);
//     }
//     else {
//         return null;
//     }
// }

// function setCookie(name, value){
//     var argv = setCookie.arguments;
//     var argc = setCookie.arguments.length;
//     var expires = (argc > 2) ? argv[2] : null;
//     if(expires!=null){
//         var LargeExpDate = new Date ();
//         LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
//     }
//     document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()));
// }




// // 验证身份证号是否合法
// function check(id){
//     var id = String(id),
//         $WS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
//         $_modMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],
//         $sum = 0;
//     var $id_17 = id.substring(0,17);
//     var $id_last = id.substring(17,18);
//     var $len_WS = $WS.length;
//     for (var i = 0; i < $len_WS; i++) {
//         $sum = $sum + $id_17[i]*$WS[i];
//         console.log($sum+"--------"+i);
//     };
//     var last_num = $sum%11;ba
//     console.log(last_num);
//     console.log($_modMap[last_num]);
//     console.log($id_last);
// }
// // check("362226199001102113");


// function addLoadEvent(func) { // 解决多个window.onload问题
//   var oldonload = window.onload;
//   if (typeof window.onload != 'function') {
//    window.onload = func;
//   } else {
//     window.onload = function() {
//       oldonload();
//       func();
//      }
//   }
// }

// function $(dom){
//   // document.querySelector(dom).css = function(json){
//   //   for(var name in json){
//   //     this.style[name] = json[name];
//   //   }
//   // }
//   return document.querySelectorAll(dom);
// }


// function addEvent(elm, evType, fn, useCapture) {
//     if (elm.addEventListener) {
//         elm.addEventListener(evType, fn, useCapture); //DOM2.0
//         return true;
//     } else if (elm.attachEvent) {
//         var r = elm.attachEvent("on" + evType, fn); //IE5+
//         return r;
//     } else {
//         elm['on' + evType] = fn; //DOM 0
//     }
// }
