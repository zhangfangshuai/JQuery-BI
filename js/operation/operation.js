/**
 * Created with Atom.
 * Author: zhangfs
 * Date: 2018/03/26 15:12
 */
$(function () {
    var DATA_CACHE, DETAIL_DATA_CACHE, PM_DATA_CACHE, ADT_CACHE, PL_CACHE, LD_CACHE;
    var carType = '0', cityVal = 1;
    var page = 1, pdPage = 1, pmPage = 1, adtPage = 1, plPage = 1, ldPage = 1;

     for (let i of [1,2,3,4,5,6,7,8,9,10]) {
        $('#appDateTime' + i).mobiscroll(APP.dateBar)
     }
     for(let i of [1,3,5,7,8,10]) {
        $('#appDateTime'+i).val(getDaysOffset(-1));
     }
     for(let i of [2,4,6,9]) {
        $('#appDateTime'+i).val(getDaysOffset(-7));
     }
     startingWeekYesterday(1);
     startingWeekYesterday(8);

     // 页面初始化
     getCity(function(res, cityInit){
         cityVal = cityInit || 1;
         getPeccancyInfo();
         getPeccancyDetail();
         getPushMoneyData();
         getAccident();
         parklaw();
         getLawData();
         getPrincipal(cityVal, [53,55,56,57]);
     }, false);

    // nav 城市改变 及其刷新数据
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val() == '') return;
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        cityVal = $('#value3').val();
        page = pdPage = pmPage = 1;
        $('.nowpage').html('1');
        $('.phoneBubble').hide('fast');
        cityVal == '1' && $('.responsiblePerson-box').hide('fast');
        getPeccancyInfo();
        getPeccancyDetail();
        getPushMoneyData();
        getAccident();
        parklaw();
        getPrincipal(cityVal, [53,55,56,57]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });

    /**
     * 保险事故概况
     **/
    function getAccident() {
        var data = {
            cityId: cityVal,
            carType: carType,
            startDate: $('#appDateTime6').val(),
            endDate: $('#appDateTime7').val()
        };
        buildAjax('get', 'getInsuredEventInfo', data, true, false, function(res){
            ADT_CACHE = res.data.data;
            adtPage = resetPaging('adt-nowpage');
            $('.adt-allpage').html( Math.ceil(ADT_CACHE.length / 10) == 0 ? 1 : Math.ceil(ADT_CACHE.length / 10) );
            setAdtUI(ADT_CACHE.slice(0, 10));
        }, false);
    }
    let refAdtUI = (p) => {
        ADT_CACHE ? setAdtUI( ADT_CACHE.slice( 10 * ( p - 1 ), 10 * p) ) : getAccident(1);
    }
    let setAdtUI = (data) => {
        let fv = "", sv = '';
        for (let d of data) {
          fv += "<li>" + dateFormat(d.data0) + "</li>";
          sv += "<li><p>" + nullHandle(d.data1) + "</p>" +
              "<p>" + d.data2 + "%</p>" +
              "<p>" + d.data3 + "</p>" +
              "<p>" + d.data4 + "%</p>" +
              "<p>" + d.data5 + "%</p></li>";
        };
        $('.adt-fv').html(fv);
        $('.adt-sv').html(sv);
    }
    // 保险事故概况 logic
    $('#appDateTime6, #appDateTime7').on('change', function() {
        isDateValid(6,7) && getAccident();
    });
    $('.adt-prepage, .adt-nextpage').on('click',function() {
         adtPage = pagingCtrl(this, adtPage, refAdtUI);
    });

    /**
     * 违法概况
     **/
    function getPeccancyInfo() {
        let data = {
            cityId: cityVal,
            carType: carType,
            startDate: $('#appDateTime2').val(),
            endDate: $('#appDateTime3').val()
        };
        buildAjax('get', 'getPeccancyInfo', data, true, false, function(res){
            DATA_CACHE = res.data.data;
            pdPage = resetPaging('pd-nowpage');
            $('.pec-allpage').html( Math.ceil(DATA_CACHE.length / 10) == 0 ? 1 : Math.ceil(DATA_CACHE.length / 10) );
            setPeccancyUI(DATA_CACHE.slice(0, 10));
        }, false);
    };
    let refPeccancyUI = (page) => {
        DATA_CACHE ? setPeccancyUI( DATA_CACHE.slice( 10 * ( page - 1 ), 10 * page) ) : getPeccancyInfo();
    }
    let setPeccancyUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
          fv += "<li>" + dateFormat(d.data0) + "</li>";
          sv += "<li><p>" + nullHandle(d.data5) + "</p>" +
              "<p>" + d.data1 + "</p>" +
              "<p>" + d.data2 + "% </p>" +
              "<p>" + d.data3 + "</p>" +
              "<p>" + d.data4 + "</p></li>";
        };
        $('.pec-fv').html(fv);
        $('.pec-sv').html(sv);
    }
    // 违章概况 logic
    $('#appDateTime2, #appDateTime3').on('change', function() {
        isDateValid(2,3) && getPeccancyInfo();
    });
    $('.pec-prepage, .pec-nextpage').on('click',function() {
         page = pagingCtrl(this, page, refPeccancyUI);
    });


    /**
     * 车辆违法详情
     **/
    function getPeccancyDetail() {
        let data = {
            cityId: cityVal,
            carType: carType,
            dateId: $('#appDateTime1').val()
        }
        buildAjax('get', 'getPeccancyDetail', data, true, false, function(res){
            DETAIL_DATA_CACHE = res.data.data
            pdPage = resetPaging('pd-nowpage');
            $('.pd-allpage').html( Math.ceil(DETAIL_DATA_CACHE.length / 10) == 0 ? 1 : Math.ceil(DETAIL_DATA_CACHE.length / 10) );
            setPecDetailUI( DETAIL_DATA_CACHE.slice(0, 10) )
        }, false);
    }
    let refPeccancyDetailUI = () => {
        DETAIL_DATA_CACHE ? setPecDetailUI( DETAIL_DATA_CACHE.slice( 10*(pdPage-1 ), 10*pdPage) ) : getPeccancyDetail();
    }
    let setPecDetailUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
          var marks = ( parseInt(d.data1) > 3 || parseInt(d.data5) >= 90 ) ? '***' : '-';
          fv += "<li>" + d.data0 + "</li>";
          sv += "<li><p>" + d.data1 + "</p>" +
              "<p>" + d.data2 + "</p>" +
              "<p>" + d.data3 + "</p>" +
              "<p>" + d.data4 + "</p>" +
              "<p>" + d.data5 + "</p>" +
              "<p style='color:" + (marks == '***' ? "#ff0000" : "#000000") + "'>" + marks + "</p></li>";
        };
        $('.pd-fv').html(fv);
        $('.pd-sv').html(sv);
    }
    // 车辆违法详情 logic
    $('.pd-prepage, .pd-nextpage').on('click', function() {
         pdPage = pagingCtrl(this, pdPage, refPeccancyDetailUI);
    });
    $('.pd-predate, .pd-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                                     : $('#'+id).val(updateDate(this.parentNode, 1, true));
        getPeccancyDetail();
    });
    $('#appDateTime1').bind('change', function() {
        isDateValid(1) && getPeccancyDetail();
        updateWeek(this);
    });

    /**
     * 网点违法详情
     **/
    function parklaw() {
        var data = {
            cityId: cityVal,
            carType: carType,
            dateId: $('#appDateTime8').val()
        }
        buildAjax('get', 'getPeccancyDetailPark', data, true, false, function(res){
            PL_CACHE = res.data.data
            plPage = resetPaging('pl-nowpage');
            $('.pl-allpage').html( Math.ceil(PL_CACHE.length / 10) == 0 ? 1 : Math.ceil(PL_CACHE.length / 10) );
            setPlUI( PL_CACHE.slice(0, 10) )
        }, false);
    }
    let refPlUI = (p) => {
        PL_CACHE ? setPlUI( PL_CACHE.slice( 10*(p-1 ), 10*p) ) : parklaw(1);
    }
    let setPlUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
          fv += "<li><span>" + d.data0 + "</span></li>";
          sv += "<li><p>" + d.data1 + "</p>" +
              "<p>" + d.data2 + "</p>" +
              "<p>" + d.data3 + "</p>" +
              "<p>" + d.data4 + "</p>" +
              "<p>" + d.data5 + "</p></li>"
        };
        $('.pl-fv').html(fv);
        $('.pl-sv').html(sv);
    }
    // 网点违法详情 logic
    $('.pl-prepage, .pl-nextpage').on('click', function() {
         plPage = pagingCtrl(this, plPage, refPlUI);
    });
    $('.pl-predate, .pl-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                                     : $('#'+id).val(updateDate(this.parentNode, 1, true));
        parklaw(1);
    });
    $('#appDateTime8').bind('change', function() {
        isDateValid(8) && parklaw(1);
        updateWeek(this);
    });

    /**
     * 违法数据统计
     **/
    function getLawData() {
        let data = {
            cityId: cityVal,
            typeId: carType,
            startDate: $('#appDateTime9').val(),
            endDate: $('#appDateTime10').val()
        }
        buildAjax('get','getBreakTheLawDataStatistics', data, true, false, function(res){
            LD_CACHE = res.data.reverse();
            ldPage = resetPaging('ld-nowpage');
            $('.ld-allpage').html( Math.ceil(LD_CACHE.length / 10) == 0 ? 1 : Math.ceil(LD_CACHE.length / 10) );
            setLdUI(LD_CACHE.slice(0, 10));
        });
    }
    let refLdUI = (p) => {
        LD_CACHE ? setLdUI(LD_CACHE.slice( 10*(p-1), 10*p) ) : getLawData();
    }
    let setLdUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.finish_nums_t + "</p>" +
                "<p>" + d.finishnums_in30 + "</p>" +
                "<p>" + d.finishnums_out30 + "</p>" +
                "<p>" + d.match_usernums + "</p>" +
                "<p>" + d.match_nodeposit_usernums + "</p>" +
                "<p>" + d.match_opernums + "</p>" +
                "<p>" + d.nomatch_nums + "</p>" +
                "<p>" + d.match_userforfeit + "</p>" +
                "<p>" + d.match_operforfeit + "</p>" +
                "<p>" + d.nomatch_forfeit + "</p>" +
                "<p>" + d.match_userpoints + "</p>" +
                "<p>" + d.match_operpoints + "</p>" +
                "<p>" + d.nomatch_points + "</p>" +
                "<p>" + d.pseudo_num + "</p>" +
                "<p>" + (d.growth_rate || '- ') + "% </p>" +
                "<p>" + (d.reduce_rate || '- ') + "% </p> </li>";
        }
        $('.ld-fv').html(fv);
        $('.ld-sv').html(sv);
    }
    // 违法数据统计 logic
    $('.ld-prepage, .ld-nextpage').on('click', function() {
         ldPage = pagingCtrl(this, ldPage, refLdUI);
    });
    $('#appDateTime9, #appDateTime10').on('change', function() {
        isDateValid(9,10) && getLawData();
    });


    /**
     * 推费概述
     **/
    function getPushMoneyData() {
        let data = {
            cityId: cityVal,
            carType: carType,
            startDate: $('#appDateTime4').val(),
            endDate: $('#appDateTime5').val()
        }
        buildAjax('get','getPushMoneyData', data, true, false, function(res){
            PM_DATA_CACHE = res.data.data
            pmPage = resetPaging('pm-nowpage');
            $('.pm-allpage').html( Math.ceil(PM_DATA_CACHE.length / 10) == 0 ? 1 : Math.ceil(PM_DATA_CACHE.length / 10) );
            setPushMoneyUI(PM_DATA_CACHE.slice(0, 10))
        });
    }
    let refPushMoneyUI = (page) => {
        PM_DATA_CACHE ? setPushMoneyUI(PM_DATA_CACHE.slice( 10*(page-1), 10*page) ) : getPushMoneyData();
    }
    let setPushMoneyUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.data0) + "</li>";
            sv += "<li><p>" + nullHandle(d.data5) + "</p>" +
                "<p>" + d.data1 + "</p>" +
                "<p>" + d.data2 + "</p>" +
                "<p>" + d.data3 + "</p>" +
                "<p>" + d.data4 + "% </p> </li>";
        }
        $('.pm-fv').html(fv);
        $('.pm-sv').html(sv);
    }
    // 推费概述 logic
    $('#appDateTime4, #appDateTime5').on('change', function() {
        isDateValid(4,5) && getPushMoneyData();
    });
    $('.pm-prepage, .pm-nextpage').on('click',function() {
        pmPage = pagingCtrl(this, pmPage, refPushMoneyUI);
    });

    // 车辆类型选择监控
    $('.accd-ct, .pec-ct, .pd-ct, .pm-ct, .adt-ct, .pl-ct, .ld-ct').on('click', function() {
        $('.' + this.classList[1]).removeClass('active');
        $(this).addClass('active');
        carType = $(this).attr('data-type');
        switch (this.classList[1]) {
            case 'accd-ct':
                getAccidentTop();
                break;
            case 'pec-ct':
                getPeccancyInfo();
                break;
            case 'pd-ct':
                getPeccancyDetail();
                break;
            case 'pm-ct':
                getPushMoneyData();
                break;
            case 'adt-ct':
                getAccident()
                break;
            case 'pl-ct':
                parklaw();
                break;
            case 'ld-ct':
                getLawData();
        }
    });
})
