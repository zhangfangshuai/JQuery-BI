/**
 * Created: zhangfs by Atom
 * Date: 2018/05/12 09;30
 * Func: REM布局
 */
// (function(doc, win) {
//     var docEl = doc.documentElement,
//         resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//         recalc = function() {
//             var clientWidth = docEl.clientWidth
//             if (!clientWidth) return
//             docEl.style.fontSize = 108 * (clientWidth / 1080) + 'px'
//         }
//     win.addEventListener(resizeEvt, recalc, false)
//     if (!doc.addEventListener) return
//     doc.addEventListener('DOMContentLoaded', recalc, false)
// })(document, window);


/**
 * Author: zhangfs by Atom
 * Func: 获取选中日期周几
 * Params: 控件后面的采数字
 */
window.onload = function () {
    $('.slideBar').css({'height': '100vh'});
    $('.slideBarBg').css({'height': '100vh'});
    $('body, html').css({'height': '100vh'});
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

// 页面重载
window.onresize = function(){
    $('.slideBar').css({'height':$(window).height()});
    $('.slideBarBg').css({'height':$(window).height()});
}


// 判断是否支持百度地图（canvas绘图）
function isSupportCanvas(){
    var El = document.createElement('canvas');
    return !! (El.getContext && El.getContext('2d'));
}


/**
 * Created: zhangfs by Atom
 * Date: 2018/04/23 20:28
 * Func: 用户目录生成器
 */
APP.html != 'index' && APP.html != '' && menuMaker();
function menuMaker() {
    sessionStorage.page = sessionStorage.page || menuConfig[0].page;
    buildAjax('get', 'getMenu', {}, false, false, function(res) {
       if (res.data && res.data.length != 0) {
          let slideUser = "<div class='slideUser'> <div></div> <div>"+ sessionStorage.nickname +"</div> </div>"
          let userMenu = "<div class='slideMenu'> <ul> "
          for (let m of menuConfig) {
              for(let d of res.data) {
                  if (d.menuId == m.id) {
                      let active = sessionStorage.page == m.page ? 'active' : '';
                      userMenu += "<li class='"+ m.class +"' data-menuId='"+ m.id +"' data-value='"+ m.page +"'>" +
                      "<span class='"+ active +"'></span> <p class='"+ active +"'>"+ m.name +"</p> </li>";
                      break;
                  }
              }
          }
          userMenu += " </ul> </div> <a onclick='logout()' href='../index.html'>退出登陆</a>";
          let slideBar = document.createElement("div");
          slideBar.className = "slideBar";
          slideBar.innerHTML = slideUser + userMenu;
          $(document.body).prepend(slideBar);
          let slideBarBg = document.createElement("div");
          slideBarBg.className  = "slideBarBg";
          $(document.body).prepend(slideBarBg);
       }
    })
}

function logout() {
    delete localStorage.sessionCity;
}



/**
 * Create: zhangfs by Atom
 * Date: 2018/04/24 12:08
 * Func: 路由控制
 * Note: 函数执行在事件流的冒泡阶段，因此必须定义在目录创建之后
 */
$.each($('.slideMenu>ul>li'),function(i,e){
    $(this).on('click',function(){
        $('.slideMenu>ul>li').removeClass('active');
        $(this).addClass('active');
        // 除实时监控外，其他页面点击本页面不重载
        if (sessionStorage.page != menuConfig[0].page && sessionStorage.page == $(this).attr('data-value')) {
            $('.slideBarBg').fadeOut();
            $('.slideBar').stop().animate({'left':'-4.93rem'})
            return;
        }
        sessionStorage.page = $(this).attr('data-value');
        window.location.href='../html/'+$(this).attr('data-value')+'.html?v=' + version;   //  + '&r=' + Math.random().toFixed(5)
    });
});




/**
 * Created: zhangfs by Atom
 * Date: 2018/04/23 10:20
 * Func: 用户目录信息控制 及目录显示隐藏
 */
$('.slideBtn').on('click',function() {
    $('.slideBarBg').fadeIn();
    $('.slideBar').stop().animate({'left':0});
});
/* Func: 点击空白处隐藏 */
$('.slideBarBg').on('click',function(){
    $(this).fadeOut();
    $('.slideBar').stop().animate({'left':'-4.93rem'});
});





/**
 * Author: zhangfs by Atom
 * Date: 2018/04/09 18:50
 * Func: Ajax请求构造函数，请求默认带有token参数
 * Params: http方法，执行接口名，所需参数(默认带有token)，是否异步执行，是否含有需要遍历执行的参数，成功回调，失败回调
 */
function buildAjax (method, uri, data, ayc, hasarrparam, s, f) {
    if (uri != "loginOn" ) {
        sessionStorage.token ? (data.token = sessionStorage.token) : (window.location.href = '../index.html');
    };
    $.ajax({
        url: http + 'mobile/' + uri,
        type: method,
        async: ayc,
        dataType: 'json',
        traditional: hasarrparam,
        data: data,
        success: (res) => {
            if (res.code != 200) {
                errorHandler(res, uri);
                f && f(res);
                return;
            } else if (res.data && (res.data == null || res.data.length == 0)) {
                uri != 'getPrincipal' && console.log(uri+' 此次查询数据为空');
            }
            s && s(res);
        },
        error: (res) => {
            errorHandler(res, uri);
            f && f(res);
        }
    });
}




/**
 * Created: zhangfs by Atom
 * Date: 2018/04/02  18:34
 * Func: 接口错误日志监控，token失效自动登出
 * Params: 两个参数： 执行返回的结果集，正在访问的接口名
 * Note: 如果是loginOn，则本身就在index页，上报事件出错不打断页面业务执行
 */
function errorHandler (r, i) {
    try {
        console.log('Error: '+r.desc+' \nCode: ('+r.code+') '+' \nInterface: '+i+' \nPage: '+APP.html);
        if (i == 'loginOn' || i == 'event') return;
        if (r) {
            r.desc ? Tip.success(r.desc == 'token失效' ? '会话已过期' : r.desc) : Tip.success(i+'错误; Code: ' + r.status);
            (r.code && r.code == '401') ? window.location.href = '../index.html' : '';
        }
    } catch (e) {
        console.log('请求'+i+'失败 \n\nInterface: ' + i + ' \nPage: ' + APP.html);
        Tip.success('请求'+i+'失败');
    }
}




/**
 * Created: zhangfs by Atom
 * Date: 2018/04/11 11:10
 * Func: 获取城市列表页面适普函数
 * Params: 成功执行回调， 失败执行的回调
 */
function getCity(s, f) {
    buildAjax('get', 'getCity', {}, false, false, function(res) {
        var barCityText = localStorage.sessionCity ? JSON.parse(localStorage.sessionCity).text : res.data[0].text;
        var cityInit = localStorage.sessionCity ? JSON.parse(localStorage.sessionCity).value : res.data[0].value;
        $('#demo3').val(barCityText);
        triggerLArea("#demo3", "#value3", res.data);
        s && s(res, cityInit);
    }, f);
}




/**
 * Created: zhangfs by Atom
 * Date: 2018/04/02 18:34
 * Func: 责任人功能适普函数
 * Params: 四个参数：城市id，查询的表格id数组，成功回调函数，失败回调函数
 */
function getPrincipal (city, idArr, s, f) {
   if (city == 1) {
      $('.responsiblePerson-box').hide('fast');
      return;
   }
   $section = $('section');
   buildAjax('get', 'getPrincipal', {id:idArr, cityId: city}, true, true, function(res){
       if (res.data.length) {
           $('.responsiblePerson-box').show('fast');
           for ( var i in res.data) {
               for ( var j = 0; j < $section.length; j ++) {
                   if ( res.data[i].menu_id == $section.eq(j).attr('section-id') ) {
                        if (res.data[i].liablename && res.data[i].sim) {
                            var p = res.data[i].sim, n = res.data[i].liablename;
                            $section.eq(j).find('.phoneBubble a').html('TEL: ' + p);
                            res.data[i].sim ? $section.eq(j).find('.phoneBubble a').attr('href', 'tel:' + p)
                                            : $section.eq(j).find('.phoneBubble a').removeAttr('href');
                            $section.eq(j).find('.responsiblePerson').html('责任人: ' +  n);
                        } else {
                            console.log('警告: 表id为“' + $section.eq(j).attr('section-id') + '”的责任人信息缺失！ 城市ID: ' + city);
                            $section.eq(j).find('.responsiblePerson-box').hide('fast').html('');
                            $section.eq(j).find('.phoneBubble a').html('');
                        }
                       break;
                   }
               }
           };
       } else {
          $('.responsiblePerson-box').hide('fast');
       }
       s && s(res);
   }, f);
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/04/11 20:00
 * Func: 责任人泡泡弹窗适普函数
 * Params: 一个参数： 触发事件元素的父元素作用域
 */
function triggerBubble (_parent) {
    $('.phoneBubble').hide('fast');
    let _bub = _parent.children[0].classList[1];
    if (_bub != APP.BUBBLE_CACHE) {
        $('.'+_bub).show('fast');
        APP.BUBBLE_CACHE = _bub
    } else {
        APP.BUBBLE_CACHE = '';
    }
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/04/09 16:13
 * Func: 日期偏移及格式化。
 * Params: 1个或2个： 偏移的天数，正数表示以后几天，负数表示以前几天； 后者表示从哪天开始偏移
 */
function getDaysOffset (offset, origin) {
    offset = offset || 0;
    if (origin) {
        let Y = parseInt(origin.slice(0,4));
        let M = parseInt(origin.slice(4,6)) - 1;
        let D = parseInt(origin.slice(6,8)) + offset;
        return new Date(Y, M, D).format('yyyyMMdd');
    } else {
        let d = new Date();
        d.setDate(d.getDate() + offset);
        return d.format("yyyyMMdd");
    }
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/05/11 14:36
 * Func: 月份偏移及格式化。
 * Params: 0个或1个： 偏移的月份，正数表示以后几月，负数表示以前几月
 * 注意： 业务要求，取昨天所在月份为‘当月’
 */
function getMonthOffset (num) {
    num = num || 0;
    var Y = getDaysOffset(-1);
    var d = new Date(Y.slice(0,4), Y.slice(4,6)-1, Y.slice(6,8));
    d.setMonth(d.getMonth()+num);
    return d.format("yyyyMM");
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/04/11 17:45
 * Func: 单日期选择控件日期点击前一天后一天数据联动, 接受三个参数,作用域,变更天数,是否开启范围选择控制
 * Note: 为了向上兼容，日期部分必须要有id属性，周几部分必须要有class属性
 * E.g.: 订单分析
 */
function updateDate(_parent, num, limit) {
    let id = _parent.children[1].children[0].id,
        week = _parent.children[1].children[1].classList[0];
    if ($('#'+id).val()) {
        let d = $('#'+id).val();
        let dest = new Date(d.slice(0,4) +'/'+d.slice(4,6) +'/'+ d.slice(6,8));
        dest.setTime(dest.getTime() + num*24*3600000);
        if ( limit && dest.getTime() > new Date().getTime() ) {
            return d;
        }
        $('.'+week).html(getWeek(dest.getDay()));
        return dest.format('yyyyMMdd');
    }
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/05/11 15:15
 * Func: 月份选择控件点击上一月下一月数据联动
 * E.g.: 用户分析
 */
function updateMonth(_parent, num, limit) {
    var id = _parent.children[1].children[0].id;
    if ($('#'+id).val()) {
        var d = $('#'+id).val();
        var dest = new Date(d.slice(0,4) + '/' + d.slice(4,6) + '/01');
        dest.setMonth(dest.getMonth() + num);
        if ( limit && dest.getTime() > new Date().getTime() ) {
            return d;
        }
        return dest.format('yyyyMM');
    }
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/04/14 16:48
 * Func: 列表的分页控制器。 页面格式需按照设定格式书写，否则不生效
 * Params: 三个参数： 作用域，当前页面，执行刷新页面函数
 */
function pagingCtrl (_this, page, refUI) {
    if (_this.classList[1].split('-')[1] == 'prepage') {
        page > 1 ? (() => {
            page --;
            refUI && refUI(page);
        })() : console.log('Top page!');
    } else {
        page < parseInt($('.'+_this.classList[1].split('-')[0]+'-allpage').html()) ? (() => {
            page ++;
            refUI && refUI(page);
        })() : console.log('Last page!');
    }
    $('.'+_this.classList[1].split('-')[0]+'-nowpage').html(page);
    return page;
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/04/17 15:23
 * Func: 条件切换时重置表格翻页的页面
 * Params: 要重置的表格当前页的class类
 * E.g.: 车辆分析
 */
function resetPaging (i) {
    $('.' + i).html(1);
    return 1;
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/04/16 11:37
 * Func: h5弹出元素选择列表控件
 * Params: 三个参数： 触发点击事件的id，执行反馈的id，插入到弹窗列表的数据
 * E.g.: 网点分析
 */
function triggerLArea (triggerId, actionId, data) {
    let area = new LArea();
    area.init({
        'trigger': triggerId,
        'valueTo': actionId,
        'keys': {
            id: 'value',  // id输出到valueTo
            name: 'text'  // name输出到trigger
        },
        'type': 2,
        'data': [data]
    });
}


/**
 * Created: zhangfs by Atom
 * Date: 2018/04/16 11:37
 * Func: 移动端多条件选择器
 * Params: 四个参数： 触发点击事件的id，默认的显示位置，插入到弹窗列表的数据, 执行回调数据
 * E.g.: 网点分析
 */
function triggerMobileSelect(triggerId, initPosition, data, cb) {
    let mobileSelect = new MobileSelect({
        trigger: triggerId,
        title: '',
        wheels: [data],
        position:initPosition,
        callback:function(indexArr, data){
            console.log(indexArr, data); //返回选中的json数据
            cb && cb(data);
        }
    });
}


/**
 * Author: dameng by webstorm
 * Func: 日期格式化函数
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,   // 月份
        "d+": this.getDate(),        // 日
        "h+": this.getHours(),       // 小时
        "m+": this.getMinutes(),     // 分
        "s+": this.getSeconds(),     // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3),  // 季度
        "S": this.getMilliseconds()  // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}




/**
 * Created: zhangfs by Atom
 * Date: 2018/04/10 10:21
 * Func: 设置单时间选择器的周几数据/html/watch.html?v=2.0.1
 * Params: 周几控件种的最后一个数据.如showeek1，则num = 1
 */
function startingWeek(id){
    $('.showWeek'+id).html(getWeek(new Date().getDay()));
};
function startingWeekYesterday (id){
    $('.showWeek'+id).html(getWeek(new Date().getDay() - 1));
};




/**
 * Author: dameng by webstorm
 * Func: 获取选中日期周几
 * Params: 控件后面的采数字
 */
function getWeek(i){
    return '周' + '日一二三四五六'.substr(i,1);
};
function updateWeek(_this){
    let i = $(_this).attr('id').charAt($(_this).attr('id').length-1);
    let d = $(_this).val();
    let dest = new Date(d.slice(0,4) +'/'+d.slice(4,6) +'/'+ d.slice(6,8));
    $('.showWeek'+i).html(getWeek(dest.getDay()));
};



/**
 * Created: zhangfs by Atom
 * Date: 2018/08/11
 * Func: 数值千分表示法
 */
function commaFormat(num) {
    if (isNaN(num) || num == "" || num == 0) return 0;
    let dot = num.toString().split('.')[1];
    return parseInt(num).toString().replace(/\B(?=(\d{3})+$)/g,',') + (dot ? ('.' + dot) : '');
}

/**
 * Created: zhangfs by Atom
 * Date: 2018/08/17
 * Func: 获取用户滑动方向
 */
function GetSlideDirection(startX, startY, endX, endY) {
    let dy = endY - startY;
    let dx = endX - startX;
    let move = {
        x: dx > 0 ? 1 : dx < 0 ? -1 : 0,
        y: dy > 0 ? 1 : dy < 0 ? -1 : 0
    }
    return move
}


/**
 * Created: zhangfs by Atom
 * Date: 2018/04/16 15:12
 * Func: 将返回数据中网点类型翻译成中文
 * Params: 网点参数
 * E.g.: 网点分析
 */
function siteType (t) {
    return t == 0 ? "实体" : "虚拟"
}

/**
 * Func: 将返回数据中网点变更状态翻译成中文
 * Params: 变更状态参数
 */
function changeType (t) {
    return t == 1 ? "开启" : "关闭"
}

/**
 * Create: zhangfs by Atom
 * Date: 2018/03/21
 * Func: 处理返回值带null字段数据
 * Params: 需修改字段参数
 */
function nullHandle(t) {
    return t == null ? '-' : t;
};


/**
 * Create: zhangfs by Atom
 * Date: 2018/03/15
 * Func: 返回数据中时间戳转所需日期格式
 * Params: 要转换的时间戳
 */
function time2Date (timestamp) {
    let d = new Date();
    d.setTime(timestamp);
    return d.format('yyyyMMdd');
}

/**
 * Create: zhangfs by Atom
 * Date: 2018/08/07
 * Func: 将字符串转化成日期显示格式字符串
 */
function dateFormat(date) {
    var str = date.toString();
    if (typeof(date) != 'number') {
        return str;
    } else if (str.length == 8) {
        return str.slice(0,4) + '-' + str.slice(4,6) + '-' + str.slice(6,8);
    } else if (str.length == 6){
        return str.slice(0,4) + '-' + str.slice(4,6);
    }
}

/**
 * Create: zhangfs by Atom
 * Date: 2018/07/26
 * Func: 日历控件选中的月份有多少天
 * Param: 日历控件选中的月份或日期字符创
 */
function getDays(str) {
    if (!str) {
        Tip.success('获取月天数无参！');
        return ;
    }
    var cYear = str.slice(0, 4);
    var cMonth = str.slice(4, 6);
    var days = 30;
    if ( ['01','03','05','07','08','10','12'].indexOf(cMonth) >= 0 ) {
        days = 31;
    } else if ( cMonth == '02' ) {
        let Y = parseInt(cYear);
        days = 28;  // 平年
        if ((Y % 4 == 0) && (Y % 100 != 0) || (Y % 400 == 0)) {
            days = 29  // 闰年
        }
    }
    if ( cYear == new Date().getFullYear() && cMonth == new Date().getMonth() + 1) {
        days = new Date().getDate();
    }
    return days;
}


/**
 * Created: zhangfs by Atom
 * Date: 2018/04/27 11:20
 * Func: 日历选择控件,接受1到2个参数; 1个参数检查单日期控件, 2个参数检查双日期控件
 */
function isDateValid(start, end) {
    let s = $('#appDateTime'+start).val();
    let startDate = new Date(s.slice(0,4), parseInt(s.slice(4, 6))-1, s.slice(6, s.length));
    let endDate = new Date();
    if (end) {
        let e = $('#appDateTime'+end).val();
        endDate = new Date(e.slice(0,4), parseInt(e.slice(4, 6))-1, e.slice(6, e.length));
    }
    if (startDate.getTime() > endDate.getTime()) {
        Tip.success('日期选择不合理');
        if(end) {
            $('#appDateTime'+start).val(getDaysOffset(-7));
            $('#appDateTime'+end).val(getDaysOffset(-1))
        } else {
            $('#appDateTime'+start).val(getDaysOffset(-1));
        }
        return false;
    }
    return true;
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/05/11 14:52
 * Func: 月份选择控件; 支持查询本月以前的数据,不包含本月
 * E.g.: 用户分析 (可以合并到isDateValid上)
 */
function isMonthValid(num) {
    let now = new Date();
    let date = $('#appMonth'+num).val();
    let picked = new Date(date.slice(0,4), date.slice(4,6));
    if ((picked.getTime() > now.getTime()) || (now.getMonth() == picked.getMonth()-1)) {
        Tip.success('请查当月之前数据');
        $('#appMonth'+num).val(getMonthOffset(-1));
        return false;
    }
    return true;
}



/**
 * Created: zhangfs by Atom
 * Date: 2018/04/26 12:01
 * Func: 埋点及事件上报
 */
function reportEntry(base) {
    var data = base || {};
    data['reportType'] = 'entry';
    buildReport(data);
}

function reportLeave(base) {
    var data = base || {};
    data['reportType'] = 'leave';
    buildReport(data);
}

function reportEvent(evt, base) {
    var data = base || {};
    data['reportType'] = 'event';
    data['reportName'] = evt || '';
    postReport(data);
}

function postReport(data, r) {
    var retry = r || 0;
    if (!data['reportTime']) {
        data['reportTime'] = new Date().toISOString();
        data['userName'] = localStorage.user || '';
        data['nickname'] = sessionStorage.nickname || '';
        data['ip'] = sessionStorage.ip || '';
        data['address'] = sessionStorage.address || '';
        data['entryTime'] = sessionStorage.entryTime || '';
        data['device'] = sessionStorage.device || '';
        data['platform'] = sessionStorage.platform || '';
        data['page'] = APP.html || '';
        data['BIversion'] = version;
        data['channel'] = 1;    // 1: app. 2: pc
    }
    console.log(data);
    // debugger;
    buildAjax('post', 'event', data, true, false, function(res) {
    }, function(res) {
      console.log(retry, 'postReport');
        retry < 3 && setTimeout(function(){ postReport(data, ++retry) }, 200);
        retry > 3 && console.log(data['eventName'] + '上报失败');
    });
}





/**
 * Update: zhangfs by Atom
 * Date: 2018/05/18 09:59
 * Func: 类原生toast错误提示效果
 */
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
