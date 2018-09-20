/**
 * Created: zhangfs by Atom
 * Date: 2018/08/24
 */
$(document).ready(function () {
    var CAR_CACHE, TEAM_CACHE;
    var city = 1, carr_operate = 0, team_page = 1;
    var db_ct = 0, inc_ct = 0, car_ct = 0, od_ct = 0;
    APP.dateBar.theme = 'android-ics light';
    APP.monthBar.theme = 'android-ics light';
    var dashDate = getDaysOffset(-1),
        today = getDaysOffset(),
        yesterday = getDaysOffset(-1);
    var thisMonth = getMonthOffset();

    // page init
    [1].map(function(i) {
        $(`#appMonth${i}`).mobiscroll(APP.monthBar);
        $(`#appMonth${i}`).val(fmt(thisMonth));
    });
    [1,2,3,4,5,6].map(function(i) {
        $(`#appDateTime${i}`).mobiscroll(APP.dateBar);
        $(`#appDateTime${i}`).val(i <= 5 ? fmt(today) : fmt(yesterday));
    });
    [1,2].map(function(i) {
        triggerLArea(`#appCar${i}`, `#value3`, APP.carType);
    });
    // 实时车辆上下架情况
    // triggerLArea(`#appCarState`, `#value3`, APP.carOperateBar2);



    // get city list
    getCity(function(res, cityInit) {
        city = cityInit;
        Dashboard();
        Employee();
        realListening();
        getCityData();
        userAnalysis();
    })

    // switch cities
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val()=='') return
        city = $('#value3').val();
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        $('.phoneBubble').hide('fast');
        Dashboard();
        Employee();
        realListening();
        getCityData();
        userAnalysis();
        // getPrincipal(city, [71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93]);
    });

    function realListening () {
        realIncome();
        realCar();
        realPower();
        realOrder();
        realNewUser();
    }
    function getCityData() {
        getAssets();
        getKpis();
        getEfficiency();
        getWeekData();
    }
    function userAnalysis() {
        userTransform();
        getUserType();
        getUserRetain();
    }

    /**
     * Dashboard
     */
    function Dashboard() {
        showLoading();
        buildAjax('get', 'getDashboardPageAppData', {cityId:city, dateId:deFmt(dashDate), typeId:db_ct}, true, false, function(res) {
            let r = res.data[0];
            let boards = '';
            dashBoardBuilder.map(function(i, d) {
                try {
                    boards += `<div class="board">
                        <div class="dashreal">
                            <p>${commaFormat(r[i.inter])}</p>
                            <p>${i.name}</p>
                        </div>
                        <div class="dashcomp">
                            <div>
                                <p class="${r[i.inter + '2'] < 0 ? 'fontRed' : ''}">${r[i.inter + '2']}</p>
                                <p>上月环比</p>
                            </div>
                            <div>
                                <p class="${r[i.inter + '3'] < 0 ? 'fontRed' : ''}">${r[i.inter + '3']}</p>
                                <p>上年同比</p>
                            </div>
                        </div>
                    </div>`
                } catch (e) {
                    boards = `<p class="dasherror">抱歉暂无该月数据，先看看其他月份吧～</p>`;
                    return;
                }
            });
            $('#dashboard').html(boards);
            setTimeout(hideLoading, 1000);
        })
    };

    // 过滤规则: 当月传昨天，上月传上月最后一天
    function dashDatefilter(i) {
        if (parseInt(deFmt($(`#appMonth${i}`).val()).slice(4,6)) == new Date().getMonth() + 1) {
            dashDate = getDaysOffset(-1);
        } else {
            var  d = new Date(deFmt($(`#appMonth${i}`).val()).slice(0,4), deFmt($(`#appMonth${i}`).val()).slice(4,6), 1);
            d.setDate(1);
            d.setMonth(d.getMonth());
            d.setDate(d.getDate() - 1);
            dashDate = d.format('yyyyMMdd');
        }
    }


    /**
     * 团队工龄
     */
    function Employee() {
        buildAjax('get','searchOfficePeopleApp', {cityId:city}, true, false, function(res) {
            let staff = new Array()
            for (let m of res.data) {
                let member = `<li>
                    <p>${m.officename}</p>
                    <p>${m.people_name}
                        <span id="${m.sim}" class="triggerCall" name="${m.people_name}" office="${m.officename}"></span>
                    </p>
                    <p>${m.offer_dateid.slice(2)}</p>
                    <p>${m.monthId}月</p>
                </li>`
                staff.push(member);
            }
            $('#employee').html(staff.join(''));
        });
    }

    // call even listening
    $('#employee').click(function(e) {
        let tg = e.target;
        if (tg.className == 'triggerCall') {
            $('#callto').html(tg.attributes.office.value + " - " + tg.attributes.name.value);
            $('#sendcall>a').attr('href', 'tel:' + tg.id);
            showDialog();
        }
    })

    $("#cancel").bind('click', function(e) {
        closeDialog();
    })



    let RIC = echarts.init(document.getElementById("realIncome"));
    RIC.showLoading();

    function realIncome() {
        let data = {
            cityId: city,
            dateId: deFmt($('#appDateTime1').val()),
            carType: inc_ct
        }
        buildAjax('get', 'getOrderRealAmount', data, true, false, function(res){
            realCashOption.xAxis.data = res.data.data1.map(function(x){ return (x+'点') });
            for (let i of [2,3,4,5]) {
                realCashOption.series[i-2].data = res.data['data'+i];
            }
            RIC.setOption(realCashOption);
            RIC.hideLoading();
            let notes = new Array();
            realCashNoteBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(res.data[n.seg])}</p>
                            </div>`
                notes.push(panel);
            })
            $('#incomeNote').html(notes.join(''));
        });
    }



    let RCC = echarts.init(document.getElementById("realCar"));
    RCC.showLoading();

    function realCar() {
        let data = {
            cityId: city,
            dateId: deFmt($('#appDateTime2').val()),
            carType: car_ct
        }
        buildAjax('get', 'getCarRealData', data, true, false, function(res){
            CAR_CACHE = res.data;
            setCrChartUI(CAR_CACHE);
        });
    }

    let setCrChartUI = d => {
        RCC.clear();
        let notes = new Array();
        realCarOption.series[0].support = CAR_CACHE.sumData17;
        let opt = carr_operate == 1 ? optionOn :
                  carr_operate == 2 ? optionDown :
                  carr_operate == 3 ? optionOther : realCarOption;
        opt.xAxis.data = d.data1.map(function(x){ return (x+'点') });
        if (carr_operate == 0) {
            for (let i of [2,3,4]) {
                opt.series[i-2].data = d['data'+i];
            }
            realCarAllBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(d[n.seg])}</p>
                            </div>`
                notes.push(panel);
            });
        } else if (carr_operate == 1) {
            for (let i of [5,6,7,8]) {
                opt.series[i-5].data = d['data'+i];
            }
            realCarOnBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(d[n.seg])}</p>
                            </div>`
                notes.push(panel);
            })
        } else if (carr_operate == 2) {
            for (let i of [9,10,11,12,13,14]) {
                opt.series[i-9].data = d['data'+i];
            }
            opt.series[6].data = d.data16;
            opt.series[7].data = d.data18;
            realCarOffBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(d[n.seg])}</p>
                            </div>`
                notes.push(panel);
            });
        } else {
            opt.series[0].data = d.data15;
            opt.series[1].data = d.data17;
            realCarOtherBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(d[n.seg])}</p>
                            </div>`
                notes.push(panel);
            });
        }
        RCC.setOption(opt);
        RCC.hideLoading();
        $('#carNote').html(notes.join(''));
    }


    let RPC = echarts.init(document.getElementById("realPower"));
    RPC.showLoading();

    function realPower() {
        buildAjax('get', 'getKpiCarPower', {cityId:city,dateId:deFmt($('#appDateTime3').val())}, true, false, function(res) {
            let r = res.data;
            realPowerOption.xAxis.data = r.data1.map(function(x){ return (x+'点') });
            for (let i of [2,3,4,5,6]) {
                realPowerOption.series[6-i].data = r['data'+i];
            }
            RPC.setOption(realPowerOption);
            RPC.hideLoading();
            let notes = new Array();
            realPowerNoteBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(r[n.seg])}</p>
                            </div>`
                notes.push(panel);
            });
            $('#powerNote').html(notes.join(''));
        });
    }


    let ROC = echarts.init(document.getElementById("realOrder"));
    ROC.showLoading();

    function realOrder() {
        let data = {
            cityId: city,
            dateId: deFmt($('#appDateTime4').val()),
            carType: od_ct
        }
        buildAjax('get','getOrderRealData', data, true, false, function(res){
            let r = res.data;
            realOrderOption.xAxis.data = r.data1.map(function(x){ return (x+'点') });
            for (let i of [2,3,4]) {
                realOrderOption.series[i-2].data = r['data'+i];
            }
            ROC.setOption(realOrderOption);
            ROC.hideLoading();
            let notes = new Array();
            realOrderNoteBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(r[n.seg])}</p>
                            </div>`
                notes.push(panel);
            })
            $('#orderNote').html(notes.join(''));
        });
    }


    let RUC = echarts.init(document.getElementById("realNewUser"));
    RUC.showLoading();

    function realNewUser() {
        buildAjax('get', 'getRegisterRealData', {cityId:city, dateId:deFmt($('#appDateTime5').val())}, true, false, function(res){
            let r = res.data;
            realNewUserOption.xAxis.data = r.data1.map(function(x){ return (x+'点') });
            for (let i of [2,3,4,5,6]) {
                realNewUserOption.series[i-2].data = r['data'+i];
            }
            RUC.setOption(realNewUserOption);
            RUC.hideLoading();
            let notes = new Array();
            realNewUserNoteBuilder.map(function(n, i) {
                let panel = `<div class="notePanel">
                                <p>${n.name}</p>
                                <p>${commaFormat(r[n.seg])}</p>
                            </div>`
                notes.push(panel);
            });
            $('#newUserNote').html(notes.join(''));
        });
    }

    /**
     * 资产分析
     */
    // let ACR = echarts.init(document.getElementById("assetcars"));
    // ACR.showLoading();
    let ASR = echarts.init(document.getElementById("assetsites"));
    ASR.showLoading();
    let APR = echarts.init(document.getElementById("assetparks"));
    APR.showLoading();

    function getAssets() {
        buildAjax('get', 'searchAssetProfileApp', {cityId: city}, true, false, function(res) {
            for (let d of res.data) {
                let val = d.kpi_current;
                let html = commaFormat(d.kpi_current);
                switch (d.id) {
                    case 57:
                        $('#carall').html(html).attr('data-val', val); break;
                    case 141:
                        $('#carback').html(html).attr('data-val', val); break;
                    case 1:
                        $('#caron').html(html).attr('data-val', val); break;
                    case 13:
                        $('#siteall').html(html).attr('data-val', val); break;
                    case 15:
                        $('#sitereal').html(html).attr('data-val', val); break;
                    case 16:
                        $('#sitefun').html(html).attr('data-val', val); break;
                    case 17:
                        $('#parkall').html(html).attr('data-val', val); break;
                    case 18:
                        $('#parkreal').html(html).attr('data-val', val); break;
                    case 19:
                        $('#parkfun').html(html).attr('data-val', val);
                }
            }
            let carall = parseInt($('#carall').attr('data-val')),
                caron = parseInt($('#caron').attr('data-val')),
                carback = parseInt($('#carback').attr('data-val'));
            let topPart = (carall - carback) / carall,
                midPart = (carback - caron) / carall,
                bootPart = caron / carall;
            console.log(topPart, midPart, bootPart);
            let h_base = $('#assetcars').height();
            let $assp = $('#assetcars').find('p')
            $assp.eq(0).css({"height": `calc(100% * ${topPart})`})
            $assp.eq(1).css({"height": `calc(100% * ${midPart})`})
            $assp.eq(2).css({"height": `calc(100% * ${bootPart})`})
            assetsOption.series[0].data[0].value = $('#sitereal').attr('data-val');
            assetsOption.series[0].data[1].value = $('#sitefun').attr('data-val');
            ASR.setOption(assetsOption);
            ASR.hideLoading();
            assetsOption.series[0].data[0].value = $('#parkreal').attr('data-val');
            assetsOption.series[0].data[1].value = $('#parkfun').attr('data-val');
            APR.setOption(assetsOption);
            APR.hideLoading();

        })
    }

    /**
     * 城市及全国KPI效果
     */
    function getKpis() {
        buildAjax('get', 'kpi/getCoreIndex', {cityId:city}, true, false, function(res) {
            let kpi = res.data.assess[0];
            for (let r of res.data.assess) {
                if (r.city_id == city) {
                    kpi = r;
                    break;
                }
            }
            city == 1 ? setNationKpiUI(kpi) : setCityKpiUI(kpi);
        })
    }
    // 全国状态下的KPI考核
    let setNationKpiUI = r => {
        $('#nation_kpi').show('fast');
        $('#city_kpi').hide('fast');
        let kpis = new Array();
        nationKpiBuilder.map(function(d, i) {
            let k = `<li>
                        <p>${d.name}</p>
                        <p>${r[d.seg]} ${d.nuit}</p>
                     </li>`;
            kpis.push(k);
            $('#nationKpis').html(kpis.join(''));
        })
    }
    // 具体城市下下的KPI考核
    let NEVC = echarts.init(document.getElementById("newEvBoard"));
    NEVC.showLoading();
    let OEVC = echarts.init(document.getElementById("oldEvBoard"));
    OEVC.showLoading();
    let OVC = echarts.init(document.getElementById("oilBoard"));
    OVC.showLoading();
    let NEVT = echarts.init(document.getElementById("newEvTimeBoard"));
    NEVT.showLoading();
    let OEVT = echarts.init(document.getElementById("oldEvTimeBoard"));
    OEVT.showLoading();
    let OT = echarts.init(document.getElementById("oilTimeBoard"));
    OT.showLoading();
    let LR = echarts.init(document.getElementById("lawRateBoard"));
    LR.showLoading();

    let setCityKpiUI = r => {
        $('#city_kpi').show('fast');
        $('#nation_kpi').hide('fast');

        $('#newEvCash').html(r.kpi_currentt);
        $('#newEvGoal').html(r.kpi_goalt);
        $('#newEvRate').html(r.kpi_ratet+'%');
        gaugeOption.series.data[0].value = r.kpi_ratet;
        NEVC.setOption(gaugeOption);
        NEVC.hideLoading();

        $('#oldEvCash').html(r.kpi_currentu);
        $('#oldEvGoal').html(r.kpi_goalu);
        $('#oldEvRate').html(r.kpi_rateu+'%');
        gaugeOption.series.data[0].value = r.kpi_rateu;
        OEVC.setOption(gaugeOption);
        OEVC.hideLoading();

        $('#oilCash').html(r.kpi_currents);
        $('#oilGoal').html(r.kpi_goals);
        $('#oilRate').html(r.kpi_rates+'%');
        gaugeOption.series.data[0].value = r.kpi_rates;
        OVC.setOption(gaugeOption);
        OVC.hideLoading();

        $('#newEvTime').html(r.kpi_currento);
        $('#newEvTGoal').html(r.kpi_goalo);
        $('#newEvTRate').html(r.kpi_rateo+'%');
        gaugeOption.series.data[0].value = r.kpi_rateo;
        NEVT.setOption(gaugeOption);
        NEVT.hideLoading();

        $('#oldEvTime').html(r.kpi_currentp);
        $('#oldEvTGoal').html(r.kpi_goalp);
        $('#oldEvTRate').html(r.kpi_ratep+'%');
        gaugeOption.series.data[0].value = r.kpi_ratep;
        OEVT.setOption(gaugeOption);
        OEVT.hideLoading();

        $('#oilTime').html(r.kpi_currentn);
        $('#oilTGoal').html(r.kpi_goaln);
        $('#oilTRate').html(r.kpi_raten+'%');
        gaugeOption.series.data[0].value = r.kpi_raten;
        OT.setOption(gaugeOption);
        OT.hideLoading();

        $('#law').html(r.kpi_currentm);
        $('#lGoal').html(r.kpi_goalm);
        $('#lRate').html(r.kpi_ratem+'%');
        gaugeOption.series.data[0].value = r.kpi_ratem;
        LR.setOption(gaugeOption);
        LR.hideLoading();
    }

    /**
     * 运营效率
     */
    function getEfficiency() {
        buildAjax('get', 'searchOperateAppEfficiency',{cityId:city}, true, false, function(res) {
            let effi = new Array();
            res.data.map(function(d, i) {
                let I = d.lastweek_rate;
                let img = I > 0 ? '../images/icon_rise.png' : I < 0 ? '../images/icon_decline.png' : '';
                let x = `<li>
                            <p title=${d.kpi_name}>${d.kpi_name}</p>
                            <p>${d.current_value > 10000 ? parseInt(d.current_value) : d.current_value}</p>
                            <p>${d.yesterday_value > 10000 ? parseInt(d.yesterday_value) : d.yesterday_value}</p>
                            <p>${d.lastweek_value > 10000 ? parseInt(d.lastweek_value) : d.lastweek_value}</p>
                            <p>${d.lastweek_rate}% <img src='${img}' alt=''/></p>
                        </li>`
                 effi.push(x);
            })
            $("#operation").html(effi.join(''));
       })
    }


    /**
     * 周对比视图
     */
    let WIC = echarts.init(document.getElementById("weekIncome"));
    WIC.showLoading();

    let WCC = echarts.init(document.getElementById("weekCash"));
    WCC.showLoading();

    let WOAC = echarts.init(document.getElementById("weekOrderAvg"));
    WOAC.showLoading();

    let WCAC = echarts.init(document.getElementById("weekCashAvg"));
    WCAC.showLoading();

    let WOCAC = echarts.init(document.getElementById("weekOrderCashAvg"));
    WOCAC.showLoading();

    let WGCAC = echarts.init(document.getElementById("weekGetCarAvg"));
    WGCAC.showLoading();

    let WOLC = echarts.init(document.getElementById("weekOnline"));
    WOLC.showLoading();
    function getWeekData() {
        buildAjax('get', 'searchOperateWeekDataApp', {cityId:city,dateId:deFmt($('#appDateTime6').val())}, true, false, function(res) {
            weekLineOption.series[0].data = res.data.sumAmount;
            weekLineOption.series[1].data = res.data.sumAmountU;
            weekLineOption.title.text = '收入';
            weekLineOption.color = ['#272828', '#afafaf'];
            weekLineOption.legend.data = ['本周', '上周'];
            WIC.setOption(weekLineOption);
            WIC.hideLoading();

            weekBarOption.series[0].data = res.data.sumPayAmount;
            weekBarOption.series[1].data = res.data.sumPayAmountU;
            weekBarOption.title.text = '收现';
            weekBarOption.color = ['#6034FF', '#afafaf'];
            WCC.setOption(weekBarOption);
            WCC.hideLoading();

            weekBarOption.series[0].data = res.data.order_real_avg;
            weekBarOption.series[1].data = res.data.order_real_avgU;
            weekBarOption.title.text = '车均单';
            weekBarOption.color = ['#14DB4D', '#afafaf'];
            WOAC.setOption(weekBarOption);
            WOAC.hideLoading();

            weekLineOption.series[0].data = res.data.car_avgpayamount;
            weekLineOption.series[1].data = res.data.car_avgpayamountU;
            weekLineOption.title.text = '车均收现';
            weekLineOption.color = ['#FF8A34', '#afafaf'];
            WCAC.setOption(weekLineOption);
            WCAC.hideLoading();

            weekBarOption.series[0].data = res.data.avg_sumPayAmount;
            weekBarOption.series[1].data = res.data.avg_sumPayAmountU;
            weekBarOption.title.text = '单均收现';
            weekBarOption.color = ['#21D0EB', '#afafaf'];
            WOCAC.setOption(weekBarOption);
            WOCAC.hideLoading();

            weekLineOption.series[0].data = res.data.order_up;
            weekLineOption.series[1].data = res.data.order_upU;
            weekLineOption.title.text = '取车单';
            weekLineOption.color = ['#6034FF', '#afafaf'];
            WGCAC.setOption(weekLineOption);
            WGCAC.hideLoading();
        });
        // hideLoading()
        weekOnline();
    }
    // 车均上架时长
    function weekOnline() {
        buildAjax('get', 'searchAvgCarOnlineDataApp', {cityId:city,dateId:deFmt($('#appDateTime6').val())}, true, false, function(res) {
            weekBarOption.series[0].data = res.data.current;
            weekBarOption.series[1].data = res.data.upWeek;
            weekBarOption.title.text = '上架时长';
            weekBarOption.color = ['#FF8A34', '#afafaf'];
            WOLC.setOption(weekBarOption);
            WOLC.hideLoading();
        });
    }

    /**
     * 用户分析
     */
    let UF = echarts.init(document.getElementById('userFunnel'));
    UF.showLoading();

    function userTransform() {
        buildAjax('get', 'MUser/MuserTransformData', {cityId:city,reportId:1}, true, false, function(res){
            let arr = [];
            res.data.map(function(d) { arr.push(d.name) });
            funnelOption.series[0].data = res.data;
            UF.setOption(funnelOption);
            UF.hideLoading();
        });
    }
    function getUserType() {
        buildAjax('get', 'searchUserAppData', {cityId:city,dateId:yesterday}, true, false, function(res) {
            let users = new Array();
            for (let i = 1; i <= 7; i++) {
                let date = getDaysOffset(-i);
                let u = `<li> <p>${date}</p>`;
                res.data.map(function(d) { u += `<p>${d[date]}</p>` });
                u += `</li>`;
                users.push(u)
            }
            $('#userType').html(users.join(''));
        });
    }
    function getUserRetain() {
        buildAjax('get', 'searchRetentionAppRate', {cityId:city,dateId:yesterday}, true, false, function(res) {
            let users = new Array();
            for (let i = 1; i<= 7; i++) {
                let date = getDaysOffset(-i);
                let u = `<li> <p>${date}</p>`;
                res.data.map(function(d) { u += `<p>${d[date]}</p>` });
                u += `</li>`;
                users.push(u)
            }
            $('#userRetain').html(users.join(''));
        })
    }



    /**
     * Create: zhangfs by Atom 2018/09/17
     * Func: watching user screen Action
     **/
    let startY, endY, GO = 0;
    let len = $('section:visible').length, $win = $('window');
    let startPos = 0, endMovePos = 0, endPos = 0;
    document.addEventListener('touchstart',function (e) {
        startY = parseInt(e.touches[0].pageY);
        startPos = parseInt($('section:visible').eq(GO).offset().top);
    }, false);
    document.addEventListener('touchmove', function(){
        endMovePos = parseInt($('section:visible').eq(GO).offset().top);
    });
    document.addEventListener('touchend',function (e) {
        endY = parseInt(e.changedTouches[0].pageY);
        endPos = parseInt($('section:visible').eq(GO).offset().top);
        touchAction();
    }, false);

    function touchAction() {
        let dir = startY - endY;
        let pos = endPos == startPos ? endMovePos : endPos;
        // 允许用户误操作范围阈值
        if (Math.abs(dir) < 5) return;
        let $secgo = $('section:visible').eq(GO);
        if (dir > 0) {        // 用户上滑,切换下一页
            if (pos < startPos) {
                GO >= len-1 ? (GO = len - 1) : rollGear(++GO);
            }
        } else if (dir < 0) {       // 用户下滑,切换上一页
            if (pos > startPos) {
                GO <= 0 ? (GO = 0) : rollGear(--GO);
            }
        }
        console.log(`\n--交互信息--\n当前模块: ${GO}\n滑动距离: ${dir}\n模块滑动前距顶: ${startPos}\n模块滑动后距顶: ${endPos}\n滑动过程最终距顶: ${endMovePos}`);
    }
    // 缓动对齐
    function rollGear(go) {
        let $section = $('section:visible').eq(go);
        let $secTop = $('section').eq(0).offset().top;
        $(".box").animate({scrollTop: $section.offset().top - $secTop}, 700);
    }



    /**
     * Func: 车辆类型控,月份控,日期件控 -事件委托
     * Note: 已公用 #value3 元素节点
     */
    $('.filter').bind('input propertychange', function() {
        if ($('#value3').val() == '') return;
        switch ($(this).attr('id').split('').pop()) {
            case '1':
                db_ct = $('#value3').val();
                Dashboard();
                break;
            case '2':
                inc_ct = $('#value3').val();
                realIncome();
                break;
            default:
                Tip.success('无操作过滤器');
                let who = $(this).attr('id');
                console.log(`警告: 车辆类型过滤器"${who}"还未被配置!`);
        }
    });
    // for appSelect
    let mobileSelect = new MobileSelect({
        trigger: "#appSelect",
        title: '',
        wheels: APP.appSelect,
        position: [0,0],
        callback:function(indexArr, data){
            console.log(indexArr, data);
            if (car_ct == indexArr[0]) {
                if (carr_operate != indexArr[1]) {
                    carr_operate = indexArr[1];
                    setCrChartUI(CAR_CACHE);
                }
            } else {
                car_ct = indexArr[0];
                carr_operate = indexArr[1];
                realCar();
            }
        }
    });

    $('.appMonth').on('change', function() {
          $(this).val(fmt($(this).val()));
          let x = $(this).attr('id').split('').pop();
          if (!isMonthValid(x)) return;
          switch (x) {
              case '1':
                  dashDatefilter(x);
                  Dashboard();
                  break;
              default:
                  Tip.success('无操作控件');
                  let who = $(this).attr('id');
                  console.log(`警告: 月份选择器"${who}"还未被配置!`);
          }
    });

    $('.appDateTime').on('change', function() {
          $(this).val(fmt($(this).val()));
          let x = $(this).attr('id').split('').pop();
          if (!isDateValid(x)) return;
          switch (x) {
              case '1':
                  realIncome(); break;
              case '2':
                  realCar(); break;
              case '3':
                  realPower(); break;
              case '4':
                  realOrder(); break;
              case '5':
                  realNewUser(); break;
              case '6':
                  getWeekData(); break;
              default:
                  Tip.success('无操作控件');
                  let who = $(this).attr('id');
                  console.log(`警告: 日期选择器"${who}"还未被配置!`);
          }
    });


    /**
     * Func: 按UI要求的进行日期格式化和反格式化
     */
    function fmt(str) {
        let fmtstr = (str.length > 6 ? str.slice(2,4) : str.slice(0,4)) + '.' + str.slice(4,6) + (str.length > 6 ? '.' + str.slice(6,8) : '');
        return fmtstr;
    }
    function deFmt(str) {
        // 如果没有被格式化过,则返回原值
        if (str.indexOf('.') < 0) return str;
        // 否则,反格式化
        return (str.length > 7 ? '20' : '') + str.split('.').join('');
    }


    /**
     * Func: call control
     */
    function showDialog() {
        $('#mask').show();
        $('#call-dialog').show('fast');
    }
    function closeDialog() {
        $('#mask').hide();
        $('#call-dialog').hide('fast');
    }

    /**
     * Func: loading effect control
     */
    function showLoading() {
        $('#mask').show();
        $('.loading').show('fast');
    }
    function hideLoading() {
        $('#mask').hide();
        $('.loading').hide('fast');
    }

    /**
     * Created: zhangfs by Atom 2018/08/11
     * Func: echarts dynamic response
     */
    window.onresize = function(){
        RIC.resize();
        RCC.resize();
        RPC.resize();
        ROC.resize();
        RUC.resize();
        // ACR.resize();
        ASR.resize();
        APR.resize();
        WIC.resize();
        WCC.resize();
        WOAC.resize();
        WCAC.resize();
        WOCAC.resize();
        WGCAC.resize();
        WOLC.resize();
        UF.resize();
    }

});
