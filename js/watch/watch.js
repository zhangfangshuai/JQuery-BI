/**
 * Created: dameng by webstorm
 * Date: 2017/11/15 09:05
 * Recode: zhangfs by Atom
 * Date: 2018/04/19 15:50
 */
$(function () {
    var INC_CACHE, CARR_CACHE, OR_CACHE, NG_CACHE, SR_CACHE;
    var incrpage = 1, carrpage = 1, orpage = 1, ngpage = 1, srpage = 1;
    var incReal_ct = 0, carReal_ct = 0, odReal_ct = 0, ngReal_ct = 0;
    var cityVal='',
        carr_operate = 0,   // 0-全部，1-上架，2-下架
        sr_hour = '';        // 网点时刻

    var today = getDaysOffset();
    for (let i of [1,2,3,4,5,6]) {
        $('#appDateTime'+i).mobiscroll(APP.dateBar);
        $('#appDateTime'+i).val(today);
        startingWeek(i);
    }

    triggerLArea('#carrtog', '#carrtog-val', APP.carOperateBar2);

    // 获取城市列表
    getCity(function(res, cityInit){
        cityVal = cityInit;
        incomeReal(today, incrpage);
        carStatus(today, carrpage);
        orderReal(today, orpage);
        newGuy(today, ngpage);
        carBattery(today);
        getPrincipal(cityVal, [1,2,3,4,5,6,7]);
    });

    // 切换城市 页面刷新
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val()=='') return
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        cityVal = $('#value3').val();
        cityVal == '1' && $('.responsiblePerson-box').hide('fast');
        $('.phoneBubble').hide('fast');
        for(let i of [1,2,3,4,5]) {
            $('#appDateTime'+i).val(today);
            startingWeek(i);
        }
        incomeReal(today, incrpage);
        carStatus(today, carrpage);
        orderReal(today, orpage);
        newGuy(today, ngpage);
        carBattery(today);
        getPrincipal(cityVal, [1,2,3,4,5,6,7]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });


    // 实时营收
    let incrChart = echarts.init(document.getElementById("incrChart"));
    incrChart.showLoading({ effect:'ring' });

    function incomeReal(date, p) {
        let data = {
            cityId: cityVal,
            dateId: date,
            carType: incReal_ct
        }
        buildAjax('get', 'getOrderRealAmount', data, true, false, function(res){
            // 实时营收 折线图
            option3.xAxis.data = res.data.data1;
            option3.series[0].data = res.data.data2;
            option3.series[1].data = res.data.data3;
            option3.series[2].data = res.data.data4;
            option3.series[3].data = res.data.data5;
            incrChart.setOption(option3);
            incrChart.hideLoading();

            // 实时营收 列表
            INC_CACHE = res.data.table;
            incrpage = resetPaging('incrtable-nowpage');
            $('.incrtable-allpage').html(Math.ceil(INC_CACHE.length / 10) == 0 ? 1 : Math.ceil(INC_CACHE.length / 10));
            setIrUI(INC_CACHE.slice(10 * ( p - 1 ), 10 * p));
        });
    }
    let refIrUI = (p) => {
        INC_CACHE ? setIrUI(INC_CACHE.slice(10 * ( p - 1 ), 10 * p))
                  : incomeReal($('#appDateTime3').val(), p);
    }
    let setIrUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
          fv += "<li>" + d.hour_id + " 时</li>";
          sv += "<li><p>" + d.amount_hour + "</p>" +
              "<p>" + d.payamoun_hour + "</p>" +
              "<p>" + d.couponAmount_hour + "</p>" +
              "<p>" + d.noPayAmount_hour + "</p>" +
              "<p>" + d.amount_hour_every + "</p>" +
              "<p>" + d.payamoun_hour_every + "</p>" +
              "<p>" + d.couponAmount_hour_every + "</p>" +
              "<p>" + d.noPayAmount_hour_every + "</p> </li>";
        }
        $('.ir-fv').html(fv);
        $('.ir-sv').html(sv);
    }

    // 实时营收折线图 logic
    $('.incr-predate, .incr-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                               : $('#'+id).val(updateDate(this.parentNode, 1, true));
        incomeReal($('#appDateTime3').val(), 1);
    });
    $('#appDateTime3').bind('change', function() {
        isDateValid(3) && incomeReal($('#appDateTime3').val(), 1);
        updateWeek(this);
    });
    $('.incr-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         incReal_ct = $(this).attr('data-type');
         incomeReal($('#appDateTime3').val(), 1);
    });
    $('.incrtable-prepage, .incrtable-nextpage').on('click', function(){
        incrpage = pagingCtrl(this, incrpage, refIrUI);
    });



    // 实时车辆状况
    let carrChart = echarts.init(document.getElementById("carrChart"));
    carrChart.showLoading({ effect:'ring' });

    function carStatus(date, p) {
        let data = {
            cityId: cityVal,
            dateId: date,
            carType: carReal_ct
        }
        buildAjax('get', 'getCarRealData', data, true, false, function(res){
            CAR_CACHE = res.data;
            // 车辆状况 堆叠图 - 默认展示全部车辆
            setCrChartUI(CAR_CACHE);
            // 车辆状况 列表
            carrpage = resetPaging('carr-nowpage');
            $('.carr-allpage').html(Math.ceil(CAR_CACHE.table.length / 10) == 0 ? 1 : Math.ceil(CAR_CACHE.table.length / 10));
            setCrUI(CAR_CACHE.table.slice(10 * ( p - 1 ), 10 * p));
        });
    }
    // 车辆现况 堆叠图刷新
    let refCrChartUI = () => {
        CAR_CACHE ? setCrChartUI(CAR_CACHE) : carStatus($('#appDateTime1').val(), carrpage);
    }
    let setCrChartUI = (d) => {
        carrChart.clear();
        let str = "";
        let opt = carr_operate == 1 ? optionOn : carr_operate == 2 ? optionDown : carr_operate == 3 ? optionOther : option;
        opt.xAxis.data = d.data1;
        if (carr_operate == 0) {
            opt.series[0].data = d.data2;
            opt.series[1].data = d.data3;
            opt.series[2].data = d.data4;
            str = "<div class='noteLine'> <p>后台车辆 <span>" + d.sumData0 + "</span> </p>" +
                  "<p>上架车辆 <span>" + d.sumData1 + "</span> </p>" +
                  "<p>实时上架率 <span>" + d.sumData2 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>运维下架 <span>" + d.sumData3 + "</span> </p>" +
                  "<p>其他车辆 <span>" + d.sumData16 + "</span> </p>" +
                  "<p>可运营车辆 <span>" + d.sumData17 + "</span> </p>  </div>";
        } else if (carr_operate == 1) {
            opt.series[0].data = d.data5;
            opt.series[1].data = d.data6;
            opt.series[2].data = d.data7;
            opt.series[3].data = d.data8;
            str = "<div class='noteLine'> <p>待租 <span>" + d.sumData6 + "</span> </p>" +
                  "<p>已预订 <span>" + d.sumData7 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>服务中-未取车 <span>" + d.sumData8 + "</span> </p>" +
                  "<p>服务中-已取车 <span>" + d.sumData9 + "</span> </p> </div>";
        } else if (carr_operate == 2) {
            opt.series[0].data = d.data9;
            opt.series[1].data = d.data10;
            opt.series[2].data = d.data11;
            opt.series[3].data = d.data12;
            opt.series[4].data = d.data13;
            opt.series[5].data = d.data14;
            opt.series[6].data = d.data16;
            opt.series[7].data = d.data18;
            str = "<div class='noteLine'> <p>运维中 <span>" + d.sumData10 + "</span> </p>" +
                  "<p>充电中 <span>" + d.sumData11 + "</span> </p>" +
                  "<p>物料缺失 <span>" + d.sumData13 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>车机离线 <span>" + d.sumData14 + "</span> </p>" +
                  "<p>低续航 <span>" + d.sumData4 + "</span> </p>" +
                  "<p>其他原因 <span>" + d.sumData15 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>维修中 <span>" + d.sumData12 + "</span> </p>" +
                  "<p>事故出险 <span>" + d.sumData19 + "</span> </p>" +
                  "<p> </p> </div>"
        } else {
            opt.series[0].data = d.data15;
            opt.series[1].data = d.data17;
            str = "<div class='noteLine'> <p>整备中 <span>" + d.sumData18 + "</span> </p>" +
                  "<p>停止运营 <span>" + d.sumData5 + "</span> </p> </div>"
        }
        carrChart.setOption(opt);
        carrChart.hideLoading();
        $('.carr-notebar').html(str)
    }
    // 车辆现况 列表刷新
    let refCrTableUI = (p) => {
        CAR_CACHE.table ? setCrUI(CAR_CACHE.table.slice(10 * ( p - 1 ), 10 * p))
                  : carStatus($('#appDateTime1').val(), carrpage);
    }
    let setCrUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + d.hour_id + " 时</li>";
            sv += "<li><p>" + d.car_num4 + "</p>" +
                "<p>" + d.car_num5 + "</p> <p>" + d.car_num6 + "</p>" +
                "<p>" + d.car_num7 + "</p> <p>" + d.car_num8 + "</p>" +
                "<p>" + d.car_num9 + "</p> <p>" + d.car_num10 + "</p>" +
                "<p>" + d.car_num11 + "</p> <p>" + d.car_num12 + "</p>" +
                "<p>" + d.car_num13 + "</p> <p>" + d.car_num14 + "</p>" +
                "<p>" + d.car_num15 + "</p> </li>";
        }
        $('.cr-fv').html(fv);
        $('.cr-sv').html(sv);
    }

    // 车辆现况 logic
    $('.carr-predate, .carr-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      carStatus($('#appDateTime1').val(), 1);
    });
    $('#appDateTime1').bind('change', function() {
        isDateValid(1) && carStatus($('#appDateTime1').val(), 1);
        updateWeek(this);
    });
    $('.carr-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         carReal_ct = $(this).attr('data-type');
         carStatus($('#appDateTime1').val(), 1);
    });
    // 车辆现况列表 logic
    $('.carr-prepage, .carr-nextpage').on('click', function(){
        carrpage = pagingCtrl(this, carrpage, refCrTableUI);
    });
    $('#carrtog').bind('input propertychange', function() {
        if ($('#carrtog-val').val()){
            carr_operate = $('#carrtog-val').attr('value');
            refCrChartUI();
        }
    });



    // 实时订单
    var orChart = echarts.init(document.getElementById("orChart"));
    orChart.showLoading({ effect:'ring' });

    function orderReal(date, p) {
        let data = {
            cityId: cityVal,
            dateId: date,
            carType: odReal_ct
        }
        buildAjax('get','getOrderRealData', data, true, false, function(res){
            OR_CACHE = res.data.table;
            // 实时订单 折线图
            option2.xAxis.data = res.data.data1;
            option2.series[0].data = res.data.data2;
            option2.series[1].data = res.data.data3;
            option2.series[2].data = res.data.data4;
            orChart.setOption(option2);
            orChart.hideLoading();
            let str = "<div class='noteLine'> <p>今日下单量 <span>" + res.data.sumData0 + "</span> </p>" +
                  "<p>今日取消单 <span>" + res.data.sumData2 + "</span> </p>" +
                  "<p>单均里程 <span>" + res.data.sumData4 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>今日取车单 <span>" + res.data.sumData1 + "</span> </p>" +
                  "<p>车均单 <span>" + res.data.sumData3 + "</span> </p>" +
                  "<p>单均时长 <span>" + res.data.sumData5 + "</span> </p> </div>";
            $('.or-notebar').html(str);

            // 实时订单 列表
            $('.or-allpage').html(Math.ceil(OR_CACHE.length / 10) == 0 ? 1 : Math.ceil(OR_CACHE.length / 10));
            orpage = resetPaging('or-nowpage');
            setOrUI(OR_CACHE.slice(10 * ( p - 1 ), 10 * p));
        });
    }
    let refOrUI = (p) => {
        OR_CACHE ? setOrUI(OR_CACHE.slice(10 * ( p - 1 ), 10 * p))
                 : orderReal($('$appDateTime2').val(), p);
    }
    let setOrUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
          fv += "<li>" + d.hour_id + " 时</li>";
          sv += "<li><p>" + d.ordernum_create_hour + "</p> <p>" + d.ordernum_up_hour + "</p>" +
              "<p>" + d.ordernum_cancel_hour + "</p> <p>" + d.ordernum_create_hour1 + "</p>" +
              "<p>" + d.ordernum_up_hour1 + "</p> <p>" + d.ordernum_cancel_hour1 + "</p>" +
              "<p>" + d.ordernum_up_hour_every + "</p> <p>" + d.sumMileage_hour_every + "</p>" +
              "<p>" + d.sumMinute_hour_every + "</p> </li>";
        }
        $('.or-fv').html(fv);
        $('.or-sv').html(sv);
    }

    // 实时订单折线图 logic
    $('.or-predate, .or-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      orderReal($('#'+id).val(), 1);
    });
    $('#appDateTime2').bind('change', function() {
        isDateValid(2) && orderReal($('#appDateTime2').val(), 1);
        updateWeek(this);
    });
    $('.or-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         odReal_ct = $(this).attr('data-type');
         orderReal($('#appDateTime2').val(), 1);
    });
    $('.or-prepage, .or-nextpage').on('click', function(){
        orpage = pagingCtrl(this, orpage, refOrUI);
    });



    // 实时新增用户
    var ngChart = echarts.init(document.getElementById("ngChart"));
    ngChart.showLoading({ effect:'ring' });

    function newGuy(date, p) {
        buildAjax('get', 'getRegisterRealData', {cityId:cityVal, dateId:date}, true, false, function(res){
            NG_CACHE = res.data.table;
            // 新增用户 折线图
            option4.xAxis.data = res.data.data1;
            option4.series[0].data = res.data.data2;
            option4.series[1].data = res.data.data3;
            option4.series[2].data = res.data.data4;
            option4.series[3].data = res.data.data5;
            option4.series[4].data = res.data.data6;
            ngChart.setOption(option4);
            ngChart.hideLoading();
            let str = "<div class='noteLine'> <p>今日注册数 <span>" + res.data.sumData0 + "</span> </p>" +
                  "<p>今日新增双证 <span>" + res.data.sumData1 + "</span> </p>" +
                  "<p> <span></span> </p> </div>" +
                  "<div class='noteLine'> <p>今日下单用户 <span>" + res.data.sumData3 + "</span> </p>" +
                  "<p>今日押金用户 <span>" + res.data.sumData2 + "</span> </p>" +
                  "<p>今日首单用户 <span>" + res.data.sumData4 + "</span> </p> </div>";
            $('.ng-notebar').html(str);

            // 新增用户 列表数据
            $('.ng-allpage').html(Math.ceil(NG_CACHE.length / 10) == 0 ? 1 : Math.ceil(NG_CACHE.length / 10));
            ngpage = resetPaging('ng-nowpage');
            setNgUI(NG_CACHE.slice(10 * ( p - 1 ), 10 * p));
        });
    }
    let refNgUI = (p) => {
        NG_CACHE ? setNgUI(NG_CACHE.slice(10 * ( p - 1 ), 10 * p))
                 : newGuy($('#appDateTime4').val(), p);
    }
    let setNgUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + d.hour_id + " 时</li>";
            sv += "<li><p>" + d.users_reg_hour + "</p>" +
                "<p>" + d.users_audit_hour + "</p>" +
                "<p>" + d.deposit_users_hour + "</p>" +
                "<p>" + d.order_users_hour + "</p>" +
                "<p>" + d.orderfirst_users_hour + "</p> </li>";
        }
        $('.ng-fv').html(fv);
        $('.ng-sv').html(sv);
    }

    // 新增用户折线图 logic
    $('.ng-predate, .ng-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      newGuy($('#'+id).val(), 1);
    });
    $('#appDateTime4').bind('change', function() {
        isDateValid(4) && newGuy($('#appDateTime4').val(), 1);
        updateWeek(this);
    });
    $('.ng-prepage, .ng-nextpage').on('click', function(){
        ngpage = pagingCtrl(this, ngpage, refNgUI);
    });


    // 车辆电量
    var cbChart = echarts.init(document.getElementById("cbChart"));
    cbChart.showLoading({ effect:'ring' });

    function carBattery(date) {
        buildAjax('get', 'getKpiCarPower', {cityId:cityVal,dateId:date}, true, false, function(res) {
            option5.xAxis.data = res.data.data1;
            option5.series[0].data = res.data.data2;
            option5.series[1].data = res.data.data3;
            option5.series[2].data = res.data.data4;
            option5.series[3].data = res.data.data5;
            option5.series[4].data = res.data.data6;
            cbChart.setOption(option5);
            cbChart.hideLoading();
            let str = "<div class='noteLine'> <p>待租65%以下车辆 <span>" + res.data.sumData0 + "</span> </p>" +
                      "<p>下架65%以下车辆 <span>" + res.data.sumData1 + "</span> </p> </div>"
            $('.cb-notebar').html(str);
        });
    }

    // 车辆电量 时间监控
    $('.cb-predate, .cb-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      carBattery($('#'+id).val());
    });
    // 车辆电量 日历控件修改
    $('#appDateTime5').bind('change', function() {
        isDateValid(5) && carBattery($('#appDateTime5').val());
        updateWeek(this);
    });
});
