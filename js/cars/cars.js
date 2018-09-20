 /**
 * Created with webstorm.
 * Author: dameng
 * Date: 2017/11/15 09:05
 * Recode: zhangfs 2018/04/12 11:30
 * Note: Package and Add Handler
 */
// addVersionControl();
$(function () {
    var CAR_CACHE, OFFLINE_CACHE, CTM_CACHE, CTT_CACHE, TTOP_CACHE, ER_CACHE, CLEAN_CACHE;
    var cityVal='', ctm_ct = 0, ctt_ct = 0, ttop_ct = 0, er_ct = 0,
        ctm_operate = 0,
        typeId = "10";    // 1:日间上架率，10:10点上架率，17:17点上架率
    var carpage = 1, offpage = 1, ctmpage = 1, cttpage = 1, ttoppage = 1, erpage = 1, ccpage = 1;

    triggerLArea('#ctmtog', '#ctmtog-val', APP.carOperateBar);

    $('#appMonth1').mobiscroll(APP.monthBar);
    $('#appMonth1').val(getMonthOffset());
    for (let i of [2,3,4,5,6,7,8,9,10,11,12,13,14]) {
        $('#appDateTime'+i).mobiscroll(APP.dateBar);
    }

    for (let i of [2,4,8,10,13]) {
        $('#appDateTime'+i).val(getDaysOffset(-7));
    }
    for (let i of [3,5,9,11,12,14]) {
        $('#appDateTime'+i).val(getDaysOffset(-1));
    }
    $('#appDateTime6').val(getDaysOffset(-6));
    $('#appDateTime7').val(getDaysOffset());
    startingWeek(12);


    // 获取城市列表
    getCity(function(res, cityInit) {
        cityVal = cityInit;
        getCarInfo($('#appDateTime2').val(),$('#appDateTime3').val(), carpage);
        onlineCharts($('#appDateTime4').val(),$('#appDateTime5').val());
        offlineChart($('#appDateTime6').val(),$('#appDateTime7').val());
        offlineTable($('#appDateTime6').val(),$('#appDateTime7').val(), offpage);
        carTiming();
        carTimingTable(1);
        timingTop(1);
        emptyRun(1);
        carClean(1);
        getPrincipal(cityVal, [40,41,42,43]);
    }, false);

    //nav 城市改变 及其刷新数据
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val() == '') return;
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        cityVal = $('#value3').val();
        offpage = carpage = 1;
        $('.nowpage').html(1);
        $('.phoneBubble').hide('fast');
        cityVal == '1' ? $('.responsiblePerson-box').hide('fast') : $('.responsiblePerson-box').show('fast');;
        onlineCharts($('#appDateTime4').val(),$('#appDateTime5').val());
        offlineChart($('#appDateTime6').val(),$('#appDateTime7').val());
        offlineTable($('#appDateTime6').val(),$('#appDateTime7').val(), offpage);
        getCarInfo($('#appDateTime2').val(),$('#appDateTime3').val(), carpage);
        carTiming();
        carTimingTable(1);
        getPrincipal(cityVal, [40,41,42,43]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });


    // 车辆概况
    function getCarInfo(s, e, p) {
        var data = {
            cityId: cityVal,
            startDate: s,
            endDate: e
        }
        buildAjax('get', 'car/getKpiCarInfo', data, true, false, function(res){
            CAR_CACHE = res.data.reverse();
            carpage = resetPaging('car-nowpage');
            $('.car-allpage').html(Math.ceil(CAR_CACHE.length / 10) == 0 ? 1 : Math.ceil(CAR_CACHE.length / 10));
            setCarUI(CAR_CACHE.slice( 10 * ( p - 1 ), 10 * p));
        }, false);
    }
    let refCarUI = (p) => {
        CAR_CACHE ? setCarUI(CAR_CACHE.slice( 10 * ( p - 1 ), 10 * p))
                  : getCarInfo($('#appDateTime2').val(),$('#appDateTime3').val(), p);
    }
    let setCarUI = (d) => {
        let fv = '', sv = '';
        for (let i of d) {
            fv += "<li>" + dateFormat(i.dateId) + "</li>";
            sv += "<li><p>" + i.totalCarNum + "</p>" +
                "<p>" + i.operateCarNum + "</p>" +
                "<p>" + i.onNum + "</p>" +
                "<p>" + i.offNum + "</p>" +
                "<p>" + i.lowVoltageNum + "</p>" +
                "<p>" + i.upkeepNum + "</p>" +
                "<p>" + i.accidentNum + "</p>" +
                "<p>" + i.maintainNum + "</p>" +
                "<p>" + i.offlineNum + "</p>" +
                "<p>" + i.missMateriailNum + "</p></li>";
        }
        $('.car-fv').html(fv);
        $('.car-sv').html(sv);
    }



    // 上架率 堆叠图
    var myChart = echarts.init(document.getElementById("dateCarChart1"));
    myChart.showLoading({ effect:'ring' });

    function onlineCharts(s, e) {
        let data = {
            cityId: cityVal,
            startDate: s,
            endDate: e,
            hourId: typeId
        }
        buildAjax('get', 'car/getKpiCarRate', data, true, false, function(res){
            option.xAxis[0].data=res.data.date;
            option.series[0].data=res.data.data1;
            option.series[1].data=res.data.data2;
            option.series[2].data=res.data.data3;
            option.series[3].data=res.data.data4;
            myChart.setOption(option);
            myChart.hideLoading();
            $(".car-notedata").html(res.data.AvgPutawayRate+"%");
        }, false);
    }


    // 车机离线数量
    var myChart2 = echarts.init(document.getElementById("dateCarChart2"));
    myChart2.showLoading({ effect:'ring' });

    function offlineChart(s, e) {
        let data = {
            cityId: cityVal,
            startDate: s,
            endDate: e
        }
        buildAjax('get', 'car/getKpiCarofflineData', data, true, false, function(res){
            option1.xAxis.data=res.data.axisList;
            option1.series[0].data=res.data.dataList;
            myChart2.setOption(option1);
            myChart2.hideLoading();
        }, false);
    }

    // 机车离线表格
    function offlineTable(s, e, p) {
        let data = {
            cityId: cityVal,
            startDate: s,
            endDate: e
        }
        buildAjax('get', 'car/getCarofflineTableData', data, true, false, function(res){
            OFFLINE_CACHE = res.data.table.reverse();
            offpage = resetPaging('off-nowpage');
            $('.off-allpage').html(Math.ceil(OFFLINE_CACHE.length / 10) == 0 ? 1 : Math.ceil(OFFLINE_CACHE.length / 10));
            setTableUI(OFFLINE_CACHE.slice(10 * ( p - 1 ), 10 * p));
        }, false);
    }

    let refTableUI = (p) => {
        OFFLINE_CACHE ? setTableUI(OFFLINE_CACHE.slice(10 * ( p - 1 ), 10 * p))
                      : offlineTable($('#appDateTime6').val(), $('#appDateTime7').val(), p);
    }

    let setTableUI = (data) => {
        let str = "";
        for (let d of data) {
            str += " <li><p>" + dateFormat(d.data1) + "</p><p>" + d.data0 + "</p><p>" + d.data2 + "</p></li>";
        }
        $('.offVal').html(str);
    }

    // 车辆概况 logic
    $('.car-prepage, .car-nextpage').on('click',function() {
        carpage = pagingCtrl(this, carpage, refCarUI);
    });
    $('.off-prepage, .off-nextpage').on('click', function() {
        offpage = pagingCtrl(this, offpage, refTableUI);
    });
    $('.tcs').on('click',function() {
        $('.tcs').removeClass('active');
        $(this).addClass('active');
        typeId = $(this).attr('data-hourId');
        onlineCharts($('#appDateTime4').val(),$('#appDateTime5').val());
    });

    // 日历选择控制
    $('#appDateTime2, #appDateTime3').on('change',function () {
        isDateValid(2, 3) && getCarInfo($('#appDateTime2').val(), $('#appDateTime3').val(), 1)
    });

    $('#appDateTime4, #appDateTime5').on('change',function () {
        isDateValid(4, 5) && onlineCharts($('#appDateTime4').val(),$('#appDateTime5').val())
    });

    $('#appDateTime6, #appDateTime7').on('change',function () {
        if (isDateValid(6, 7)) {
            offlineChart($('#appDateTime6').val(),$('#appDateTime7').val());
            offlineTable($('#appDateTime6').val(),$('#appDateTime7').val(), 1);
        }
    });

    // 车辆状态时长
    let ctmChart = echarts.init(document.getElementById("ctmChart"));
    ctmChart.showLoading({ effect:'ring' });

    function carTiming() {
        let data = {
            cityId: cityVal,
            startDate: $('#appDateTime8').val(),
            endDate: $('#appDateTime9').val(),
            typeId: ctm_ct,
            state: ctm_operate
        }
        buildAjax('get', 'car/queryCarStateCahrt', data, true, false, function(res){
            CTM_CACHE = res.data;
            setCtmChartUI(CTM_CACHE);
        });
    }
    let refCtmChartUI = () => {
        CTM_CACHE ? setCtmChartUI(CTM_CACHE) : carTiming();
    }
    let setCtmChartUI = (d) => {
        ctmChart.clear();
        let str = "";
        let opt = ctm_operate == 1 ? ctmOptionOn : ctm_operate == 2 ? ctmOptionOff : ctmOptionAll;
        opt.xAxis.data = d.axis;
        opt.series = d.series;
        if (ctm_operate == 0) {
            str = "<div class='noteLine'> <p>上架时长 <span>" + d.cjsjsc + "</span> </p>" +
                  "<p>下架时长 <span>" + d.cjxjsc + "</span> </p>" +
                  "<p>停运时长 <span>" + d.cjtysc + "</span> </p> </div>";
        } else if (ctm_operate == 1) {
            str = "<div class='noteLine'> <p>待租时长 <span>" + d.dzsc + "</span> </p>" +
                  "<p>服务时长 <span>" + d.fwsc + "</span> </p>" +
                  "<p>预约时长 <span>" + d.yysc + "</span> </p> </div>";
        } else {
            str = "<div class='noteLine'> <p>运维时长 <span>" + d.xjywsc + "</span> </p>" +
                  "<p>物料缺失时长 <span>" + d.xjwlqs + "</span> </p>" +
                  "<p>机车离线时长 <span>" + d.xjcjlx + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>其他原因时长 <span>" + d.xjqtyy + "</span> </p>" +
                  "<p>低续航时长 <span>" + d.xjdxh + "</span> </p>" +
                  "<p>充电中时长 <span>" + d.xjcdz + "</span> </p>  </div>";
        }
        ctmChart.setOption(opt);
        ctmChart.hideLoading();
        $('.ctm-notebar').html(str)
    }
    // 车辆状态时长 logic
    $('#appDateTime8, #appDateTime9').on('change',function () {
        isDateValid(8, 9) && carTiming();
    });
    $('.ctm-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         ctm_ct = $(this).attr('data-type');
         carTiming();
    });
    $('#ctmtog').bind('input propertychange', function() {
        if ($('#ctmtog-val').val()){
            ctm_operate = $('#ctmtog-val').attr('value');
            carTiming();
        }
    });

    // 车辆时长概况
    function carTimingTable(p) {
        let data = {
            cityId: cityVal,
            typeId: ctt_ct,
            startDate: $('#appDateTime10').val(),
            endDate: $('#appDateTime11').val()
        }
        buildAjax('get', 'car/queryCarStateTable', data, true, false, function(res){
            CTT_CACHE = res.data.reverse();
            cttpage = resetPaging('ctt-nowpage');
            $('.ctt-allpage').html(Math.ceil(CTT_CACHE.length / 10) == 0 ? 1 : Math.ceil(CTT_CACHE.length / 10));
            setCttUI(CTT_CACHE.slice(10 * ( p - 1 ), 10 * p));
        }, false);
    }
    let refCttUI = (p) => {
        CTT_CACHE ? setCttUI(CTT_CACHE.slice(10 * ( p - 1 ), 10 * p)) : carTimingTable(1);
    }
    let setCttUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.cjsjsc + "</p>" +
            "<p>" + d.cjdzsc + "</p> <p>" + d.cjfwsc + "</p>" +
            "<p>" + d.cjywsc + "</p> <p>" + d.cjcdsc + "</p>" +
            "<p>" + d.cjdxhsc + "</p> <p>" + d.cjqtyysc + "</p>" +
            "<p>" + d.cjcjlxsc + "</p> <p>" + d.cjwlqssc + "</p></li>";
        }
        $('.ctt-fv').html(fv);
        $('.ctt-sv').html(sv);
    }
    // 车辆时长概况 logic
    $('.ctt-prepage, .ctt-nextpage').on('click',function() {
        cttpage = pagingCtrl(this, cttpage, refCttUI);
    });
    $('#appDateTime10, #appDateTime11').on('change',function () {
        isDateValid(10, 11) && carTimingTable(1);
    });
    $('.ctt-ct').on('click',function() {
        $('.ctt-ct').removeClass('active');
        $(this).addClass('active');
        ctt_ct = $(this).attr('data-type');
        carTimingTable(1);
    });


    // 城市车辆上架时长排名
    function timingTop(p) {
        let data = {
            cityId: cityVal,
            typeId: ttop_ct,
            dates: $('#appDateTime12').val(),
        }
        buildAjax('get', 'car/quqeyCityCarAvgrank', data, true, false, function(res){
            TTOP_CACHE = res.data;
            $('.ttop-allpage').html(Math.ceil(TTOP_CACHE.length / 10) == 0 ? 1 : Math.ceil(TTOP_CACHE.length / 10));
            setTtopUI(TTOP_CACHE.slice(10 * ( p - 1 ), 10 * p), p);
        }, false);
    }
    let refTtopUI = (p) => {
        TTOP_CACHE ? setTtopUI(TTOP_CACHE.slice(10 * ( p - 1 ), 10 * p), p) : timingTop(1);
    }
    let setTtopUI = (data, p) => {
        let str = "";
        for (let i in data) {
            str += "<li> <p>" + ((p-1)*10 + parseInt(i)+1) + "</p><p>" + data[i].cityname + "</p>" +
            "<p>" + data[i].cjsjsc + "h</p> <p>" + data[i].cjfwsc + "h</p>" +
            "<p>" + data[i].cjdzsc + "h</p> </li>";
        }
        $('.ttopVal').html(str);
    }

    // 城市车辆上架时长排名 logic
    $('.ttop-predate, .ttop-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                               : $('#'+id).val(updateDate(this.parentNode, 1, true));
        timingTop(1);
    });
    $('#appDateTime12').bind('change', function() {
        isDateValid(12) && timingTop(1);
        updateWeek(this);
    });
    $('.ttop-prepage, .ttop-nextpage').on('click',function() {
        ttoppage = pagingCtrl(this, ttoppage, refTtopUI);
    });
    $('.ttop-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         ttop_ct = $(this).attr('data-type');
         timingTop(1);
    });

    // 空驶率
    function emptyRun(p) {
        let data = {
            cityId: cityVal,
            typeId: er_ct,
            startDate: $('#appDateTime13').val(),
            endDate: $('#appDateTime14').val()
        }
        buildAjax('get', 'car/getAirRunRateCountData', data, true, false, function(res){
            ER_CACHE = res.data;
            $('.er-allpage').html(Math.ceil(ER_CACHE.length / 10) == 0 ? 1 : Math.ceil(ER_CACHE.length / 10));
            setErUI(ER_CACHE.slice(10 * ( p - 1 ), 10 * p));
        }, false);
    }
    let refErpUI = (p) => {
        ER_CACHE ? setErUI(ER_CACHE.slice(10 * ( p - 1 ), 10 * p)) : emptyRun(1);
    }
    let setErUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li><span>" + d.cityName + "</span></li>";
            sv += "<li><p>" + d.carMileage + "</p>" +
            "<p>" + d.orderMileage + "</p> <p>" + d.startRemainMileage + "</p>" +
            "<p>" + d.endRemainMileage + "</p> <p>" + d.operateRate + "%</p> </li>";
        }
        $('.er-fv').html(fv);
        $('.er-sv').html(sv);
    }
    // 空驶率 logic
    $('.er-prepage, .er-nextpage').on('click',function() {
        erpage = pagingCtrl(this, erpage, refErpUI);
    });
    $('#appDateTime13, #appDateTime14').on('change',function () {
        isDateValid(13, 14) && emptyRun(1);
    });
    $('.er-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         er_ct = $(this).attr('data-type');
         emptyRun(1);
    });

    // 车辆清洁
    function carClean(p) {
        let days = getDays($('#appMonth1').val());
        initTable(days);
        let data = {
            cityId: cityVal,
            monthId: $('#appMonth1').val()
        }
        buildAjax('get', 'car/getCityCarCleanDataInfo', data, true, false, function(res){
            CLEAN_CACHE = res.data;
            $('.cc-allpage').html(Math.ceil(CLEAN_CACHE.length / 10) == 0 ? 1 : Math.ceil(CLEAN_CACHE.length / 10));
            setCleanUI(CLEAN_CACHE.slice(10 * ( p - 1 ), 10 * p), days);
        }, false);
    }
    let refCleanUI = (p) => {
        let days = getDays($('#appMonth1').val());
        CLEAN_CACHE ? setCleanUI(CLEAN_CACHE.slice(10 * ( p - 1 ), 10 * p), days) : carClean(1);
    }
    let setCleanUI = (data, days) => {
        var fv1 = '', fv2 = '', sv = '';
        if ($('#appMonth1').val() == new Date().format('yyyyMM')) {
            days = days - 1;
        }
        for (let d of data) {
            fv1 += "<li><span>" + d.CityName + "</span></li>";
            fv2 += "<li>" + (d.real_count || '--') + "</li>";
            sv += "<li>";
            for (let i = 1; i <= days; i ++) {
                sv += "<p>" + d['s'+i] + "</p>";
            }
            sv += "<p>" + d.ss + "</p></li>";
        }
        $('.cc-fv1').html(fv1);
        $('.cc-fv2').html(fv2);
        $('.cc-sv').html(sv);
    }
    // 车辆清洁 表头生成
    function initTable(days) {
        // 本月份的当日清洁情况暂未输出，要扣除
        if ($('#appMonth1').val() == new Date().format('yyyyMM')) {
            days = days - 1;
        }
        var title = '';
        for (let i = 1; i <= days; i++) {
            title += "<p>" + i + "日</p>";
        }
        title += "<p>总计</p>"
        $('.cc-sh, .cc-sv').css({'width': days+1+'rem'});
        $('.cc-sh').html(title);
    }
    // 车辆清洁 logic
    $('#appMonth1').on('change', function(){
        isMonthValid(1) && carClean(1);
    });
    $('.cc-prepage, .cc-nextpage').on('click',function() {
        ccpage = pagingCtrl(this, ccpage, refCleanUI);
    });
    $('.cc-premonth, .cc-nextmonth').on('click', function(){
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'premonth' ? $('#'+id).val(updateMonth(this.parentNode, -1, true))
                                               : $('#'+id).val(updateMonth(this.parentNode, 1, true));
        carClean(1);
    })

});
