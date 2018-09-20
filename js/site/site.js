/**
 * Created: dameng by webstorm
 * Date: 2017/11/15 09:05
 * Recode: zhangfs 2018/04/16
 * Note: Package and Add Handler
 */
$(function () {
    var BASIC_CACHE, CHANGE_CACHE, DETAIL_CACHE, CAR_CACHE, ORDER_CACHE;
    var sbpage = 1, scpage = 1, sdpage = 1, scpage = 1, sopage = 1;
    var cityVal = '',
        selectType = "1";           // 20佳：1  20差：2  全部：3
    var detail_busiArea = '',       // 网点明细
        detail_days = '1',
        detail_site = '';
    var sitecar_busiArea = '',      // 网点车辆
        sitecar_hourId = '';
    var so_cartype = 0;             // 网点订单

    var today = getDaysOffset(),
        yesterday = getDaysOffset(-1),
        weekAgo = getDaysOffset(-7);

    for (let i of [1,2,6,7,8]) {
        $('#appDateTime'+i).mobiscroll(APP.dateBar);
    }

    $('#appDateTime6').val(today);
    $('#appDateTime1, #appDateTime7').val(weekAgo);
    $('#appDateTime2, #appDateTime8').val(yesterday);

    startingWeek(6);
    startingWeekYesterday(7);

    triggerLArea('#detail-date', '#detail-date-val', APP.timePeriodBar);
    triggerLArea('#detail-site', '#detail-site-val', APP.siteTypeBar);
    triggerLArea('#car-time', '#car-time-val', APP.timeBar);


    // 获取城市列表
    getCity(function(res, cityInit) {
        res.data[0].value == 1 && res.data.shift();
        if (localStorage.sessionCity) {
            $('#demo3').val(JSON.parse(localStorage.sessionCity).text);
            cityVal = JSON.parse(localStorage.sessionCity).value;
        } else {
            $('#demo3').val(res.data[0].text);
            cityVal = res.data[0].value;
        }
        getBusinessAreaInit();
        siteBasic(sbpage);
        sitechange($('#appDateTime1').val(), $('#appDateTime2').val(), scpage);
        siteDetail(sdpage);
        siteCar($('#appDateTime6').val(), scpage);
        siteOrder();
        getPrincipal(cityVal, [34,35,36,38,39]);
    }, false);



    function getBusinessAreaInit() {
        buildAjax('get', 'park/getBusinessArea', {cityId:cityVal}, false, false, function(res) {
            let bus_area = [];
            for (let d of res.data){
                bus_area.push({"text":d.businessareaname,"value":d.businessareaid})
            }
            triggerLArea('#detail-business', '#detail-business-val', bus_area);
            triggerLArea('#car-business', '#car-business-val', bus_area);
        }, false)
    }


    //nav 城市改变 及其刷新数据
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val()) {
            localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
            cityVal = $('#value3').val();
            $('.phoneBubble').hide('fast');
            $('#detail-business').val('商圈');
            $('#car-business').val('商圈');
            detail_busiArea = sitecar_busiArea = '';
            getBusinessAreaInit();
            siteBasic(sbpage);
            sitechange($('#appDateTime1').val(),$('#appDateTime2').val(), scpage);
            siteDetail(sdpage);
            siteCar($('#appDateTime6').val(), scpage);
            siteOrder();
            getPrincipal(cityVal, [34,35,36,38,39]);
        }
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
          triggerBubble(this.parentNode);
    });


    // 网点概述
    function siteBasic(p) {
        buildAjax('get','park/getGeneralSituationData',{cityId:cityVal}, true, false, function(res){
            BASIC_CACHE = res.data;
            sbpage = resetPaging('site-nowpage');
            $('.site-allpage').html(Math.ceil(BASIC_CACHE.length / 10) == 0 ? 1 : Math.ceil(BASIC_CACHE.length / 10));
            setSbUI(BASIC_CACHE.slice(10 * ( p - 1 ), 10 * p));
        }, false);
    }

    let refSbUI = (p) => {
        BASIC_CACHE ? setSbUI(BASIC_CACHE.slice(10 * ( p - 1 ), 10 * p)) : siteBasic(p);
    }

    let setSbUI = (data) => {
        let str = '';
        for (let d of data) {
            let imgSrc = d.tongbiRate == 0 ? "" : d.tongbiRate > 0 ? "../images/icon_rise.png" : "../images/icon_decline.png";
            str += "<li> <p>" + d.kpiname + "</p>" +
                "<p>" + d.kpiCurrent+ "</p>" +
                "<p>" + d.kpiYes + "</p>" +
                "<p>" + d.kpiTongbi + "</p>" +
                "<p>" + d.tongbiRate + "%" +
                "<img src='" + imgSrc + "' alt=''/> </p> </li>";
        }
        $('.siteVal').html(str);
    }

    // 网点概述 分页控制
    $('.site-prepage, site-nextpage').on('click', function() {
        sbpage = pagingCtrl(this, sbpage, refSbUI);
    });


    // 网点变更
    function sitechange(s, e, p) {
        buildAjax('get', 'park/getParkingUpdateData', {cityId:cityVal, startDate:s, endDate:e}, true, false, function(res){
            CHANGE_CACHE = res.data;
            scpage = resetPaging('change-nowpage');
            $('.change-allpage').html(Math.ceil(CHANGE_CACHE.length/10) == 0 ? 1: Math.ceil(CHANGE_CACHE.length/10));
            setChangeUI(CHANGE_CACHE.slice(10 * ( p - 1 ), 10 * p));
        }, false);
    }

    let refChangeUI = (p) => {
        CHANGE_CACHE ? setChangeUI(CHANGE_CACHE.slice(10 * ( p - 1 ), 10 * p))
                     : sitechange($('#appDateTime1').val(),$('#appDateTime2').val(), p);
    }

    let setChangeUI = (data) => {
        let str = "";
        for (let d of data) {
            str += "<li>" + "<p><span>" + d.parkName + "</span></p>" +
                "<p>" + siteType(d.parkType)+ "</p>" +
                "<p>" + d.carportNum + "</p>" +
                "<p>" + changeType(d.updateType) + "</p>" +
                "<p>" + dateFormat(parseInt(time2Date(d.updateDate))) + "</p> </li>";
        }
        $('.changeVal').html(str);
    }

    // 网点变更分页控制
    $('.change-prepage, .change-nextpage').on('click', function(){
        scpage = pagingCtrl(this, scpage, refChangeUI);
    });

    $('#appDateTime1, #appDateTime2').on('change',function () {
        isDateValid(1,2) && sitechange($('#appDateTime1').val(),$('#appDateTime2').val(), 1);
    });


    // 网点明细
    function siteDetail(p) {
        let data = {
            cityId: cityVal,
            selectType: selectType,
            reportType: detail_days,
            businessareaid: detail_busiArea,
            parkingKind: detail_site
        }
        buildAjax('get', 'park/getParkDetail', data, true, false, function(res){
            DETAIL_CACHE = res.data;
            sdpage = resetPaging('detail-nowpage');
            $('.detail-allpage').html(Math.ceil(DETAIL_CACHE.length / 10) == 0 ? 1 : Math.ceil(DETAIL_CACHE.length / 10));
            setDetailUI(DETAIL_CACHE.slice(10 * ( p - 1 ), 10 * p));
        }, false);
    }

    let refDetailUI = (p) => {
        DETAIL_CACHE ? setDetailUI(DETAIL_CACHE.slice(10 * ( p - 1 ), 10 * p))
                     : getParkDetail(p);
    }

    let setDetailUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
            fv += "<li><span>" + d.parkName + "</span></li>";
            sv += "<li><p>" + d.carportNum + "</p>" +
                "<p>" + d.carportAvgorder + "</p>" +
                "<p>" + d.executAvgnum + "</p>" +
                "<p>" + d.retrunAvgnum + "</p>" +
                "<p>" + d.userAvgnum + "</p>" +
                "<p>" + dateFormat(parseInt(time2Date(d.openDate))) + "</p> </li>";
        }
        $('.sd-fv').html(fv)
        $('.sd-sv').html(sv)
    }

    // 网点明细 分页控制
    $('.detail-prepage, .detail-nextpage').on('click', function(){
        sdpage = pagingCtrl(this, sdpage, refDetailUI);
    });

    $('.tcs').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        selectType = $(this).attr('data-value');
        $('.detail-nowpage').html(1);
        siteDetail(1);
    });


    $('#detail-business').bind('input propertychange', function() {
        if ($('#detail-business-val').val()){
            detail_busiArea = $('#detail-business-val').attr('value');
            siteDetail(1);
        }
    });
    $('#detail-date').bind('input propertychange', function() {
        if ($('#detail-date-val').val()){
            detail_days = $('#detail-date-val').attr('value');
            siteDetail(1);
        }
    });
    $('#detail-site').bind('input propertychange', function() {
        if ($('#detail-site-val').val()){
            detail_site = $('#detail-site-val').attr('value');
            siteDetail(1);
        }
    });


    // 网点车辆
    function siteCar(date, p) {
        let data = {
            cityId: cityVal,
            dateId: date,
            businessareaid: sitecar_busiArea,
            hourId: sitecar_hourId
        }
        buildAjax('get', 'park/getParkCarDetail', data, true, false, function(res) {
            CAR_CACHE = res.data;
            scpage = resetPaging('sitecar-nowpage');
            $('.sitecar-allpage').html(Math.ceil(CAR_CACHE.length / 10) == 0 ? 1 : Math.ceil(CAR_CACHE.length / 10));
            setSiteCarUI(CAR_CACHE.slice(10 * ( p - 1 ), 10 * p));
        }, false);
    }

    let refSiteCarUI = (p) => {
        CAR_CACHE ? setSiteCarUI(CAR_CACHE.slice(10 * ( p - 1 ), 10 * p))
                  : siteCar($('#appDateTime6').val(), p);
    }

    let setSiteCarUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
            fv += "<li><span>" + d.parkName + "</span></li>";
            sv += "<li><p>" + siteType(d.parkingkind) + "</p>" +
                "<p>" + d.parkplacenums + "</p>" +
                "<p>" + d.useparkplacenums + "</p>" +
                "<p>" + d.orderparkplacecount + "</p>" +
                "<p>" + d.waitCarnum + "</p>" +
                "<p>" + d.poweroffCarnum + "</p>" +
                "<p>" + d.operoffCarnum + "</p>" +
                "<p>" + d.powerCarnum + "%</p> </li>";
        }
        $('.sc-fv').html(fv);
        $('.sc-sv').html(sv);
    }

    // 网点车辆 分页控制
    $('.sitecar-prepage, .sitecar-nextpage').on('click', function(){
        scpage = pagingCtrl(this, scpage, refSiteCarUI);
    });

    // 网点车辆 时间监控 单日期
    $('.sitecar-predate, .sitecar-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      siteCar($('#appDateTime6').val(), 1);
    });
    // 网点车辆 日历控件监控
    $('#appDateTime6').bind('change', function() {
        isDateValid(6) && siteCar($('#appDateTime6').val(), 1);
        updateWeek(this);
    });

    // 网点车辆 条件切换
    $('#car-business').bind('input propertychange', function() {
        if ($('#car-business-val').val()){
            sitecar_busiArea = $('#car-business-val').attr('value');
            siteCar($('#appDateTime6').val(), 1);
        }
    });

    $('#car-time').bind('input propertychange', function() {
        if ($('#car-time-val').val()){
            sitecar_hourId = $('#car-time-val').attr('value');
            siteCar($('#appDateTime6').val(), 1);
        }
    });


    // 网点订单
    function siteOrder () {
        let data = {
            cityId: cityVal,
            startDate: $('#appDateTime7').val(),
            endDate: $('#appDateTime8').val(),
            typeId: so_cartype
        };
        buildAjax('get', 'park/getParkOrderDetail', data, true, false, function(res){
            ORDER_CACHE = res.data;
            sopage = resetPaging('so-nowpage');
            $('.so-allpage').html(Math.ceil(ORDER_CACHE.length / 10) == 0 ? 1 : Math.ceil(ORDER_CACHE.length / 10));
            setSiteOrderUI(ORDER_CACHE.slice(0, 10));
        }, false);
    }
    let refOrderUI = (p) => {
        ORDER_CACHE ? setSiteOrderUI(ORDER_CACHE.slice(10 * ( p - 1 ), 10 * p)) : siteOrder();
    }
    let setSiteOrderUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li><span>" + d.parkName + "</span></li>";
            sv += "<li><p>" + d.operaTime + "</p>" +
                "<p>" + d.parkState + "</p>" +
                "<p>" + d.parkPlaceNum + "</p>" +
                "<p>" + d.createOrderNum + "</p>" +
                "<p>" + d.execOrderNum + "</p>" +
                "<p>" + d.execOrderRate + "%</p>" +
                "<p>" + d.finishOrderNum + "</p>" +
                "<p>" + d.retrunOrderNum + "</p>" +
                "<p>" + d.diffOrderNum + "</p>" +
                "<p>" + d.avgOrderMileage + "</p>" +
                "<p>" + d.avgOrderMinute + "</p>" +
                "<p>" + d.avgOrderPayamount + "</p>" +
                "<p>" + d.amount + "</p>" +
                "<p>" + d.payamount + "</p>" +
                "<p>" + d.placeAvgExecorder + "</p>" +
                "<p>" + d.placeAvgReturnorder + "</p>" +
                "<p>" + d.diffReturnorderRate + "%</p> </li>";
        }
        $('.so-fv').html(fv);
        $('.so-sv').html(sv);
    }

    // 网点订单 分页控制
    $('.so-prepage, .so-nextpage').on('click', function() {
        sopage = pagingCtrl(this, sopage, refOrderUI);
    });

    // 网点订单 时间监控
    $('#appDateTime7, #appDateTime8').on('change',function () {
        isDateValid(7,8) && siteOrder();
    });

    // 网点订单 车类型选择
    $('.so-ct').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        so_cartype = $(this).attr('data-type')
        $('.so-nowpage').html(1);
        siteOrder();
    })
});
