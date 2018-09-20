/**
 * Created: zhangfs by Atom
 * Date: 2018/08/24
 */
$(document).ready(function () {
    var CAR_CACHE, TEAM_CACHE;
    var city = 1, carr_operate = 0, team_page = 1;
    var db_ct = 0, inc_ct = 0, car_ct = 0, od_ct = 0;
    var dashDate = getDaysOffset(-1),
        today = getDaysOffset(),
        yesterday = getDaysOffset(-1);
    var thisMonth = getMonthOffset();

    for (let i of [1]) {
        $('#appMonth'+i).val(thisMonth);
    }
    for (let i of [1,2,3,4,5,8,17,18,99]) {
        $('#appDateTime'+i).mobiscroll(APP.dateBar);
        $('#appDateTime'+i).val(i < 8 ? today : yesterday);
        i < 8 ? startingWeek(i) : startingWeekYesterday(i);
    }
    triggerLArea('#carrtog', '#carrtog-val', APP.carOperateBar2);

    // 获取城市列表
    getCity(function(res, cityInit) {
        city = cityInit;
        citySketch();
        Dashboard();
        teamDetail();
        incomeReal();
        carStatus();
        getPrincipal(city, [71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93]);
    })

    let $SR = $('#snapReal'), $SC = $('#snapColligates'), $CS = $('#chartsCtrl'), $UI = $('#userInfo');
    let $D = $('#dashboard'), $R = $('#realtime'), $C = $('#citystatus'), $W = $('#weekcomp'), $U = $('#userinfo');
    $(window).on('touchmove',function(){
        var WIN = $(window).scrollTop();
        let WIN_H = $(window).height();
        let offset = parseInt(WIN_H * 2 / 3);
        let dashBottom = parseInt($SR.offset().top) - offset;
        let realBottom = parseInt($SC.offset().top) - offset;
        let colligatesBottom = parseInt($CS.offset().top) - offset;
        let chartsBottom = parseInt($UI.offset().top) - offset;
        // 右悬浮快捷按钮自动活跃
        if (WIN >= 0 && WIN <= dashBottom) {
            $D.addClass('active')
                .css({width:"2rem"})
                .html('Dashboard')
                .siblings().removeClass('active')
                .css({width:".7rem"});
            $R.html('实');
            $C.html('综');
            $W.html('周');
            $U.html('用');
        } else if (WIN > dashBottom && WIN <= realBottom ) {
            $R.addClass('active')
                .css({width:"2rem"})
                .html('实时监控')
                .siblings().removeClass('active')
                .css({width:".7rem"});
            $D.html('D');
            $C.html('综');
            $W.html('周');
            $U.html('用');
        } else if (WIN > realBottom && WIN <= colligatesBottom ) {
            $C.addClass('active')
                .css({width:"2rem"})
                .html('综合分析')
                .siblings().removeClass('active')
                .css({width:".7rem"});
            $D.html('D');
            $R.html('实');
            $W.html('周');
            $U.html('用');
        } else if (WIN > colligatesBottom && WIN <= chartsBottom ) {
            $W.addClass('active')
                .css({width:"2rem"})
                .html('周对比分析')
                .siblings().removeClass('active')
                .css({width:".7rem"});
            $D.html('D');
            $R.html('实');
            $C.html('综');
            $U.html('用');
        } else if (WIN > chartsBottom ) {
            $U.addClass('active')
                .css({width:"2rem"})
                .html('用户分析')
                .siblings().removeClass('active')
                .css({width:".7rem"});
            $D.html('D');
            $R.html('实');
            $C.html('综');
            $W.html('周');
        }
    })

    $(window).on('touchend',function(){
        $D.html('D');
        $R.html('实');
        $C.html('综');
        $W.html('周');
        $U.html('用')
        $('aside p').css({width: '.7rem'});
    })

    // 滚动按需加载
    let scrollflag1 = true, scrollflag2 = true, scrollflag3 = true;
    $(window).bind('scroll', function() {
        var WIN = $(window).scrollTop();
        let WIN_H = $(window).height();
        // 滚动加载（一次性）
        if ( WIN > WIN_H * 0.8 && scrollflag1 ){
            scrollflag1 = false;
            carPower();
            orderReal();
            newGuy();
            getAssets();
            getKpi();
        } else if(WIN > WIN_H * 2.5 && scrollflag2 ) {
            scrollflag2 = false;
            getEfficiency();
            operationState();
        } else if(WIN > WIN_H * 4 && scrollflag3) {
            scrollflag3 = false;
            userTransform();
            getUserData();
            getRetained();
        }
        // 滚动只触发颜色切换特效
        let offset = parseInt(WIN_H * 2 / 3);
        let dashBottom = parseInt($SR.offset().top) - offset;
        let realBottom = parseInt($SC.offset().top) - offset;
        let colligatesBottom = parseInt($CS.offset().top) - offset;
        let chartsBottom = parseInt($UI.offset().top) - offset;
        if (WIN >= 0 && WIN <= dashBottom) {
            $D.addClass('active').siblings().removeClass('active');
        } else if (WIN > dashBottom && WIN <= realBottom ) {
            $R.addClass('active').siblings().removeClass('active');
        } else if (WIN > realBottom && WIN <= colligatesBottom ) {
            $C.addClass('active').siblings().removeClass('active');
        } else if (WIN > colligatesBottom && WIN <= chartsBottom ) {
            $W.addClass('active').siblings().removeClass('active');
        } else if (WIN > chartsBottom ) {
            $U.addClass('active').siblings().removeClass('active');
        }
    })

    // 切换城市 页面刷新
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val()=='') return
        city = $('#value3').val();
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        $('.phoneBubble').hide('fast');
        scrollflag1 = true;
        scrollflag2 = true;
        scrollflag3 = true;
        citySketch();
        Dashboard();
        teamDetail();
        incomeReal();
        carStatus();
        getPrincipal(city, [71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });

    /**
     * 城市悬浮
     */
    function citySketch() {
        buildAjax('get', 'kpi/getKPICityData', {cityId:city}, true, false, function(res) {
            $('#opentime').html(nullHandle(res.data.opentime) + '开');
        })
    }

    // 悬浮快捷键点击互动及增加活跃效果
    $('aside p').bind('click', function() {
        let _locate, $win = $(window);
        switch ($(this).attr('id')) {
            case 'realtime':
                _locate = 'snapReal'; break;
            case 'citystatus':
                _locate = 'snapColligates'; break;
            case 'weekcomp':
                _locate = 'chartsCtrl'; break;
            case 'userinfo':
                _locate = 'userInfo'; break;
            default:
                _locate = '';
        }
        if (_locate) {
            $win.scrollTop(parseInt($('#'+_locate).offset().top) - 200);
        } else {
            $win.scrollTop(0);
        }
        $(this).addClass('active').siblings().removeClass('active');
        $win.trigger('touchmove');
    })

    /**
     * Dashboard
     */
    function Dashboard() {
        var params = {
            cityId: city,
            dateId: dashDate,
            typeId: db_ct
        }
        buildAjax('get', 'getDashboardPageAppData', params, true, false, function(res) {
            let r = res.data[0];
            let boards = '';
            dashBoardBuild.map(function(i, d) {
                try {
                    boards += `<div class="board">
                        <div class="dash-real">
                            <p>${r[i.inter]}</p>
                            <p>${i.name}</p>
                        </div>
                        <div class="dash-compare">
                            <div class="${r[i.inter + '2'] < 0 ? 'fontRed' : ''}">
                                <p>${r[i.inter + '2']}</p>
                                <p>上月环比</p>
                            </div>
                            <div class="${r[i.inter + '3'] < 0 ? 'fontRed' : ''}">
                                <p>${r[i.inter + '3']}</p>
                                <p>上年同比</p>
                            </div>
                        </div>
                    </div>`
                } catch (e) {
                    boards = `<p>抱歉暂无该月数据，先看看其他月份吧～</p>`;
                    return;
                }
            });
            $('.boards').html(boards);
        })
    }

    // 当月传昨天，上月传上月最后一天
    function dashDatefilter() {
        if (parseInt($('#appMonth1').val().slice(4,6)) == new Date().getMonth() + 1) {
            dashDate = getDaysOffset(-1);
        } else {
            var  d = new Date($('#appMonth1').val().slice(0,4), $('#appMonth1').val().slice(4,6), 1);
            d.setDate(1);
            d.setMonth(d.getMonth());
            d.setDate(d.getDate() - 1);
            dashDate = d.format('yyyyMMdd');
        }
    }

    // dashboard logic
    $('#appMonth1').on('change', function(){
        isMonthValid(1) && dashDatefilter() && Dashboard();
    })
    $('.db-premonth, .db-nextmonth').on('click', function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'premonth' ? $('#'+id).val(updateMonth(this.parentNode, -1, true)) : $('#'+id).val(updateMonth(this.parentNode, 1, true));
        dashDatefilter()
        Dashboard();
    });
    $('.db-ct').on('click',function() {
        $('.db-ct').removeClass('active');
        $(this).addClass('active');
        db_ct = $(this).attr('data-type');
        Dashboard();
    });

    /**
     * 团队详情
     */
    function teamDetail() {
        buildAjax('get','searchOfficePeopleApp', {cityId:city}, true, false, function(res) {
            let team = new Array(), max = 0, r = res.data;
            for (let d of r) {
                max = d.monthId > max ? d.monthId : max;
            }
            for (let m of r) {
                let member;
                try {
                    if (r.indexOf(m) == 0) {
                        member = `<p>${m.people_name}</p><p>${m.officename}</p>
                            <meter value="${m.monthId}" max="${max+3}">抱歉，您的浏览器不支持测绘标签</meter>
                            <label>${m.monthId}</label>`
                    } else {
                        member = `<p>${m.people_name}</p><p>${m.officename}</p>
                            <meter value="${m.monthId}" max="${max+3}"></meter>
                            <label>${m.monthId}</label>`
                    }
                } catch (e) {
                    console.log(e.name + ':\n\n' + e.message);
                    member = "<span>糟糕！ 数据君跑路了～</span>"
                }
                team.push(member);
            }
            TEAM_CACHE = team;
            team_page = resetPaging('team-nowpage');
            $('.team-allpage').html( Math.ceil(TEAM_CACHE.length / 7) == 0 ? 1 : Math.ceil(TEAM_CACHE.length / 7) );
            setTeamUI(TEAM_CACHE.slice(0, 7));
        })
    }

    let refTeamUI = p => {
        p = p || 1;
        TEAM_CACHE ? setTeamUI(TEAM_CACHE.slice(7*(p-1), 7*p)) : teamDetail();
    }

    let setTeamUI = r => {
        $('.team').html(r.join(''));
    }

    $('.team-prepage, .team-nextpage').click(function() {
         team_page = pagingCtrl(this, team_page, refTeamUI);
    });

    /**
     * 实时收现
     */
    let incrChart = echarts.init(document.getElementById("incrChart"));
    incrChart.showLoading({ effect:'ring' });

    function incomeReal(date, p) {
        let data = {
            cityId: city,
            dateId: $('#appDateTime1').val(),
            carType: inc_ct
        }
        buildAjax('get', 'getOrderRealAmount', data, true, false, function(res){
            let r = res.data;
            realCashOption.xAxis.data = r.data1;
            for (let i of [2,3,4,5]) {
                realCashOption.series[i-2].data = r['data'+i];
            }
            incrChart.setOption(realCashOption);
            incrChart.hideLoading();
            let note = "<div class='noteLine'> <p>总收入 <span>" + r.sumData0 + "</span> </p>" +
                  "<p>总收现 <span>" + r.sumData1 + "</span> </p>" +
                  "<p>总优惠 <span>" + r.sumData2 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>单均收入 <span>" + r.sumData4 + "</span> </p>" +
                  "<p>单均收现 <span>" + r.sumData5 + "</span> </p>" +
                  "<p>单均优惠 <span>" + r.sumData6 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>未结算 <span>" + r.sumData3 + "</span> </p>" +
                  "<p>单均未结算 <span>" + r.sumData7 + "</span> </p><p></p> </div>";
            $('.incr-notebar').html(note);
        });
    }
    // 实时营收 logic
    $('.incr-predate, .incr-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                               : $('#'+id).val(updateDate(this.parentNode, 1, true));
        incomeReal();
    });
    $('#appDateTime1').bind('change', function() {
        isDateValid(1) && incomeReal();
        updateWeek(this);
    });
    $('.incr-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         inc_ct = $(this).attr('data-type');
         incomeReal();
    });


    /**
     * 实时车辆状况
     */
    let carrChart = echarts.init(document.getElementById("carrChart"));
    carrChart.showLoading({ effect:'ring' });

    function carStatus() {
        let data = {
            cityId: city,
            dateId: $('#appDateTime2').val(),
            carType: car_ct
        }
        buildAjax('get', 'getCarRealData', data, true, false, function(res){
            CAR_CACHE = res.data;
            setCrChartUI(CAR_CACHE);
        });
    }
    // 车辆现况 堆叠图刷新
    let refCrChartUI = () => {
        CAR_CACHE ? setCrChartUI(CAR_CACHE) : carStatus();
    }
    let setCrChartUI = d => {
        carrChart.clear();
        let str = "";
        let opt = carr_operate == 1 ? optionOn : carr_operate == 2 ? optionDown : carr_operate == 3 ? optionOther : realCarOption;
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
        $('.carr-notebar').html(str);
    }

    // 车辆现况 logic
    $('.carr-predate, .carr-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      carStatus();
    });
    $('#appDateTime2').bind('change', function() {
        isDateValid(2) && carStatus();
        updateWeek(this);
    });
    $('.carr-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         car_ct = $(this).attr('data-type');
         carStatus();
    });
    $('#carrtog').bind('input propertychange', function() {
        if ($('#carrtog-val').val()){
            carr_operate = $('#carrtog-val').attr('value');
            refCrChartUI();
        }
    });

    /**
     * 车辆电量
     */
    var cbChart = echarts.init(document.getElementById("cbChart"));
    cbChart.showLoading({ effect:'ring' });

    function carPower() {
        buildAjax('get', 'getKpiCarPower', {cityId:city,dateId:$('#appDateTime3').val()}, true, false, function(res) {
            let r = res.data;
            realPowerOption.xAxis.data = r.data1;
            for (let i of [2,3,4,5,6]) {
                realPowerOption.series[6-i].data = r['data'+i];
            }
            cbChart.setOption(realPowerOption);
            cbChart.hideLoading();
            let str = "<div class='noteLine'> <p>待租65%以下车辆 <span>" + r.sumData0 + "</span> </p>" +
                      "<p>下架65%以下车辆 <span>" + r.sumData1 + "</span> </p> </div>"
            $('.cb-notebar').html(str);
        });
    }
    // 车辆电量 logic
    $('.cb-predate, .cb-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      carPower();
    });
    $('#appDateTime3').bind('change', function() {
        isDateValid(3) && carPower();
        updateWeek(this);
    });

    /**
     * 实时订单
     */
    var orChart = echarts.init(document.getElementById("orChart"));
    orChart.showLoading({ effect:'ring' });

    function orderReal() {
        let data = {
            cityId: city,
            dateId: $('#appDateTime4').val(),
            carType: od_ct
        }
        buildAjax('get','getOrderRealData', data, true, false, function(res){
            let r = res.data;
            realOrderOption.xAxis.data = r.data1;
            for (let i of [2,3,4]) {
                realOrderOption.series[i-2].data = r['data'+i];
            }
            orChart.setOption(realOrderOption);
            orChart.hideLoading();
            let note = "<div class='noteLine'> <p>今日下单量 <span>" + r.sumData0 + "</span> </p>" +
                  "<p>今日取消单 <span>" + r.sumData2 + "</span> </p>" +
                  "<p>单均里程 <span>" + r.sumData4 + "</span> </p> </div>" +
                  "<div class='noteLine'> <p>今日取车单 <span>" + r.sumData1 + "</span> </p>" +
                  "<p>车均单 <span>" + r.sumData3 + "</span> </p>" +
                  "<p>单均时长 <span>" + r.sumData5 + "</span> </p> </div>";
            $('.or-notebar').html(note);
        });
    }
    // 实时订单折线图 logic
    $('.or-predate, .or-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      orderReal();
    });
    $('#appDateTime4').bind('change', function() {
        isDateValid(4) && orderReal();
        updateWeek(this);
    });
    $('.or-ct').on('click', function() {
         $('.' + this.classList[1]).removeClass('active');
         $(this).addClass('active');
         od_ct = $(this).attr('data-type');
         orderReal();
    });

    /**
     * 实时新增用户
     */
    var ngChart = echarts.init(document.getElementById("ngChart"));
    ngChart.showLoading({ effect:'ring' });

    function newGuy(date, p) {
        buildAjax('get', 'getRegisterRealData', {cityId:city, dateId:$('#appDateTime5').val()}, true, false, function(res){
            let r = res.data;
            realNewguyOption.xAxis.data = r.data1;
            for (let i of [2,3,4,5,6]) {
                realNewguyOption.series[i-2].data = r['data'+i];
            }
            ngChart.setOption(realNewguyOption);
            ngChart.hideLoading();
            let note = "<div class='noteLine'> <p>今日注册数 <span>" + r.sumData0 + "</span> </p>" +
                  "<p>今日新增双证 <span>" + r.sumData1 + "</span> </p>" +
                  "<p> <span></span> </p> </div>" +
                  "<div class='noteLine'> <p>今日下单用户 <span>" + r.sumData3 + "</span> </p>" +
                  "<p>今日押金用户 <span>" + r.sumData2 + "</span> </p>" +
                  "<p>今日首单用户 <span>" + r.sumData4 + "</span> </p> </div>";
            $('.ng-notebar').html(note);
        });
    }
    // 新增用户折线图 logic
    $('.ng-predate, .ng-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      newGuy();
    });
    $('#appDateTime5').bind('change', function() {
        isDateValid(5) && newGuy();
        updateWeek(this);
    });

    /**
     * 资产分析
     */
    function getAssets() {
        buildAjax('get', 'searchAssetProfileApp', {cityId:city}, true, false, function(res) {
            for (let d of res.data) {
                switch (d.id) {
                    case 57:
                        $('#car-all').html(d.kpi_current); break;
                    case 141:
                        $('#car-off').html(d.kpi_current); break;
                    case 1:
                        $('#car-in').html(d.kpi_current); break;
                    case 13:
                        $('#site-all').html(d.kpi_current); break;
                    case 15:
                        $('#site-real').html(d.kpi_current); break;
                    case 16:
                        $('#site-virtual').html(d.kpi_current); break;
                    case 17:
                        $('#park-all').html(d.kpi_current); break;
                    case 18:
                        $('#park-real').html(d.kpi_current); break;
                    case 19:
                        $('#park-virtual').html(d.kpi_current);
                }
            }
        })
    }


    /**
     * KPI考核
     */
    function getKpi() {
        buildAjax('get', 'kpi/getCoreIndex', {cityId:city}, true, false, function(res) {
            let target = res.data.assess[0];
            for (let r of res.data.assess) {
                if (r.city_id == city) {
                    target = r;
                    break;
                }
            }
            city == 1 ? setNationKpiUI(target) : setCityKpiUI(target);
            // setCityKpiUI_sub(target);  // 数据表形式展示
        })
    }

    // 全国状态下的KPI考核
    let setNationKpiUI = r => {
        $('#nation_kpi').show('fast');
        $('.city_kpi').hide('fast');
        let html = '';
        try {
          html = `<li> <p>车均收现（新电车）</p> <p>${r.kpi_currentt +'￥'}</p> </li>
              <li> <p>车均收现（老电车）</p> <p>${r.kpi_currentu +'￥'}</p> </li>
              <li> <p>车均收现（燃油车）</p> <p>${r.kpi_currents +'￥'}</p> </li>
              <li> <p>违法处理率</p> <p>${r.kpi_currentm + ' %'}</p> </li>
              <li> <p>车均上架时长（新电车）</p> <p>${r.kpi_currento +' h'}</p> </li>
              <li> <p>车均上架时长（老电车）</p> <p>${r.kpi_currentp +' h'}</p> </li>
              <li> <p>车均上架时长（燃油车）</p> <p>${r.kpi_currentn +' h'}</p> </li>`
        } catch (e) {
            console.log(e.name + ':\n\n' + e.message);
            html = '<div>非常抱歉！数据出现异常</div>';
        }
        $('#nation_kpi_val').html(html);
    }

    // 具体城市状态下的KPI考核
    let setCityKpiUI = r => {
        $('#nation_kpi').hide('fast');
        $('.city_kpi').show('fast');
        setGaugeDataUI(r, 'cash', ['t','u','s']);
        var cashNewEv = echarts.init(document.getElementById("cash-newev"));
        gaugeOption.series[0].data[0].value = r.kpi_ratet;
        cashNewEv.setOption(gaugeOption);

        var cashOldEv = echarts.init(document.getElementById("cash-oldev"));
        gaugeOption.series[0].data[0].value = r.kpi_rateu;
        cashOldEv.setOption(gaugeOption);

        var cashOil = echarts.init(document.getElementById("cash-oil"));
        gaugeOption.series[0].data[0].value = r.kpi_rates;
        cashOil.setOption(gaugeOption);

        setGaugeDataUI(r, 'sheft', ['o','p','n','m']);
        var sheftNewEv = echarts.init(document.getElementById("sheft-newev"));
        gaugeOption.series[0].data[0].value = r.kpi_rateo;
        sheftNewEv.setOption(gaugeOption);

        var sheftOldEv = echarts.init(document.getElementById("sheft-oldev"));
        gaugeOption.series[0].data[0].value = r.kpi_ratep;
        sheftOldEv.setOption(gaugeOption);

        var sheftOil = echarts.init(document.getElementById("sheft-oil"));
        gaugeOption.series[0].data[0].value = r.kpi_raten;
        sheftOil.setOption(gaugeOption);

        var lawAll = echarts.init(document.getElementById("law-all"));
        gaugeOption.series[0].data[0].value = r.kpi_ratem;
        lawAll.setOption(gaugeOption);
    }

    let setGaugeDataUI = (r, _dom, tg) => {
        let current = '', goal = '';
        try {
            current = `<div><p>${r['kpi_current'+tg[0]]}</p><p>新电车当前值</p></div>
                    <div><p>${r['kpi_current'+tg[1]]}</p><p>老电车当前值</p></div>
                    <div><p>${r['kpi_current'+tg[2]]}</p><p>燃油车当前值</p></div>`;
            if (tg[3]) {
                current += `<div><p>${r['kpi_current'+tg[3]]}</p><p>违法处理率</p></div>`;
            }
            for(let x of tg) {
                goal += "<div><p>" + r['kpi_goal'+x] + "</p><p>目标值</p></div>";
            }
        } catch (e) {
            console.log(e.name + ':\n\n' + e.message);
            current = '<div>非常抱歉！数据出现异常</div>';
        }
        $('#'+_dom+'current-line').html(current);
        $('#'+_dom+'goal-line').html(goal);
    }

    // 具体城市状态下的KPI考核
    let setCityKpiUI_sub = r => {
        $('#nation_kpi').hide();
        let html = '';
        try {
            html = `<li> <p>车均收现（新电车）</p> <p>${r.kpi_goalt +'￥'}</p> <p>${r.kpi_currentt +'￥'}</p> <p>${r.kpi_ratet +'%'}</p> </li>
                <li> <p>车均收现（老电车）</p> <p>${r.kpi_goalu +'￥'}</p> <p>${r.kpi_currentu +'￥'}</p> <p>${r.kpi_rateu +'%'}</p> </li>
                <li> <p>车均收现（燃油车）</p> <p>${r.kpi_goals +'￥'}</p> <p>${r.kpi_currents +'￥'}</p> <p>${r.kpi_rates +'%'}</p> </li>
                <li> <p>违法处理率</p> <p>${r.kpi_goalm +' %'}</p> <p>${r.kpi_ratem +' %'}</p> <p>${(r.kpi_ratem / r.kpi_goalm).toFixed(2)*100 +'%'}</p> </li>
                <li> <p>车均上架时长（新电车）</p> <p>${r.kpi_goalo +' h'}</p> <p>${r.kpi_currento +' h'}</p> <p>${r.kpi_rateo +'%'}</p> </li>
                <li> <p>车均上架时长（老电车）</p> <p>${r.kpi_goalp +' h'}</p> <p>${r.kpi_currentp +' h'}</p> <p>${r.kpi_ratep +'%'}</p> </li>
                <li> <p>车均上架时长（燃油车）</p> <p>${r.kpi_goaln +' h'}</p> <p>${r.kpi_currentn +' h'}</p> <p>${r.kpi_raten +'%'}</p> </li>`
        } catch(e) {
            console.log(e.name + ':\n\n' + e.message);
            html = '<div>非常抱歉！数据出现异常</div>';
        }
        $('#city_kpi_val').html(html);
    }



    /**
     * 运营效率
     */
    function getEfficiency() {
        var P = {
            cityId: city,
            dateId: $('#appDateTime8').val()
        };
        buildAjax('get', 'searchOperateAppEfficiency', P, true, false, function(res) {
            setEffiUI(res.data);
        })
    }
    let setEffiUI = r => {
        let fv = new Array();
        let sv = new Array();
        for (let d of r) {
            let x = `<li>${d.kpi_name}</li>`;
            fv.push(x);
            let I = d.lastweek_rate;
            let img = I > 0 ? '../images/icon_rise.png' : I < 0 ? '../images/icon_decline.png' : '';
            let y = `<li>
                        <p>${d.current_value}</p>
                        <p>${d.yesterday_value}</p>
                        <p>${d.lastweek_value}</p>
                        <p>${d.lastweek_rate}% <img src='${img}' alt=''/></p>
                    </li>`;
            sv.push(y);
        }
        $('#effi-fv').html(fv.join(''));
        $('#effi-sv').html(sv.join(''));
    }


    /**
     * 运营收入
     */
    let iChart = echarts.init(document.getElementById("income"));
    iChart.showLoading({ effect:'ring' });
    /**
     * 运营收现
     */
    let cChart = echarts.init(document.getElementById("cash"));
    cChart.showLoading({ effect:'ring' });
    /**
     * 车均单
     */
    let coChart = echarts.init(document.getElementById("carorder"));
    coChart.showLoading({ effect:'ring' });
    /**
     * 车均收现
     */
    let ccChart = echarts.init(document.getElementById("carcash"));
    ccChart.showLoading({ effect:'ring' });
    /**
     * 单均收现
     */
    let ocaChart = echarts.init(document.getElementById("ordercash"));
    ocaChart.showLoading({ effect:'ring' });
    /**
     * 取车单
     */
    let ucChart = echarts.init(document.getElementById("usecar"));
    ucChart.showLoading({ effect:'ring' });

    /**
     * 运营车指标综合分析
     */
    function operationState() {
        buildAjax('get', 'searchOperateWeekDataApp', {cityId:city,dateId:$('#appDateTime99').val()}, true, false, function(res) {
            let color = ['#9be64d', '#11a05a'];
            let legend = ['本周运营收入', '上周运营收入'];
            weekLineOption.series[0].data = res.data.sumAmount;
            weekLineOption.series[1].data = res.data.sumAmountU;
            weekLineOption.color = color;
            weekLineOption.legend.data = legend;
            iChart.setOption(weekLineOption);
            iChart.hideLoading();

            color = ['#f1ee56', '#3ad222'];
            legend = ['本周运营收现', '上周运营收现'];
            weekBarOption.series[0].data = res.data.sumPayAmount;
            weekBarOption.series[1].data = res.data.sumPayAmountU;
            weekBarOption.color = color;
            weekBarOption.legend.data = legend;
            cChart.setOption(weekBarOption);
            cChart.hideLoading();

            color = ['#19b2e4', '#3853e4'];
            legend = ['本周车均单', '上周车均单'];
            weekBarOption.series[0].data = res.data.order_real_avg;
            weekBarOption.series[1].data = res.data.order_real_avgU;
            weekBarOption.color = color;
            weekBarOption.legend.data = legend;
            coChart.setOption(weekBarOption);
            coChart.hideLoading();

            color = ['#ceba19', '#1510a0'];
            legend = ['本周车均收现', '上周车均收现'];
            weekLineOption.series[0].data = res.data.car_avgpayamount;
            weekLineOption.series[1].data = res.data.car_avgpayamountU;
            weekLineOption.color = color;
            weekLineOption.legend.data = legend;
            ccChart.setOption(weekLineOption);
            ccChart.hideLoading();

            color = ['#8ce431', '#24a547'];
            legend = ['本周单均收现', '上周单均收现']
            weekBarOption.series[0].data = res.data.avg_sumPayAmount;
            weekBarOption.series[1].data = res.data.avg_sumPayAmountU;
            weekBarOption.color = color;
            weekBarOption.legend.data = legend;
            ocaChart.setOption(weekBarOption);
            ocaChart.hideLoading();

            color = ['#19b2e4', '#3853e4'];
            legend = ['本周取车单', '上周取车单']
            weekLineOption.series[0].data = res.data.order_up;
            weekLineOption.series[1].data = res.data.order_upU;
            weekLineOption.color = color;
            weekLineOption.legend.data = legend;
            ucChart.setOption(weekLineOption);
            ucChart.hideLoading();
        });
        carOnline();  // 车均上架时长
    }
    // 单均收现 logic
    $('.week-predate, .week-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -7, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 7, true));
      operationState();
    });
    $('#appDateTime99').bind('change', function() {
        isDateValid(99) && operationState();
        updateWeek(this);
    });

    /**
     * 上架时长
     */
    let olChart = echarts.init(document.getElementById("caronline"));
    olChart.showLoading({ effect:'ring' });

    function carOnline() {
        buildAjax('get', 'searchAvgCarOnlineDataApp', {cityId:city,dateId:$('#appDateTime99').val()}, true, false, function(res) {
            let color = ['#94c840', '#1096af'], legend = ['本周上架时长', '上周上架时长'];
            weekBarOption.series[0].data = res.data.current;
            weekBarOption.series[1].data = res.data.upWeek;
            weekBarOption.color = color;
            weekBarOption.legend.data = legend;
            olChart.setOption(weekBarOption);
            olChart.hideLoading();
        });
    }

    // 单均收现 logic
    $('.ol-predate, .ol-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -7, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 7, true));
      carOnline();
    });
    $('#appDateTime9').bind('change', function() {
        isDateValid(9) && carOnline();
        updateWeek(this);
    });


    /**
     * 用户转化漏斗图
     */
    var userFunnel = echarts.init(document.getElementById("ut-funnel"));
    userFunnel.showLoading({ effect:'ring' });

    function userTransform() {
        buildAjax('get', 'MUser/MuserTransformData', {cityId:city,reportId:1}, true, false, function(res){
            let arr = [];
            for(let d of res.data) {
                arr.push(d.name)
            }
            funnelOption.series[0].data = res.data;
            funnelOption.legend.data = arr.reverse();
            userFunnel.setOption(funnelOption);
            userFunnel.hideLoading();
        }, false);
    }

    /**
     * 七日用户转化分析
     */
    function getUserData() {
        let P = {
            cityId: city,
            dateId: $('#appDateTime17').val()
        };
        buildAjax('get', 'searchUserAppData', P, true, false, function(res) {
            set7DaysUI(res.data, P.dateId, 'user');
        });
    }
    // user analysis logic
    $('.user-predate, .user-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      getUserData();
    });
    $('#appDateTime17').bind('change', function() {
        isDateValid(17) && getUserData();
        updateWeek(this);
    });

    /**
     * 七日用户留存分析
     */
    function getRetained() {
        let P = {
            cityId: city,
            dateId: $('#appDateTime18').val()
        };
        buildAjax('get', 'searchRetentionAppRate', P, true, false, function(res) {
            set7DaysUI(res.data, P.dateId, 'rt');
        })
    }

    let set7DaysUI = (r, d, master) => {
        try {
             // 构造表头
            let sh_arr = [], sh = '', fv = '', sv = '';
            for (let i = 0; i < 7; i ++) {
                sh += `<p>${getDaysOffset(0-i, d)}</p>`;
                sh_arr.push(getDaysOffset(0-i, d));
            }
            $('#' + master + '-sh').html(sh)
            // 构造指标和各日期数据
            for (let i of r) {
                fv += `<li>${i.zhibiao}</li>`;
                sv += "<li>";
                for (let d of sh_arr) {
                    sv += `<p>${i[d]}</p>`;
                }
                sv += "</li>";
            }
            $('#' + master + '-fv').html(fv);
            $('#' + master + '-sv').html(sv);
        } catch (e) {
            console.log(e.name + ':\n\n' + e.message);
        }
    }

    // user retained logic
    $('.rt-predate, .rt-nextdate').on('click',function() {
      let id = this.parentNode.children[1].children[0].id;
      this.classList[1].split('-')[1] == 'predate' ? $('#'+id).val(updateDate(this.parentNode, -1, true))
                                             : $('#'+id).val(updateDate(this.parentNode, 1, true));
      getRetained();
    });
    $('#appDateTime18').bind('change', function() {
        isDateValid(18) && getRetained();
        updateWeek(this);
    });
})
