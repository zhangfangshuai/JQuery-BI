/**
 * Date: 2017/11/15 09:05
 * Create: zhangfs by Atom - 2018/04/16
 */
$(function () {
    var DAUT_CACHE, DUR_CACHE, DC_CACHE;
    var dautpage = 1, durpage = 1, dcpage = 1;
    var duaF_appOs = 1, duaT_appOs = 1, dur_appOs = 1;
    var cityVal = '';

    var weekAgo = getDaysOffset(-7),
        yesterday = getDaysOffset(-1);
    for (let i of [1,2,3,4,5,6]) {
        $('#appDateTime'+i).mobiscroll(APP.dateBar);
    }
    for (let i of [1,3]) {
        $('#appDateTime'+i).val(weekAgo);
    }
    for (let i of [2,4,5,6]) {
        $('#appDateTime'+i).val(yesterday);
    }

    startingWeekYesterday(5);
    startingWeekYesterday(6);
    // 获取城市列表，并初始化数据
    getCity(function(res, cityInit){
        cityVal = cityInit;
        buildAjax('get', 'dau/getAppVersions', {}, true, false, function(res) {
            APP.appVersions = [{'text':'全部','value':''}];
            for (let v of res.data) {
                APP.appVersions.push({'text':v,'value':v});
            }
            triggerLArea('#dauf', '#dauf-val', APP.appVersions);
            triggerLArea('#dauT', '#dauT-val', APP.appVersions);
            triggerLArea('#dur', '#dur-val', APP.appVersions);
            dauFunnel();
            dauTable();
            diffUserReport();
            diffCity();
        })
    });

    // 城市效果联动
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val() == '') return;
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        cityVal = $('#value3').val();
        $('.phoneBubble').hide('fast');
        cityVal == '1' && $('.responsiblePerson-box').hide('fast');
        dauFunnel();
        dauTable();
        diffUserReport();
        diffCity();
        // getPrincipal(cityVal, []);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });


    /**
     * DAU漏斗
     */
    var dauOpenFunnel = echarts.init(document.getElementById("dauOpenFunnel"));
    dauOpenFunnel.showLoading({ effect:'ring' });
    var dauStartFunnel = echarts.init(document.getElementById("dauStartFunnel"));
    dauStartFunnel.showLoading({ effect:'ring' });

    function dauFunnel() {
        let param = {
            cityId: cityVal,
            appVersion: $('#dauT-val').val(),
            dateId: $('#appDateTime6').val(),
            os: duaF_appOs
        }
        buildAjax('get', 'dau/getReportByPeople', param, true, false, function(res){
            let nums = res.data.nums,
                userNum = res.data.userNum,
                names = [];
            try {
                for(let d of nums) {
                  names.push(d.name);
                }
                var openOption = funnelOption;
                openOption.series[0].data = nums;
                openOption.legend.data = names;
                dauOpenFunnel.setOption(openOption);
                for(let d of userNum) {
                    names.push(d.name);
                }
                var startOption = funnelOption;
                startOption.series[0].data = userNum;
                startOption.legend.data = names;
                dauStartFunnel.setOption(startOption);
            } catch (e) {
                console.log('DAU漏斗无数据', e);
            }
            dauOpenFunnel.hideLoading();
            dauStartFunnel.hideLoading();
        }, false);
    }
    // DAU漏斗 版本切换
    $('#dauf').bind('input propertychange', function() {
        $('#dauf-val').val() && dauFunnel();
    });
    // DAU漏斗 系统切换
    $('.dauf-set').on('click', function() {
        $('.dauf-set').removeClass('active');
        $(this).addClass('active');
        duaF_appOs = $(this).attr('data');
        dauFunnel();
    });
    // DAU漏斗 时间监控
    $('.dauf-predate, .dauf-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                               : $('#'+id).val(updateDate(this.parentNode, 1, true));
        dauFunnel();
    });
    // DAU漏斗 日历控件监控
    $('#appDateTime6').bind('change', function() {
        isDateValid(6) && dauFunnel();
        updateWeek(this);
    });


    /**
     * DAU统计报表
     **/
    function dauTable() {
        let param = {
            cityId: cityVal,
            appVersion: $('#dauT-val').val(),
            os: duaT_appOs,
            startDate: $('#appDateTime1').val(),
            endDate: $('#appDateTime2').val()
        };
        buildAjax('get', 'dau/getDauListReport', param, true, false, function(res) {
            DAUT_CACHE = res.data.reverse();
            dautpage = resetPaging('dauT-nowpage');
            $('.dauT-allpage').html(Math.ceil(DAUT_CACHE.length / 10) == 0 ? 1 : Math.ceil(DAUT_CACHE.length / 10));
            setDautUI(DAUT_CACHE.slice(0, 10));
        }, false);
    }
    let refDautUI = (p) => {
        DAUT_CACHE ? setDautUI(DAUT_CACHE.slice(10 * ( p - 1 ), 10 * p)) : dauTable();
    }
    let setDautUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
          fv += "<li>" + dateFormat(d.dateId) + "</li>";
          sv += "<li><p>" + d.startappUsers + "</p>" +
              "<p>" + d.pickupcarUsers + "</p>" +
              "<p>" + d.returncarUsers + "</p>" +
              "<p>" + d.downorderUsers + "</p></li>"
        }
        $('.dauT-fv').html(fv);
        $('.dauT-sv').html(sv);
    }
    // DAU统计报表 app版本切换
    $('#dauT').bind('input propertychange', function() {
        $('#dauT-val').val() && dauTable();
    });
    // DAU统计报表 系统切换
    $('.dauT-set').on('click', function() {
        $('.dauT-set').removeClass('active');
        $(this).addClass('active');
        duaT_appOs = $(this).attr('data');
        dauTable();
    });
    // DAU统计报表 时间监控
    $('#appDateTime1, #appDateTime2').on('change', function(){
        isDateValid(1, 2) && dauTable();
    })
    // DAU统计报表 分页控制
    $('.dauT-prepage, .dauT-nextpage').on('click', function(){
        dautpage = pagingCtrl(this, dautpage, refDautUI);
    });


    /**
     * 不同类型用户启动APP报表
     **/
    function diffUserReport() {
        let param = {
            cityId: cityVal,
            appVersion: $('#dur-val').val(),
            os: dur_appOs,
            startDate: $('#appDateTime3').val(),
            endDate: $('#appDateTime4').val()
        };
        buildAjax('get', 'dau/getOpenListReport', param, true, false, function(res) {
            DUR_CACHE = res.data.reverse();
            durpage = resetPaging('dur-nowpage');
            $('.dur-allpage').html(Math.ceil(DUR_CACHE.length / 10) == 0 ? 1 : Math.ceil(DUR_CACHE.length / 10));
            setDurUI(DUR_CACHE.slice(0, 10));
        }, false);
    }
    let refDurUI = (p) => {
        DUR_CACHE ? setDurUI(DUR_CACHE.slice(10 * ( p - 1 ), 10 * p)) : diffUserReport();
    }
    let setDurUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
          fv += "<li>" + dateFormat(d.dateId) + "</li>";
          sv += "<li><p>" + d.openappRegusers + "</p>" +
              "<p>" + d.openappAuditusers + "</p>" +
              "<p>" + d.openappUsableusers + "</p></li>"
        }
        $('.dur-fv').html(fv);
        $('.dur-sv').html(sv);
    }
    // 启动APP报表 logic
    $('#dur').bind('input propertychange', function() {
        $('#dur-val').val() && diffUserReport();
    });
    $('.dur-set').on('click', function() {
        $('.dur-set').removeClass('active');
        $(this).addClass('active');
        dur_appOs = $(this).attr('data');
        diffUserReport();
    });
    $('#appDateTime3, #appDateTime4').on('change', function(){
        isDateValid(3, 4) && diffUserReport();
    })
    $('.dur-prepage, .dur-nextpage').on('click', function(){
        durpage = pagingCtrl(this, durpage, refDurUI);
    });


    /**
     * 不同城市对比
     */
    function diffCity() {
        let param = {
            dateId: $('#appDateTime5').val()
        };
        buildAjax('get', 'dau/getDauCityList', param, true, false, function(res){
            DC_CACHE = res.data;
            dcpage = resetPaging('dc-nowpage');
            $('.dc-allpage').html(Math.ceil(DC_CACHE.length / 10) == 0 ? 1 : Math.ceil(DC_CACHE.length / 10));
            setDcUI(DC_CACHE.slice(0, 10));
        });
    }
    let refDcUI = (p) => {
        DC_CACHE ? setDcUI(DC_CACHE.slice(10 * (p - 1), 10 * p)) : diffCity();
    }
    let setDcUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li> <span>" + d.cityName + "</span></li>";
            sv += "<li><p>" + d.dauUsers + "</p>" +
                "<p>" + d.usableUsers + "</p>" +
                "<p>" + d.openappUsablenum + "</p>" +
                "<p>" + d.usableRate + "%</p>" +
                "<p>" + d.pickupcarUsers + "</p>" +
                "<p>" + d.returncarUsers + "</p>" +
                "<p>" + d.downorderUsers + "</p>" +
                "<p>" + d.orderRate + "%</p></li>"
        }
        $('.dc-fv').html(fv);
        $('.dc-sv').html(sv);
    }
    // 不同城市对比 logic
    $('.dc-predate, .dc-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                               : $('#'+id).val(updateDate(this.parentNode, 1, true));
        diffCity();
    });
    $('#appDateTime5').bind('change', function() {
        isDateValid(5) && diffCity();
        updateWeek(this);
    });
    $('.dc-prepage, .dc-nextpage').on('click', function(){
        dcpage = pagingCtrl(this, dcpage, refDcUI);
    });
});
