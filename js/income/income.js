/**
 * Created with Atom.
 * Author: zhangfs
 * Date: 2018/03/21
 * Time: 16:10
 */
$(function () {
    var DATA_CACHE, INCH_CAHCHE, US_CACHE;
    var cityVal = 1, carType = '0', inch_ct = 0, us_ct = 0;
    var base = '0', incpage = 1, inchPage = 1, usPage = 1;

    for (let i of [1,2,3,4,5,6,7]) {
        $('#appDateTime' + i).mobiscroll(APP.dateBar);
    }
    for (let i of [2,4,6]) {
        $('#appDateTime' + i).val(getDaysOffset(-7));
    }
    for (let i of [1,3,5,7]) {
        $('#appDateTime' + i).val(getDaysOffset(-1));
    }
    startingWeekYesterday(1);


    // 获取城市信息
     getCity(function(res, cityInit){
         cityVal = cityInit;
         getIncome();
         getRecharge(base);
         incomeHistory();
         unsettled();
         getPrincipal(cityVal, [58,59]);
     }, false);


     // nav 城市改变 及其刷新数据
     $('#demo3').bind('input propertychange', function() {
         if ($('#value3').val() == '') return;
         localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
         cityVal = $('#value3').val();
         $('.phoneBubble').hide('fast');
         cityVal == '1' && $('.responsiblePerson-box').hide('fast');
         getIncome();
         getRecharge(base);
         incomeHistory();
         unsettled();
         getPrincipal(cityVal, [58,59]);
     });

     // 责任人弹窗控制
     $('.responsiblePerson').on('click', function() {
         triggerBubble(this.parentNode);
     });


    // 营收概况
    function getIncome() {
        var data = {
            cityId: cityVal,
            carType: carType,
            dateId: $('#appDateTime1').val()
        };
        buildAjax('get','getInComeDetail', data, true, false, function(res){
            var str = "";
            var data = res.data.data;
            for (var i in data) {
                var imgSrc = data[i].data4 == 0 ? "" : data[i].data4 > 0 ?  "../images/icon_rise.png" : "../images/icon_decline.png";
                str += "<li> <p>" + data[i].data0 + "</p>" +
                    "<p>" + data[i].data1+ "</p>" +
                    "<p>" + data[i].data2 + "</p>" +
                    "<p>" + data[i].data3 + "</p>" +
                    "<p>" + data[i].data4 + "%" +
                    "<img src='" + imgSrc + "' alt=''/> </p> </li>";
            }
            $('.incVal').html(str);
        });
    };
    // 营收概况 logic
    $('.inc-predate, .inc-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      getIncome();
    });
    $('#appDateTime1').bind('change', function() {
        isDateValid(1) && getIncome();
        updateWeek(this);
    });
    $('.inc-ct').on('click', function() {
         $(this).addClass('active').siblings().removeClass('active');
         carType = $(this).attr('data-type');
         getIncome();
    })



    // 用户充值
    function getRecharge(base) {
        let data = {
            cityId: cityVal,
            startDate: $('#appDateTime2').val(),
            endDate: $('#appDateTime3').val()
        }
        buildAjax('get', 'getRechargeInfo', data, true, false, function(res){
            DATA_CACHE = res.data.data;
            incpage = resetPaging('inc-nowpage');
            $('.inc-allpage').html( Math.ceil(DATA_CACHE.length / 10) == 0 ? 1 : Math.ceil(DATA_CACHE.length / 10) );
            setUI(base, DATA_CACHE.slice(0, 10));
        });
    }

    let refRechargeUI = (base, page) => {
        DATA_CACHE ? setUI(base, DATA_CACHE.slice( 10 * ( page - 1 ), 10 * page)) : getRecharge(base);
    }
    let setUI = (base, d) => {
        base = ['0','1','2'].indexOf(base.toString()) == -1 ? 0 : base;
        let headerStr = "", valueStr = "";
        for (let i in d) {
            switch (base) {
              case '0':
                headerStr += "<li><p>" + dateFormat(d[i].data0) + "</p></li>";
                valueStr += "<li><p>" + d[i].data1 + "</p>" + "<p>" + d[i].data2 + "</p>" +
                    "<p>" + d[i].data3 + "</p>" + "<p>" + d[i].data4 + "</p>" +
                    "<p> -- </p></li>";
                break;
              case '1':
                headerStr += "<li><p>" + dateFormat(d[i].data0) + "</p></li>";
                valueStr += "<li><p>" + d[i].data5 + "</p>" + "<p>" + d[i].data6 + "</p>" +
                    "<p>" + d[i].data7 + "</p>" + "<p>" + d[i].data8 + "</p>" +
                    "<p> -- </p></li>";
                break;
              case '2':
                headerStr += "<li><p>" + dateFormat(d[i].data0) + "</p></li>";
                valueStr += "<li><p>" + d[i].data9 + "</p>" + "<p>" + d[i].data10 + "</p>" +
                    "<p>" + d[i].data11 + "</p>" + "<p>" + d[i].data12 + "</p>" +
                    "<p>" + d[i].data13 + "</p></li>";
            }
        }
        $('.recg-fv').html(headerStr);
        $('.recg-sv').html(valueStr);
    }

    // 用户充值 logic
    $('#appDateTime2, #appDateTime3').on('change', function() {
        isDateValid(2,3) && getRecharge(base);
    })
    $('.tcs').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        base = $(this).attr('base');
        refRechargeUI(base, incpage);
    })
    // 此处不能使用serverJs中的公用办法
    $('.inc-prepage, .inc-nextpage').on('click',function() {
        if (this.classList[0] == 'inc-prepage') {
            incpage > 1 ? (() => {
                incpage --;
                refRechargeUI(base, incpage);
                $('.inc-nowpage').html(incpage);
            })() : console.log('Top page!');
        } else {
           incpage < parseInt($('.allpage').html()) ? (() => {
               incpage ++;
               refRechargeUI(base, incpage);
               $('.inc-nowpage').html(incpage);
           })() : console.log('Last page!');
        }
    });

    // 历史营收分析
    function incomeHistory() {
        var data = {
            cityId: cityVal,
            typeId: inch_ct,
            startDate: $('#appDateTime4').val(),
            endDate: $('#appDateTime5').val()
        }
        buildAjax('get', 'gethistoryEarning', data, true, false, function(res){
            INCH_CACHE = res.data.reverse();
            inchpage = resetPaging('inch-nowpage');
            $('.inch-allpage').html( Math.ceil(INCH_CACHE.length / 10) == 0 ? 1 : Math.ceil(INCH_CACHE.length / 10) );
            setIhUI(INCH_CACHE.slice(0, 10));
        });
    }
    let refIhUI = (p) => {
        INCH_CACHE ? setIhUI(INCH_CACHE.slice( 10*(p-1), 10*p) ) : incomeHistory();
    }
    let setIhUI = (data) => {
        let headerStr = "", valueStr = "";
        for (let d of data) {
            headerStr += "<li>" + dateFormat(d.date_id) + "</li>";
            valueStr += "<li> <p>" + d.sumPayAmount + "</p>" +
                "<p>" + d.sumAmount + "</p>" +
                "<p>" + d.sumCouponAmount + "</p>" +
                "<p>" + d.sumnoPayAmount + "</p>" +
                "<p>" + d.sumnoPayAmount_t + "</p></li>";
        }
        $('.inch-fv').html(headerStr);
        $('.inch-sv').html(valueStr);
    }

    // 违法数据统计 logic
    $('.inch-prepage, .inch-nextpage').on('click', function() {
         inchPage = pagingCtrl(this, inchPage, refIhUI);
    });
    $('#appDateTime4, #appDateTime5').on('change', function() {
        isDateValid(4,5) && incomeHistory();
    });
    $('.inch-ct').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        inch_ct = $(this).attr('data-type');
        incomeHistory();
    });

    // 累计未结算分析
    function unsettled() {
        var data = {
            cityId: cityVal,
            typeId: us_ct,
            startDate: $('#appDateTime6').val(),
            endDate: $('#appDateTime7').val()
        }
        buildAjax('get', 'getNopayEarning', data, true, false, function(res){
            US_CACHE = res.data;
            usPage = resetPaging('us-nowpage');
            $('.us-allpage').html( Math.ceil(US_CACHE.length / 10) == 0 ? 1 : Math.ceil(US_CACHE.length / 10) );
            setUsUI(US_CACHE.slice(0, 10));
        });
    }
    let refUsUI = (p) => {
        US_CACHE ? setUsUI(US_CACHE.slice( 10*(p-1), 10*p) ) : unsettled();
    }
    let setUsUI = (data) => {
        let headerStr = "", valueStr = "";
        for (let d of data) {
            headerStr += "<li>" + dateFormat(d.date_id) + "</li>";
            valueStr += "<li><p>" + d.noPay_sumAmount + "</p>" +
                "<p>" + d.noPay_user + "</p>" +
                "<p>" + d.noPay_Amount_old + "</p>" +
                "<p>" + d.noPay_Amount_new + "</p>" +
                "<p>" + d.noPay_amount_dep + "</p>" +
                "<p>" + d.noPay_amount_zmxy + "</p></li>";
        }
        $('.us-fv').html(headerStr);
        $('.us-sv').html(valueStr);
    }

    // 累计未结算分析 logic
    $('.us-prepage, .us-nextpage').on('click', function() {
         usPage = pagingCtrl(this, usPage, refUsUI);
    });
    $('#appDateTime6, #appDateTime7').on('change', function() {
        isDateValid(6,7) && unsettled();
    });
    $('.us-ct').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        us_ct = $(this).attr('data-type');
        unsettled();
    });
});
