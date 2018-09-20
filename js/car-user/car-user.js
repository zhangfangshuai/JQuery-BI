/**
 * Created with webstorm.
 * Author: dameng
 * Date: 2017/11/15 09:05
 * Recode: zhangfs by Atom - 2018/04/16
 * Note: Package and Add Handler   old: 828 lines;
 */
$(function () {
    var REGIST_CACHE, LICENSE_CACHE, CARUSABLE_CACHE, PURCHASE_CACHE, FO_CACHE, STAY_CACHE, RECALL_CACHE, OU_CACHE;
    var registpage = 1, licpage = 1, cupage = 1, purcpage = 1, fopage = 1, staypage = 1, recallpage = 1, oupage = 1;
    var cityVal = '',
        appId = '1',       // 1;2
        ut_period = "1";   // 用户转化
    var dayline = '-7',    // 老拉新 -7；-15；-30；-60
        daycircle = '1';   // 新用户渠道占比 1；2；3；4

    var weekAgo = getDaysOffset(-7),
        yesterday = getDaysOffset(-1),
        lastMonth = getMonthOffset(-1);
        thisMonth = getMonthOffset();

    for (let i of [1,2,3,4,5,6,7,8]) {
        $('#appDateTime'+i).mobiscroll(APP.dateBar);
    }
    for (let i of [1,2,3,4]) {
        $('#appMonth'+i).mobiscroll(APP.monthBar);
    }
    for (let i of [1,3,5,7]) {
        $('#appDateTime'+i).val(weekAgo);
    }
    for (let i of [2,4,6,8]) {
        $('#appDateTime'+i).val(yesterday);
    }
    for (let i of [1,2,3,4]) {
        $('#appMonth'+i).val(thisMonth)
    }

    triggerLArea('#ut', '#ut-val', APP.userPeriodBar);

    // 获取城市列表，并初始化数据
    getCity(function(res, cityInit){
        cityVal = cityInit;
        $('.simpleSelection').hide();
        refInit();
        getPrincipal(cityVal, [15,22,24,26,27,31]);
    });

    //nav 城市改变 及其刷新数据
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val() == '') return;
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        cityVal = $('#value3').val();
        $('.phoneBubble').hide('fast');
        $('.simpleSelection').hide();
        cityVal == '1' && $('.responsiblePerson-box').hide('fast');
        refInit();
        getPrincipal(cityVal, [15,22,24,26,27,31]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });

    // 页面初始化
    function refInit() {
        userTransform();
        userRegist();
        userLicense();
        carUsable();
        userPurchase();
        orderUserRate();
        orderTotals();
        firstOrderUser();
        thisMonthKeep();
        recallUser();
    }

    /**
     * 用户转化漏斗图
     */
    var myChart3 = echarts.init(document.getElementById("ut-funnel"));
    myChart3.showLoading({ effect:'ring' });

    function userTransform() {
        buildAjax('get', 'MUser/MuserTransformData', {cityId: cityVal,reportId: ut_period}, true, false, function(res){
            let arr = [];
            for(let d of res.data) {
                arr.push(d.name)
            }
            funnelOption.series[0].data = res.data;
            funnelOption.legend.data = arr.reverse();
            myChart3.setOption(funnelOption);
            myChart3.hideLoading();
        }, false);
    }

    $('#ut').bind('input propertychange', function() {
        if ($('#ut-val').val()){
            ut_period = $('#ut-val').attr('value');
            userTransform();
        }
    });

    $('.ut-set').on('click', function() {
        $('.ut-set').removeClass('active');
        $(this).addClass('active');
        if ($(this).html() == '新增') {
            $('.simpleSelection').show('fast');
            $('#ut').html('近7日');
            ut_period = 2;
        } else {
            $('.simpleSelection').hide('fast');
            ut_period = 1;
        }
        userTransform();
    })

    /**
     * 用户注册分析
     */
    function userRegist() {
        let params = {
            cityId: cityVal,
            startDate: $('#appDateTime1').val(),
            endDate: $('#appDateTime2').val()
        }
        buildAjax('get', 'User/SignInTableData', params, true, false, function(res){
            REGIST_CACHE = res.data;
            registpage = resetPaging('regist-nowpage');
            $('.regist-allpage').html(Math.ceil(REGIST_CACHE.length / 10) == 0 ? 1 : Math.ceil(REGIST_CACHE.length / 10));
            setRegistUI(REGIST_CACHE.slice(0, 10));
        }, false);
    }
    let refRegistUI = (p) => {
        REGIST_CACHE ? setRegistUI(REGIST_CACHE.slice(10 * ( p - 1 ), 10 * p)) : userRegist();
    }
    let setRegistUI = (data) => {
        let str = "";
        for (let d of data) {
          str += "<li> <p>" + dateFormat(d.date_id) + "</p>" +
              "<p>" + d.users_reg_t + "</p>" +
              "<p>" + d.users_reg + "</p>" +
              "<p>" + d.users_reg_inviter + "</p>" +
              "<p>" + d.inviter_rate + "%</p> </li>"
        }
        $('.registVal').html(str);
    }
    // 用户注册分析 logic
    $('#appDateTime1, #appDateTime2').on('change', function(){
        isDateValid(1, 2) && userRegist();
    })
    $('.regist-prepage, .regist-nextpage').on('click', function(){
        registpage = pagingCtrl(this, registpage, refRegistUI);
    });


    /**
     * 用户双证分析
     */
    function userLicense () {
        let params = {
            cityId: cityVal,
            startDate: $('#appDateTime3').val(),
            endDate: $('#appDateTime4').val()
        }
        buildAjax('get','User/DoubleCertificale', params, true, false, function(res){
            LICENSE_CACHE = res.data;
            licpage = resetPaging('ulic-nowpage');
            $('.ulic-allpage').html(Math.ceil(LICENSE_CACHE.length / 10) == 0 ? 1 : Math.ceil(LICENSE_CACHE.length / 10));
            setLicenseUI(LICENSE_CACHE.slice(0, 10));
        });
    }
    let refLicenseUI = (p) => {
        LICENSE_CACHE ? setLicenseUI(LICENSE_CACHE.slice(10 * ( p - 1 ), 10 * p)) : userLicense();
    }
    let setLicenseUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.users_audit_t + "</p>" +
                "<p>" + d.users_id_t + "</p>" +
                "<p>" + d.users_drive_t + "</p>" +
                "<p>" + d.users_audit_new + "</p>" +
                "<p>" + d.users_id_new + "</p>" +
                "<p>" + d.users_drive_new + "</p>" +
                "<p>" + d.audit_rate + "%</p> </li>";
        }
        $('.lic-fv').html(fv);
        $('.lic-sv').html(sv);
    }
    // 用户双证分析 logic
    $('#appDateTime3, #appDateTime4').on('change', function(){
        isDateValid(3, 4) && userLicense();
    })
    $('.ulic-prepage, .ulic-nextpage').on('click', function(){
        licpage = pagingCtrl(this, licpage, refLicenseUI);
    });


    /**
     * 可用车用户分析
     */
    function carUsable () {
        let params = {
            cityId: cityVal,
            startDate: $('#appDateTime5').val(),
            endDate: $('#appDateTime6').val()
        };
        buildAjax('get', 'User/UsableCarUser', params, true, false, function(res) {
            CARUSABLE_CACHE = res.data;
            cupage = resetPaging('cu-nowpage');
            $('.cu-allpage').html(Math.ceil(CARUSABLE_CACHE.length / 10) == 0 ? 1 : Math.ceil(CARUSABLE_CACHE.length / 10));
            setCuUI(CARUSABLE_CACHE.slice(0, 10));
        });
    }
    let refCuUI = (p) => {
        CARUSABLE_CACHE ? setCuUI(CARUSABLE_CACHE.slice( 10 * ( p - 1), 10 * p )) : carUsable();
    }
    let setCuUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.users_usable_t + "</p>" +
                "<p>" + d.deposit_users1_t + "</p>" +
                "<p>" + d.zmxy_users_t + "</p>" +
                "<p>" + d.users_usable + "</p>" +
                "<p>" + d.deposit_users1 + "</p>" +
                "<p>" + d.zmxy_users + "</p>" +
                "<p>" + d.users_usable_rate + "%</p> </li>";
        }
        $('.cu-fv').html(fv);
        $('.cu-sv').html(sv);
    }
    // 可用车用户分析 logic
    $('#appDateTime5, #appDateTime6').on('change', function() {
        isDateValid(5, 6) && carUsable();
    })
    $('.cu-prepage, .cu-nextpage').on('click', function() {
        cupage = pagingCtrl(this, cupage, refCuUI);
    });


    /**
     * 下单用户分析
     */
    function userPurchase() {
        let params = {
            cityId: cityVal,
            startDate: $('#appDateTime7').val(),
            endDate: $('#appDateTime8').val()
        };
        buildAjax('get', 'User/PlaceAnOrder', params, true, false, function(res){
            PURCHASE_CACHE = res.data;
            purcpage = resetPaging('purc-nowpage');
            $('.purc-allpage').html(Math.ceil(PURCHASE_CACHE.length / 10) == 0 ? 1 : Math.ceil(PURCHASE_CACHE.length / 10));
            setPurcUI(PURCHASE_CACHE.slice(0, 10));
        });
    }
    let refPurcUI = (p) => {
        PURCHASE_CACHE ? setPurcUI(PURCHASE_CACHE.slice(10 * ( p - 1 ), 10 * p)) : userPurchase();
    }
    let setPurcUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.users_order + "</p>" +
                "<p>" + d.users_fristorder + "</p>" +
                "<p>" + d.users_oldorder + "</p>" +
                "<p>" + d.users_fristorder_rate + "%</p>" +
                "<p>" + d.users_oldorder_rate + "%</p>" +
                "<p>" + d.users_order_rate + "%</p> </li>";
        }
        $('.purc-fv').html(fv);
        $('.purc-sv').html(sv);
    }
    // 下单用户分析 logic
    $('#appDateTime7, #appDateTime8').on('change', function() {
        isDateValid(7, 8) && userPurchase();
    })
    $('.purc-prepage, .purc-nextpage').on('click', function(){
        purcpage = pagingCtrl(this, purcpage, refPurcUI);
    });


    /**
     * 订单用户占比分析
     */
    var odUserRateChart = echarts.init(document.getElementById("odUserRateChart"));
    odUserRateChart.showLoading({ effect:'ring' });

    function orderUserRate() {
        let params = {
            cityId: cityVal,
            dateId: $('#appMonth1').val()
        };
        buildAjax('get', 'MUser/getOrderUserRate', params, true, false, function(res) {
            try {
                res.data.arr.reverse().push('订单用户数');
                var stack = 0, suppportData = [0], barData = [];
                for (let d of res.data.listData) {
                    stack += d.value;
                }
                barData.push(stack);
                for (let d of res.data.listData) {
                    suppportData.unshift((stack - d.value));
                    stack += -d.value;
                    barData.unshift(d.value);
                }
                barOption.xAxis.data = res.data.arr;
                barOption.series[0].data = suppportData;
                barOption.series[1].data = barData;
                odUserRateChart.setOption(barOption);
            } catch (e){
                Tip.success('当月占比数据异常');
                console.log(e);
            }
            odUserRateChart.hideLoading();
        });
    }
    // 订单用户(占比)分析 logic
    $('#appMonth1').on('change', function(){
        isMonthValid(1) && orderUserRate() && orderTotals();
    })
    $('.odUserRate-premonth, .odUserRate-nextmonth').on('click', function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'premonth' ? $('#'+id).val(updateMonth(this.parentNode, -1, true)) : $('#'+id).val(updateMonth(this.parentNode, 1, true));
        orderUserRate();
        orderTotals();
    });

    /**
     * 订单用户数据分析 与上表联动
     */
     function orderTotals() {
        let params = {
            cityId: cityVal,
            dateId: $('#appMonth1').val()
        };
        buildAjax('get', 'MUser/getFactOrderTotals', params, true, false, function(res) {
            OU_CACHE = res.data;
            console.log(res.data);
            oupage = resetPaging('ou-nowpage');
            $('.ou-allpage').html(Math.ceil(OU_CACHE.length/10) == 0 ? 1: Math.ceil(OU_CACHE.length/10));
            setOuUI(OU_CACHE.slice(0, 10));
        })
     };
     let refOuUI = (p) => {
         OU_CACHE ? setOuUI(OU_CACHE.slice(10 * ( p - 1 ), 10 * p)) : orderTotals();
     };
     let setOuUI = (data) => {
         var fv = '', sv = '';
         for (let d of data) {
             fv += "<li><span>" + d.cityname + "</span></li>";
             sv += "<li><p>" + nullHandle(d.total_user_num) + "</p>" +
                 "<p>" + nullHandle(d.user_num) + "</p>" +
                 "<p>" + nullHandle(d.order_num) + "</p>" +
                 "<p>" + nullHandle(d.firstuser_num) + "</p>" +
                 "<p>" + nullHandle(d.olduser_num) + "</p>" +
                 "<p>" + nullHandle(d.order_user_avg) + "</p>" +
                 "<p>" + nullHandle(d.remainuser_num) + "</p>" +
                 "<p>" + nullHandle(d.recalluser_num) + "</p>" +
                 "<p>" + nullHandle(d.firstuser_num_rate) + (d.firstuser_num_rate ? "%" : '') + "</p>" +
                 "<p>" + nullHandle(d.olduser_rate) + (d.olduser_rate ? "%" : '') + "</p> </li>";
         }
         $('.ou-fv').html(fv);
         $('.ou-sv').html(sv);
     };
     // 订单用户数据分析 logic
     $('.ou-prepage, .ou-nextpage').on('click', function(){
         oupage = pagingCtrl(this, oupage, refOuUI);
     });


    /**
     * 首单用户分析
     */
    function firstOrderUser() {
        let params = {
            cityId: cityVal,
            dateId: $('#appMonth2').val()
        }
        buildAjax('get', 'MUser/getfirstOrderUser', params, true, false, function(res){
            FO_CACHE = res.data;
            fopage = resetPaging('fo-nowpage');
            $('.fo-allpage').html(Math.ceil(FO_CACHE.length/10) == 0 ? 1: Math.ceil(FO_CACHE.length/10));
            setFoUI(FO_CACHE.slice(0, 10));
        });
    }
    let refFoUI = (p) => {
        FO_CACHE ? setFoUI(FO_CACHE.slice(10 * ( p - 1 ), 10 * p)) : firstOrderUser();
    }
    let setFoUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li><span>" + d.cityname + "</span></li>";
            sv += "<li><p>" + nullHandle(d.firstuser_num) + "</p>" +
                "<p>" + nullHandle(d.firstuser_order_num) + "</p>" +
                "<p>" + nullHandle(d.firstuser_order_avg) + "</p>" +
                "<p>" + nullHandle(d.firstuser_num_rate) + (d.firstuser_num_rate ? "%" : '') + "</p> </li>";
        }
        $('.fo-fv').html(fv);
        $('.fo-sv').html(sv);
    }
    // 首单用户分析 logic
    $('#appMonth2').on('change', function(){
        isMonthValid(2) && firstOrderUser();
    })
    $('.fo-premonth, .fo-nextmonth').on('click', function(){
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'premonth' ? $('#'+id).val(updateMonth(this.parentNode, -1, true))
                                               : $('#'+id).val(updateMonth(this.parentNode, 1, true));
        firstOrderUser();
    })
    $('.fo-prepage, .fo-nextpage').on('click', function(){
        fopage = pagingCtrl(this, fopage, refFoUI);
    });


    /**
     * 留存用户分析
     */
    function thisMonthKeep() {
        let params = {
            cityId: cityVal,
            dateId: $('#appMonth3').val()
        }
        buildAjax('get', 'MUser/getthisMonthKeep', params, true, false, function(res){
            STAY_CACHE = res.data;
            staypage = resetPaging('uStay-nowpage');
            $('.uStay-allpage').html(Math.ceil(STAY_CACHE.length/10) == 0 ? 1: Math.ceil(STAY_CACHE.length/10));
            setStayUI(STAY_CACHE.slice(0, 10));
        });
    }
    let refStayUI = (p) => {
        STAY_CACHE ? setStayUI(STAY_CACHE.slice(10 * ( p - 1 ), 10 * p)) : thisMonthKeep();
    }
    let setStayUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li><span>" + d.cityname + "</span></li>";
            sv += "<li><p>" + nullHandle(d.remainuser_num) + "</p>" +
                "<p>" + nullHandle(d.remain_lmfirst_user_num) + "</p>" +
                "<p>" + nullHandle(d.remain_lmold_user_num) + "</p>" +
                "<p>" + nullHandle(d.remainuser_order_num) + "</p>" +
                "<p>" + nullHandle(d.remainuser_order_avg) + "</p>" +
                "<p>" + nullHandle(d.remainuser_num_rate) + (d.remainuser_num_rate ? "%" : '') + "</p> </li>";
        }
        $('.uStay-fv').html(fv);
        $('.uStay-sv').html(sv);
    }
    // 留存用户分析 logic
    $('#appMonth3').on('change', function(){
        isMonthValid(3) && thisMonthKeep();
    })
    $('.uStay-premonth, .uStay-nextmonth').on('click', function(){
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'premonth' ? $('#'+id).val(updateMonth(this.parentNode, -1, true))
                                               : $('#'+id).val(updateMonth(this.parentNode, 1, true));
        thisMonthKeep();
    })
    $('.uStay-prepage, .uStay-nextpage').on('click', function(){
        staypage = pagingCtrl(this, staypage, refStayUI);
    });


    /**
     * 召回用户分析
     */
    function recallUser() {
        let params = {
            cityId: cityVal,
            dateId: $('#appMonth4').val()
        }
        buildAjax('get', 'MUser/getthisMonthRecallUser', params, true, false, function(res){
            RECALL_CACHE = res.data;
            recallpage = resetPaging('recall-nowpage');
            $('.recall-allpage').html(Math.ceil(RECALL_CACHE.length/10) == 0 ? 1: Math.ceil(RECALL_CACHE.length/10));
            setRcUI(RECALL_CACHE.slice(0, 10));
        });
    }
    let refRcUI = (p) => {
        RECALL_CACHE ? setRcUI(RECALL_CACHE.slice(10 * ( p - 1 ), 10 * p)) : recallUser();
    }
    let setRcUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li><span>" + d.cityname + "</span></li>";
            sv += "<li><p>" + nullHandle(d.recalluser_num) + "</p>" +
                "<p>" + nullHandle(d.recalluser_order_num) + "</p>" +
                "<p>" + nullHandle(d.recalluser_order_avg) + "</p>" +
                "<p>" + nullHandle(d.recalluser_num_rate) + (d.recalluser_num_rate ? "%" : '') + "</p></li>";
        }
        $('.rc-fv').html(fv);
        $('.rc-sv').html(sv);
    }
    // 留存用户分析 logic
    $('#appMonth4').on('change', function(){
        isMonthValid(4) && recallUser();
    })
    $('.recall-premonth, .recall-nextmonth').on('click', function(){
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'premonth' ? $('#'+id).val(updateMonth(this.parentNode, -1, true))
                                               : $('#'+id).val(updateMonth(this.parentNode, 1, true));
        recallUser();
    })
    $('.recall-prepage, .recall-nextpage').on('click', function(){
        recallpage = pagingCtrl(this, recallpage, refRcUI);
    });
});
