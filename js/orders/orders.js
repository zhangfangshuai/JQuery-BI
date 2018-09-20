/**
 * Created with webstorm.
 * Author: dameng
 * Date: 2017/11/15  09:05
 * Recode: zhangfs 2018/04/11 10:50
 * Note: Package and Add Handler
 */
$(function () {
    var ODH_CACHE;
    var cityVal = '', odCarType = 0;
    var odtype = 0, odHisType = 0, odwType = 0, cancelType = 0;
    var odhpage = '', odwpage = '';

    for (let i of [1,2,3,4,5,6,7]) {  // trigger scroller
        $('#appDateTime' + i).mobiscroll(APP.dateBar);
    }
    for (let i of [1,3,5,7]) {
        $('#appDateTime' + i).val(getDaysOffset(-1));
    }
    for (let i of [2,4,6]) {
        $('#appDateTime' + i).val(getDaysOffset(-7));
    }

    startingWeekYesterday(1);

    // 页面初始化
    getCity(function(res, cityInit) {
        cityVal = cityInit;
        getorderAnalyze($('#appDateTime1').val(), odtype);
        getCarType(0);
        getHistoryOrder(1);
        getCancelReason($('#appDateTime2').val(),$('#appDateTime3').val(), cancelType);
        orderWarning(1);
        getPrincipal(cityVal, [32,33]);
    }, false);

    //nav 城市改变 及其刷新数据
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val()=='') return;
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        cityVal = $('#value3').val();
        $('.phoneBubble').hide('fast');
        cityVal == '1' && $('.responsiblePerson-box').css('display','none');
        getorderAnalyze($('#appDateTime1').val(), odtype);
        getCarType(0);
        getHistoryOrder(1);
        getCancelReason($('#appDateTime2').val(),$('#appDateTime3').val(), cancelType);
        orderWarning(1);
        getPrincipal(cityVal, [32,33]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });

    // 车类型选择
    $('.od-ct, .odc-ct').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        let _type = $(this).attr('data-type')
        this.classList[1] == 'od-ct' ? getorderAnalyze($('#appDateTime1').val(), _type)
                                     : getCancelReason($('#appDateTime2').val(),$('#appDateTime3').val(), _type);
    })

    // 订单概况时间监控 单日期
    $('.od-predate, .od-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                          : $('#'+id).val(updateDate(this.parentNode, 1, true));
        getorderAnalyze($('#'+id).val(), 1);
    });
    // 订单概况时间监控 日历控件监控
    $('#appDateTime1').bind('change', function() {
        isDateValid(1) && getorderAnalyze($('#appDateTime1').val(), 1);
        updateWeek(this);
    });

    $('#appDateTime2, #appDateTime3').on('change',function () {
        isDateValid(2,3) && getCancelReason($('#appDateTime2').val(),$('#appDateTime3').val(), cancelType)
    });


    // 订单概况
    function getorderAnalyze(date, type) {
        let data = {
            cityId: cityVal,
            typeId: type,
            dateId: date
        }
        buildAjax('get', 'getorderAnalyze', data, true, false, function(res){
            var fv = '', sv = '';
            for (let d of res.data) {
                var imgUrl = d.avg_rate == 0 ? '' : '<img src="../images/'+ (d.avg_rate > 0 ? 'icon_rise' : 'icon_decline') + '.png"  class="orderUp fr" alt="">';
                fv += "<li>" + d.kpiname + "</li>";
                sv += "<li><p>" + d.month_t + "</p>" +
                    "<p>" + d.month_avg + "</p>" +
                    "<p>" + d.month_last_t + "</p>" +
                    "<p>" + d.month_last_avg + "</p>" +
                    "<p>" + d.avg_rate + '%' + imgUrl + "</p></li>";
            }
            $('.od-fv').html(fv);
            $('.od-sv').html(sv);
        }, false);
    }

    // 订单时长预警
    var ODW_CACHE;
    function orderWarning(p) {
        let data = {
            cityId: cityVal,
            typeId: odwType,
            startDate: $('#appDateTime4').val(),
            endDate: $('#appDateTime5').val()
        }
        buildAjax('get', 'getOrderTimeData', data, true, false, function(res) {
            ODW_CACHE = res.data;
            if (ODW_CACHE.length > 0) {
                odwpage = resetPaging('odw-nowpage');
                $('.odw-allpage').html(Math.ceil(ODW_CACHE.length / 10) == 0 ? 1 : Math.ceil(ODW_CACHE.length / 10));
                setOdwUI(ODW_CACHE.slice(0, 10), p);
            } else {
                setOdwUI(ODW_CACHE, p);
            }
        }, false)
    }
    let refOdwUI = (p) => {
        ODW_CACHE ? setOdwUI(ODW_CACHE.slice( 10 * ( p - 1 ), 10 * p), p) : orderWarning(p)
    }
    let setOdwUI = (data, p) => {
        let str = "";
        for (let d of data) {
            str += "<li> <p>" + d.CityName + "</p>" +
                "<p>" + d.avg_minute + "</p>" +
                "<p>" + d.avg_mileage + "</p>" +
                "<p>" + d.avg_minut_mile + "</p> </li>";
        }
        $('.odwVal').html(str);
    }
    // 订单时长预警 logic
    $('.odw-prepage, .odw-nextpage').on('click',function() {
        odwpage = pagingCtrl(this, odwpage, refOdwUI);
    });
    $('#appDateTime6, #appDateTime7').on('change',function () {
        isDateValid(6, 7) && orderWarning(1);
    });
    $('.odw-ct').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        odwType = $(this).attr('data-type');
        orderWarning(1);
    });

    // 获取车辆类型
    function getCarType(id) {
        id = id || 0;
        var cars = [];
        buildAjax('get', 'getcartypeById', {typeId: id}, true, false, function(res) {
            if (id != 0) {  // 类型为全部时，接口有返回全部选项
                cars.push({'text':'全部', 'value':0});
            }
            for (let d of res.data) {
                cars.push({'text':d.cartype, 'value':d.cartype_id})
            }
            APP.carNames = cars;
            triggerLArea('#odhf', '#odhf-val', APP.carNames);
        })
    }
    // 历史订单详情
    function getHistoryOrder(p) {
        let data = {
            cityId: cityVal,
            typeId: odHisType,
            carType: odCarType,
            startDate: $('#appDateTime4').val(),
            endDate: $('#appDateTime5').val()
        }
        buildAjax('get', 'getHistoryOrder', data, true, false, function(res) {
            ODH_CACHE = res.data.reverse();
            if (ODH_CACHE.length > 0) {
                odhpage = resetPaging('odHis-nowpage');
                $('.odHis-allpage').html(Math.ceil(ODH_CACHE.length / 10) == 0 ? 1 : Math.ceil(ODH_CACHE.length / 10));
                setOdhUI(ODH_CACHE.slice(0, 10), p);
            } else {
                setOdhUI(ODH_CACHE, p);
            }
        }, false)
    }
    let refOdhUI = (p) => {
        ODH_CACHE ? setOdhUI(ODH_CACHE.slice( 10 * ( p - 1 ), 10 * p), p)
                  : getHistoryOrder(p)
    }
    let setOdhUI = (data, p) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.order_total + "</p>" +
                "<p>" + d.order_up + "</p>" +
                "<p>" + d.order_cancel + "</p>" +
                "<p>" + d.order_real_avg + "</p>" +
                "<p>" + d.avg_sumAmount + "</p>" +
                "<p>" + d.avg_sumPayAmount + "</p>" +
                "<p>" + d.car_avgamount + "</p>" +
                "<p>" + d.car_avgpayamount + "</p></li>";
        }
        $('.oh-fv').html(fv);
        $('.oh-sv').html(sv);
        $('.oh-fv >li').eq(0).css('background', p == 1 ? '#c2fbcb' : 'transparent');
        $('.oh-sv >li').eq(0).css('background', p == 1 ? '#c2fbcb' : 'transparent');
    }
    // 历史订单 分页控制
    $('.odHis-prepage, .odHis-nextpage').on('click',function() {
        odhpage = pagingCtrl(this, odhpage, refOdhUI);
    });
    $('#appDateTime4, #appDateTime5').on('change',function () {
        isDateValid(4, 5) && getHistoryOrder(1);
    });
    $('#odhf').bind('input propertychange', function() {
        $('#odhf-val').val() && (odCarType = $('#odhf-val').val());
        getHistoryOrder(1);
    });
    $('.odh-ct').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        odHisType = $(this).attr('data-type');
        $('#odhf-val').val(0);
        $('#odhf').val('全部');
        odCarType = 0;
        getCarType(odHisType);
        getHistoryOrder(1);
    });


    //订单取消原因
    function getCancelReason(s, e, type){
        option5 = {
            label:{
                position:'bottom'
            },
            textStyle:{
                color:'#647888',
                fontSize:30
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                textStyle : {
                    color: '#fff',
                    decoration: 'none',
                    fontFamily: 'Verdana, sans-serif',
                    fontSize: 24,
                    fontStyle: 'italic',
                    fontWeight: 'bold'
                },
            },
            legend: {
                data: [],
                fontSize:30
            },
            color : ['#09CA65'],
            grid: {
                left: '2%',
                // right: '4%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data:[],
                axisLabel:{'fontSize':30,'interval':0,'rotate':90}
            },
            yAxis: {
                type: 'value',
                data: [],
                axisLabel:{'fontSize':30,'interval':0}
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: [],
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color: '#5B9BD5'
                            }
                        }
                    }
                }
            ]
        };
        var myChart5 = echarts.init(document.getElementById("orderCancel"));
        myChart5.showLoading({   // chart数据组装时的过渡控制
            effect:'ring'
        });
        let data = {
            cityId: cityVal,
            typeId: type,
            startDate: s,
            endDate: e
        }
        buildAjax('get','getCancelReason', data, true, false, function(res){
            option5.xAxis.data = res.data.axis;
            option5.series[0].data = res.data.series;
            myChart5.setOption(option5);
            myChart5.hideLoading();
        }, false);
    };

});
