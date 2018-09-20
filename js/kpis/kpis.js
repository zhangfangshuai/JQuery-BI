/**
 * Created: dameng by webstorm
 * Date: 2017/11/15 09:05
 * Recode: zhangfs by Atom 2018/04/21
 * Note: old: 1160 lines
 */
$(function () {
    var MAP_INIT, MAP_CACHE, ODAVG_CACHE;  // 全国基础地图数据
    var odavgpage = 1, cashpage = 1, shelfratepage = 1, licencepage = 1;
    var cartype = 1;
    var city, ovCity, autoCenterflag = false, mapClickable = false;
    var today = getDaysOffset();

    // 构建全国基础地图
    var stationsMap = echarts.init(document.getElementById('stationsMap'));
    echarts.registerMap('china', chinaMapJson);

    // 获取城市列表
    getCity(function(res, cityInit) {
        res.data.map(function(d) {
            if (d.value == 1) {
                mapClickable = true;
                return;
            }
        })
        ovCity = cityInit == '1' ? '2' : cityInit;
        city = cityInit;
        getStationMap();
        cityOverview();
        getKpi(true);
        getTarget(city);
        if (city != 1) {
            for (let c of MAP_CACHE) {
                if (c.name == $('#demo3').val()) {
                    sessionStorage.locat = JSON.stringify(c);
                    break
                }
            }
            update2CityMap();
            $('.responsiblePerson-box').show();
        }
        getPrincipal(city, [8,9,10,11,12,13,14]);
    })


    // 切换城市监控
    $('#demo3').bind('input propertychange', function() {
        if (!$('#value3').val()) return;
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        city = $('#value3').val();
        ovCity = city == '1' ? '2' : city;
        $('.phoneBubble').hide('fast');
        if (city == 1) {
            update2CountryMap();
            $('.responsiblePerson-box').hide('fast');
        } else {
            for (let c of MAP_CACHE) {
                if (c.name == $('#demo3').val()) {
                    sessionStorage.locat = JSON.stringify(c);
                    break
                }
            }
            update2CityMap();
            $('.responsiblePerson-box').show();
        }
        cityOverview();
        getTarget(city);
        getPrincipal(city, [8,9,10,11,12,13,14]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });


    // 将开城站点绘入基础地图中
    function getStationMap() {
        buildAjax('get', 'kpi/getMapData', {}, false, false, function(res){
            MAP_CACHE = res.data;
            sessionStorage.locat = JSON.stringify(MAP_CACHE[0]);
            optionCity.series[0].data = MAP_CACHE;
            MAP_INIT = MAP_CACHE[0];
            if (localStorage.sessionCity) {
                for (let c of MAP_CACHE) {
                    if (c.name == JSON.parse(localStorage.sessionCity).text) {
                        MAP_INIT = c;
                        localStorage.sessionCityMap = JSON.stringify(c);
                        break;
                    }
                }
            }
            optionCity.series[1].data = [MAP_INIT];
            stationsMap.setOption(optionCity);
        });
    }

    // 地图上用户点击城市图标
    stationsMap.on('click', function (locat) {
        if (!mapClickable) return;
        sessionStorage.locat = JSON.stringify(locat.data);
        if (locat.data) {
            let mapUpdate = {
                series: [{}, {
                    data: [locat.data]
                }]
            };
            if ( autoCenterflag ) {
                mapUpdate.geo = {};
                mapUpdate.geo.center = [locat.data.value[0], locat.data.value[1]];
            }
            stationsMap.setOption(mapUpdate);
            city = locat.data.value[2];
            ovCity = city;
            cityOverview();
            // 具体城市才需要重查核心指标, 这里借用autoCenterflag表示具体城市事件
            if (autoCenterflag) {
                $('#demo3').val(locat.data.name);
                getTarget(city);
                getPrincipal(ovCity, [8,9,10,11,12,13,14]);
            }
        }
    })

    // 用户点击查看详情 交互
    $('.overview-btn').on('click', function(){
        $('.responsiblePerson-box').show();
        $('#demo3').val(JSON.parse(sessionStorage.locat).name);
        update2CityMap();
        getTarget(ovCity);
        getPrincipal(ovCity, [8,9,10,11,12,13,14]);
    });


    // 城市概览，默认北京
    function cityOverview() {
        buildAjax('get', 'kpi/getKPICityData', {cityId:ovCity}, true, false, function(res) {
            $('.cityName').html(res.data.cityname);
            $('.openTime').html(res.data.opentime);
            $('.totleUser').html(res.data.users_reg_t);
            $('.validUser').html(res.data.deposit_num);
            $('.carOnline').html(res.data.car_total);
            $('.siteRange').html(res.data.parking);
            $('.orderAvg').html(res.data.order_avg);
            $('.siteNum').html(res.data.parkPlaceCount);
            $('.orderNum').html(res.data.orders_month);
            $('.incomeAvg').html(res.data.car_avgpayamount);
            $('.dauUsers').html(res.data.dau_users);
        });
    }


    // 当月KPI - 改版后 - 二次改版
    function getKpi(flag){
        city = flag == 0 ? 1 : city;
        buildAjax('get', 'kpi/getCurrMonthKpiData', {cityId:city, typeId:cartype}, true, false, function(res){
            try {
                setKPIUI(res.data);
            } catch (e) {
                Tip.error('KPI数据异常!');
            }
        });
    }

    var setKPIUI = (data) => {
        let ids = [];
        /** 更改时需同步showArea的tableId集 **/
        let table = [
          {id: 1000, name: "j", className: "incomeVal"},
          {id: 1002, name: "i", className: "shelfVal"},
          {id: 1001, name: "m", className: "lawVal"}
        ];
        // 获取大区集
        for (let area of data.areaKpiList) {
            ids.push(area.area_id);
        }
        for (let tb of table) {
            ids.push(tb.id);
            let str = "";
            for (let area of data.areaKpiList) {
                str += "<li class=" + (area.area_name == "北京" ? 'cityArea' : 'areaLi' ) + ">" +
                    "<p onclick='showArea("+ area.area_id + "," + ids + ")'>" + area.area_name + "</p>" +
                    "<p>" + area["kpi_goal"+tb.name] + "</p>" +
                    "<p>" + area["kpi_current"+tb.name] + "</p>" +
                    "<p>" + area["kpi_rate"+tb.name] + "%</p> </li>";
                if (data['areaId_' + area.area_id]) {
                    for (let city of data['areaId_' + area.area_id]) {
                        str += "<li class='cityLi Area_" + tb.id + area.area_id +"' style='display:none;'>" +
                        "<p><span>" + city.cityName + "</span></p>" +
                        "<p>" + city["kpi_goal"+tb.name] + "</p>" +
                        "<p>" + city["kpi_current"+tb.name] + "</p>" +
                        "<p>" + city["kpi_rate"+tb.name] + "%</p> </li>"
                    }
                }
            }
            $('.' + tb.className).html(str);
        }
    }

    // 车均单 车辆类型选择
    $('.inc-ct, .shf-ct').on('click', function() {
         $(this).addClass('active').siblings().removeClass('active');
         cartype = $(this).attr('data-type');
         getKpi(0);
    });

    // 核心指标
    function getTarget(c) {
        buildAjax('get', 'kpi/getCoreIndex', {cityId:c}, true, false, function(res) {
            ODAVG_CACHE = res.data.assess[0];
            setTgCarUI(res.data.kpi1, '.tgCarVal');
            setTgSiteUI(res.data.kpi2, '.tgSiteVal');
            setTgUserUI(res.data.kpi3, '.tgUserVal');
            setTgOrderUI(res.data.kpi4, '.tgOrderVal');
            setTgIncomeUI(res.data.kpi5, '.tgIncomeVal');
            c != 1 && setCircleData(res.data.assess[0]);
        });
    }

    let setTgCarUI = (data, _class) => { setTargetUI(data, _class); }
    let setTgSiteUI = (data, _class) => { setTargetUI(data, _class); }
    let setTgUserUI = (data, _class) => { setTargetUI(data, _class); }
    let setTgOrderUI = (data, _class) => { setTargetUI(data, _class); }
    let setTgIncomeUI = (data, _class) => { setTargetUI(data, _class); }

    let setTargetUI = (data, _class) => {
        let str = "";
        for (let d of data) {
            let imgSrc = d.tongbi_rate == 0 ? '' : d.tongbi_rate > 0 ? '../images/icon_rise.png' : '../images/icon_decline.png';
            str +=  "<li> <p>" + d.kpiname + "</p>" +
                    "<p>" + d.month_total + "</p>" +
                    "<p>" + d.kpi_yes + "</p>" +
                    "<p>" + d.kpi_tongbi + "</p>" +
                    "<p>" + d.tongbi_rate + "%" +
                    "<img src='" + imgSrc + "' alt=''/>" + "</p> </li>";
        }
        $(_class).html(str);
    }


    // 获取城市地图概览
    function update2CityMap() {
        let locat = JSON.parse(sessionStorage.locat);
        let mapUpdate = {
            geo: {
                center: [locat.value[0], locat.value[1]],
                zoom: 2.2
            },
            series: [{},{
                data: [locat]
            }]
        };
        autoCenterflag = true;
        stationsMap.setOption(mapUpdate);
        $('#forOverviewKPI').hide('fast');
        $('#detailBtn').hide('fast');
        $('#forCityDetailKPI').show('fast');
    }

    // 获取全国地图概览
    function update2CountryMap() {
        let mapUpdate = {
            geo: { zoom: 1.2 },
            series: [
                { data: MAP_CACHE },
                { data: [MAP_CACHE[0]] }
            ]
        }
        autoCenterflag = false;
        stationsMap.setOption(mapUpdate);
        sessionStorage.locat = JSON.stringify(MAP_CACHE[0]);
        $('#forOverviewKPI').show('fast');
        $('#detailBtn').show('fast');
        $('#forCityDetailKPI').hide('fast');
    }


    function setCircleData(d){
        $('.kpiCircle-ct').removeClass('active');
        $('.kpiCircle-ct:first-child').addClass('active');
        var cashCircle = echarts.init(document.getElementById("cashCircle"));
        optionCityCircle.series[0].data[0].value = d.kpi_ratev;
        optionCityCircle.series[0].data[1].value = 100 - d.kpi_ratev;
        cashCircle.setOption(optionCityCircle)

        var sheftCircle = echarts.init(document.getElementById("sheftCircle"));
        optionCityCircle.series[0].data[0].value = d.kpi_ratei;
        optionCityCircle.series[0].data[1].value = 100 - d.kpi_ratei;
        sheftCircle.setOption(optionCityCircle);

        var lawCircle = echarts.init(document.getElementById("lawCircle"));
        optionCityCircle.series[0].data[0].value = d.kpi_ratem;
        optionCityCircle.series[0].data[1].value = 100 - d.kpi_ratem;
        lawCircle.setOption(optionCityCircle);

        let y = getDaysOffset(-1);
        $('.ring-stopdate').html(y.slice(0, 4) + '-' + y.slice(4, 6) + '-' + y.slice(6, y.lenght));
        $('.cash-now').html(d.kpi_currentv);
        $('.cash-goal').html(d.kpi_goalv);
        $('.sheft-now').html(d.kpi_currenti);
        $('.sheft-goal').html(d.kpi_goali);
        $('.law-now').html(d.kpi_currentm);
        $('.law-goal').html(d.kpi_goalm);
    }

    // 城市KPI 车辆类型监控
    $('.kpiCircle-ct').on('click', function() {
         $(this).addClass('active').siblings().removeClass('active');
         var cashCircle = echarts.init(document.getElementById("cashCircle"));
         var sheftCircle = echarts.init(document.getElementById("sheftCircle"));
         switch ($(this).attr('data-type')) {
            case '1':
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_ratev;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_ratev) < 0 ? 0 : (100 - ODAVG_CACHE.kpi_ratev);
                cashCircle.setOption(optionCityCircle);
                $('.cash-now').html(ODAVG_CACHE.kpi_currentv);
                $('.cash-goal').html(ODAVG_CACHE.kpi_goalv);
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_ratei;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_ratei) < 0 ? 0 : (100 - ODAVG_CACHE.kpi_ratei);
                sheftCircle.setOption(optionCityCircle);
                $('.sheft-now').html(ODAVG_CACHE.kpi_currenti);
                $('.sheft-goal').html(ODAVG_CACHE.kpi_goali);
                break;
            case '2':
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_rateu;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_rateu) < 0 ? 0 : (100 - ODAVG_CACHE.kpi_rateu);
                cashCircle.setOption(optionCityCircle);
                $('.cash-now').html(ODAVG_CACHE.kpi_currentu);
                $('.cash-goal').html(ODAVG_CACHE.kpi_goalu);
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_ratep;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_ratep) < 0 ? 0 : (100 - ODAVG_CACHE.kpi_ratep);
                sheftCircle.setOption(optionCityCircle);
                $('.sheft-now').html(ODAVG_CACHE.kpi_currentp);
                $('.sheft-goal').html(ODAVG_CACHE.kpi_goalp);
                break;
            case '3':
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_rates;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_rates) < 0 ? 0 : (100 - ODAVG_CACHE.kpi_rates);
                cashCircle.setOption(optionCityCircle);
                $('.cash-now').html(ODAVG_CACHE.kpi_currents);
                $('.cash-goal').html(ODAVG_CACHE.kpi_goals);
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_raten;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_raten) < 0 ? 0 : 100 - (ODAVG_CACHE.kpi_raten);
                sheftCircle.setOption(optionCityCircle);
                $('.sheft-now').html(ODAVG_CACHE.kpi_currentn);
                $('.sheft-goal').html(ODAVG_CACHE.kpi_goaln);
                break;
           case '0':
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_ratet;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_ratet) < 0 ? 0 : (100 - ODAVG_CACHE.kpi_ratet);
                cashCircle.setOption(optionCityCircle);
                $('.cash-now').html(ODAVG_CACHE.kpi_currentt);
                $('.cash-goal').html(ODAVG_CACHE.kpi_goalt);
                optionCityCircle.series[0].data[0].value = ODAVG_CACHE.kpi_rateo;
                optionCityCircle.series[0].data[1].value = (100 - ODAVG_CACHE.kpi_rateo) < 0 ? 0 : (100 - ODAVG_CACHE.kpi_rateo);
                sheftCircle.setOption(optionCityCircle);
                $('.sheft-now').html(ODAVG_CACHE.kpi_currento);
                $('.sheft-goal').html(ODAVG_CACHE.kpi_goalo);
         }
    });
});

function showArea(id) {
    if (id == 7) {
        Tip.success('北京已是具体城市');
    } else if (id != 0) {
        let ids = [];
        // 获取参数集中的大区id
        for (let x of arguments) {
            ids.push(x);
        }
        ids.shift();  // 第一个为选中项, 需要剥离
        let tableId = ids.pop(); // 最后一个为表Id,需要剥离
        for (let x of ids) {
            for (let T of [1000,1001,1002]) {  // 此处与上方调用的table.Id集合保持一致 !!!
                let ACT = '.Area_' + T + x;
                tableId != T ? $(ACT).css('display', 'none') : x != id ? $(ACT).css('display', 'none') : $(ACT).css('display') == 'none' ? $(ACT).css('display', 'flex') : $(ACT).css('display', 'none');
            }
        }
    }

}
