/**
 * Created: zhangfs by Atom
 * Date: 2018/08/20
 */
$(document).ready(function(){
    var CITY, CITIES, MAP_CACHE, HEATMAP_CACHE, OPEN_APP, HEAT, PARK, FUN, CARS, TRAIL_CACHE;
    var CALL_CACHE = new Array();
    var city = 1, exactCity = 2;
    var interval, ajaxCtrl;
    var today = getDaysOffset(), yesterday = getDaysOffset(-1);
    var hourStart = new Date().getHours() - 2, hourEnd = new Date().getHours() - 1;
    $('.box').css('height', $(window).height());
    $('#cities').addClass('active').siblings().removeClass('active');
    APP.dateBar.theme = 'android-ics light';
    $('#appDateTime1').mobiscroll(APP.dateBar);
    $('#appDateTime1').val(yesterday);
    startingWeekYesterday(1);

    // 时间条件联动
    $('.map-predate, .map-nextdate').on('click',function() {
        let id = this.parentNode.children[1].children[0].id;
        let $ID = $('#'+id);
        this.classList[1].split('-')[1] == 'predate' ? $ID.val(updateDate(this.parentNode, -1, true))
                                               : $ID.val(updateDate(this.parentNode, 1, true));
        hourStart = ($ID.val() == today) ? new Date().getHours() - 2 : 18;
        hourEnd = ($ID.val() == today) ? new Date().getHours() - 1 : 19;
        $('.mapsBar p[class="active"]').trigger('click');
    });
    $('#appDateTime1').bind('change', function() {
        if (isDateValid(1)) {
            hourStart = ($('#appDateTime1').val() == today) ? new Date().getHours() - 2 : 18;
            hourEnd = ($('#appDateTime1').val() == today) ? new Date().getHours() - 1 : 19;
            $('.mapsBar p[class="active"]').trigger('click');
        }
        updateWeek(this);
    });



    getCity(function(res, cityInit){
        CITY = '北京';
        CITIES = res.data;
        city = cityInit;
        exactCity = city == 1 ? 2 : city;
        city == 1 ? addUrbanLayout() : addParks();
    })

    // 切换城市
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val()=='') return
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        city = $('#value3').val();
        CITY = $('#demo3').val();
        exactCity = city == 1 ? 2 : city;
        $('.mapsBar p[class="active"]').trigger('click');
    });


    // 功能导航栏
    $('.mapsBar p').on('click', function(e) {
        window.clearInterval(interval);
        ajaxCtrl && ajaxCtrl.abord();
        $(this).addClass('active').css({'color':'#FFFFFF'})
               .siblings().removeClass('active').css({'color':'#26b7ff'});
        switch (e.target.id) {
            case 'cities':
                $('#demo3').val() == '全国' ? addUrbanLayout() : addParks(); break;
            case 'calls':
                addCallListener(); break;
            case 'carSeat':
                setCities()
                addCarSeat(); break;
            case 'driveTrail':
                setCities();
                addTrailMap(); break;
            case 'openApp':
                setCities();
                addHeatMap(); break;
        }
    });


    // function cityWithNation() {
    //     triggerLArea("#demo3", "#value3", CITIES.unshift({text:'全国', value: '1'}));
    // }
    function setCities() {
        $('#demo3').val() == '全国' ? $('#demo3').val('北京') : '';
        // triggerLArea("#demo3", "#value3", CITIES.shift());
    }


    /**
     * 绘制开城城市布局
     */
    function addUrbanLayout() {
        $('#cities').html('开城布局');
        $('.location').show();
        $('#eMap, #bMap, #top10').remove();
        $('.singleDatePicker').css({'display':'none'});
        $('<div id="eMap" class="urbansBG"></div>').appendTo('.box');
        $('#carSeatBar, #parkfun, #heatparkfun').animate({'right': '-1rem'});
        var emap = echarts.init(document.getElementById('eMap'));
        echarts.registerMap('china', chinaMapJson);
        emap.showLoading({ effect:'ring' });
        ajaxCtrl = buildAjax('get', 'largeScreen/getOpenCityDataApp', {}, false, false, function(res) {
            urbanOption.title.text = '累计注册用户: ' + res.data.signInNum.regis_num_total;
            urbanOption.title.subtext = '累计开城: ' +　res.data.cityNumData[0].city_num;
            urbanOption.legend.data = ['2017','2018'];
            urbanOption.series[0].data = res.data.series[0].data;
            urbanOption.series[1].data = res.data.series[1].data;
        })
        emap.setOption(urbanOption);
        emap.hideLoading();
    }



    /**
     * 绘制开城城市网点布局网点信息_百度地图方式
     */
     function addParks_Baidu() {
          $('#cities').html('网点布局');
          $('.location').show();
          $('#eMap, #bMap, #top10').remove();
          $('<div id="bMap"></div>').appendTo('.box');
          $('.singleDatePicker').css({'display':'none'});
          $('#carSeatBar, #parkfun, #heatparkfun').animate({'right': '-1rem'});

          var bmap = new BMap.Map("bMap");
          MAP_CACHE = bmap;
          drawBMap(bmap);
          ajaxCtrl = buildAjax('get', 'largeScreen/getParkNodeLinkDataApp', {dateId:yesterday, cityId:exactCity}, true, false, function(res) {
              let R = JSON.parse(res.data);
              PARK = R.parKingslist;
              FUN = R.parKingsVirtuallist;
              setPark('sitelink');
              setFun('sitelink');
          })
     }


     /**
      * 绘制开城城市网点布局详情 echarts 方式
      */
     function addParks() {
         $('#cities').html('网点布局');
         $('#eMap, #bMap, #top10').remove();
         $('<div id="eMap"></div>').appendTo('.box');
         $('.singleDatePicker').css({'display':'none'});
         $('#carSeatBar, #parkfun, #heatparkfun').animate({'right': '-1rem'});
         var emap = echarts.init(document.getElementById('eMap'));
         buildAjax('get','largeScreen/getCityCenterDataApp',{cityId:exactCity},true,false, function(res) {
            let r = JSON.parse(res.data);
            parksOption.bmap.center = r.center;
            emap.setOption(parksOption);
            let params = {dateId:yesterday, cityId:exactCity};
            ajaxCtrl = buildAjax('get', 'largeScreen/getParkNodeLinkDataApp', params, true, false, function(res) {
                let r = JSON.parse(res.data);
                parksOption.series[0].data = r.parKingslist;
                parksOption.series[1].data = r.parKingsVirtuallist;
                emap.setOption(parksOption);
            })
        });

        emap.on('click', function (p) {
            // 如果点击的是航线,不执行任何操作,只弹出tooltip
            if (p.data.hasOwnProperty('fromName')) return;
            parksOption.bmap.center = p.value;
            parksOption.series[2].name = p.seriesName;
            let params = { dateId:yesterday, cityId:city, parkId:p.data.parkId };
            buildAjax('get', 'largeScreen/getParkFlowingDetailData', params, true, false, function(res) {
                let r = JSON.parse(res.data)
                parksOption.series[2].data = [{
                    name: p.name,
                    value: p.value,
                    carportNum: p.data.carportNum,
                    carportAvgorder: p.data.carportAvgorder,
                    orderNum: p.data.orderNum,
                    parkId: p.data.parkId,
                    rank: p.data.rank
                }];

                parksOption.series[3].data = r.lineList;
                parksOption.series[4].data = r.lineList2;
                emap.setOption(parksOption);
            })
        });
     }


    /**
     * 绘制来电监听
     */
    function addCallListener() {
        $('.location').hide();
        $('#eMap, #bMap').remove();
        $('.singleDatePicker').css({'display':'none'});
        $('<div id="eMap" class="urbansBG"></div>').appendTo('.box');
        $('<div id="top10"></div>').appendTo('.box');
        $('#carSeatBar, #parkfun, #heatparkfun').animate({'right': '-1rem'});
        var emap = echarts.init(document.getElementById('eMap'));
        echarts.registerMap('china', chinaMapJson);
        getCalls();
        interval = setInterval(getCalls, 4500);
        // 监听呼叫
        function getCalls() {
            var etop = echarts.init(document.getElementById('top10'));
            buildAjax('get', 'getCallTopTenData', {dateId:today}, true, false, function(res) {
                topOption.yAxis.data = res.data.yAxis;
                topOption.series[0].data = res.data.seriesData;
                etop.setOption(topOption);
            });
            ajaxCtrl = buildAjax('get', 'getCallWaitingData', {dateId:today}, true, false, function(res) {
                callOption.series[0].data = res.data;
                var newCalls = new Array();
                for (let old of CALL_CACHE) {
                    for(let call of res.data) {
                        if(old.name == call.name && old.num < call.num) {
                            newCalls.push(call);
                            break;
                        }
                    }
                }
                callOption.series[1].data = newCalls;
                emap.setOption(callOption);
                CALL_CACHE = res.data;
            });
        }
    }



    /**
     * 绘制车辆位置
     */
    function addCarSeat () {
        $('.location').show();
        $('.singleDatePicker').css({'display':'none'});
        $('#eMap, #bMap, #top10').remove();
        $('<div id="bMap"></div>').appendTo('.box');
        $('#onserve').addClass('active').siblings().removeClass('active');
        $('#parkfun, #heatparkfun').animate({'right': '-1rem'});
        var bmap = new BMap.Map("bMap");
        MAP_CACHE = bmap;
        drawBMap(bmap);
        buildAjax('get','largeScreen/getRealCarStateApp',{cityId:exactCity}, true, false, function(res) {
            let carStatus = JSON.parse(res.data);
            for (let s of carStatus) {
                let id = s.State == 1 ? 'forrent' :
                         s.State == 2 ? 'reserve' :
                         s.State == 4 ? 'stopserve' :
                         s.State == 5 ? 'lowcharge' : 'onserve';
                $('#'+id+' span').html(s.cntnum);
            }
            setCarUI(3);
        });
    }
    // 绘每一辆车的位置
    function setCarUI(state) {
        MAP_CACHE.clearOverlays();
        ajaxCtrl = buildAjax('get', 'largeScreen/getRealCarStateDataApp', {cityId:exactCity,stateId:state},true, false, function(res) {
            $('#carSeatBar').animate({'right': '1%'});
            let R = JSON.parse(res.data);
            PARK = R.parKingslist;
            FUN = R.parKingsVirtuallist;
            CARS = R.realData;
            setCars()
        })
    }
    function setCars() {
        for (let c of CARS) {
            let icar = new BMap.Icon("../images/img_car.png", new BMap.Size(18, 40));
            let locate = new BMap.Point(c.value[0],c.value[1]);
            let marker = new BMap.Marker(locate, {icon:icar});
            marker.setRotation(c.symbolRotate);
            MAP_CACHE.addOverlay(marker);
            let tooltip = {
                master: 'carseat/car',
                carId: c.name.split('/')[0],
                battery: c.name.split('/')[1]
            };
            addHandler(marker, tooltip);
        }
    }

    // 车辆状态交互
    $('#carSeatBar p').bind('click', function(e) {
        ajaxCtrl && ajaxCtrl.abord();
        let parkstate = $("#parks").hasClass('active');
        if (e.target.id == 'parks') {
            if (parkstate) {
               $(this).removeClass('active');
               MAP_CACHE.clearOverlays();
               setCars();
            } else {
               $(this).addClass('active');
               setPark('carseat/park');
               setFun('carseat/park');
            }
        } else {
            $(this).addClass('active').siblings().removeClass('active');
            // parkstate ? $('#parks').addClass('active') : $('#parks').removeClass('active');
            let state = 3;
            switch (e.target.id) {
                case 'forrent':
                    state = 1; break;
                case 'reserve':
                    state = 2; break;
                case 'onserve':
                    state = 3; break;
                case 'stopserve':
                    state = 4; break;
                case 'lowcharge':
                    state = 5; break;
            }
            setCarUI(state);
            // if (parkstate) {
            //     setPark('carseat/park');
            //     setFun('carseat/park');
            // }
        }
    })



    /**
    * 百度地图加载车辆行驶轨迹(echart+百度地图方式)
    */
    function addTrailMap() {
      $('.location').show();
      $('#eMap, #bMap, #top10').remove();
      $('<div id="eMap"></div>').appendTo('.box');
      $('#carSeatBar, #heatparkfun').animate({'right': '-1rem'});
      $('.singleDatePicker').css({'display':'flex'});
      let emap = echarts.init(document.getElementById('eMap'));
      MAP_CACHE = emap;
      buildAjax('get','largeScreen/getCityCenterDataApp',{cityId:exactCity},true,false, function(res) {
          let r = JSON.parse(res.data);
          carTrailOption.bmap.center = r.center;
          emap.setOption(carTrailOption);
          let params = { cityId:exactCity, dateId: $('#appDateTime1').val(), hourId: hourStart+','+hourEnd};
          ajaxCtrl = buildAjax('get', 'largeScreen/getTrajectoryCarData', params, true, false, function(res) {
              TRAIL_CACHE = JSON.parse(res.data);
              carTrailOption.series[0].data = TRAIL_CACHE.chartData;
              carTrailOption.series[1].data = TRAIL_CACHE.chartData;
              emap.setOption(carTrailOption);
          })
      })
    };

    $('#parkfun p').click(function(e) {
        $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
        if (e.target.id == 'park2') {
            carTrailOption.series[2].data = $('#park2').hasClass('active') ? PARK : [];
        } else if (e.target.id == 'fun2') {
            carTrailOption.series[3].data = $('#fun2').hasClass('active') ? FUN : [];
        } else {
            Tip.success('条件选择异常!');
        }
        MAP_CACHE.setOption(carTrailOption);
    })



    /**
     * 百度地图加载热力图
     */
    function addHeatMap() {
        $('.location').show();
        $('#eMap, #bMap, #top10').remove();
        $('<div id="bMap"></div>').appendTo('.box');
        $('#heat').addClass('active').siblings().removeClass('active');
        $('#carSeatBar, #parkfun').animate({'right': '-1rem'});
        $('.singleDatePicker').css({'display':'flex'});
        var bmap = new BMap.Map("bMap");
        drawBMap(bmap);
        MAP_CACHE = bmap;
        var heatMap = new BMapLib.HeatmapOverlay({'radius':8});
        bmap.addOverlay(heatMap);
        let params = { cityId:exactCity, dateId:$('#appDateTime1').val(), hoursStart:hourStart, hoursEnd:hourEnd };
        ajaxCtrl = buildAjax('get', 'largeScreen/getOpenAppData', params, true, false, function(res) {
            R = JSON.parse(res.data);
            // 缓存实体网点
            PARK = R.parKingslist;
            // 缓存放开停网点
            FUN = R.parKingsVirtuallist;
            let points = new Array();
            for (let item of R.list) {
                points.push( {'lng':item[0],'lat':item[1],'count':item[2]} );
            }
            // 缓存heatMap points
            HEAT = points;
            heatMap.setDataSet({data:points});
            // 添加热力图颜色选项,置空则使用默认(默认的好看)
            // heatMap.setOptions();
            heatMap.show();
            $('#heatparkfun').animate({'right': '1%'});
            HEATMAP_CACHE = heatMap;
        })
    }


    // 右侧悬浮选项交互
    $('#heatparkfun p').on('click', function(e) {
        let act = $(this).hasClass('active');
        act ? $(this).removeClass('active') : $(this).addClass('active');
        let parkact = $('#park').hasClass('active');
        let funact = $('#fun').hasClass('active');
        let master = e.target.id;
        if (master == 'park') {
            if (act) {
                MAP_CACHE.clearOverlays();
                setHeat('heatmap');
                funact && setFun('heatmap');
            } else {
                setPark('heatmap');
            }
        } else if (master == 'fun') {
            if (act) {
                MAP_CACHE.clearOverlays();
                setHeat('heatmap');
                parkact && setPark('heatmap');
            } else {
                setFun('heatmap');
            }
        } else if ( master == 'heat') {
            if (act) {
                HEATMAP_CACHE.hide();
                parkact && setPark('heatmap');
                funact && setFun('heatmap');
            } else {
                HEATMAP_CACHE.show();
            }
        }
    });


    /**
     * 百度地图热力图点及城市网点配置
     */
    function setHeat() {
        MAP_CACHE.addOverlay(HEATMAP_CACHE);
        HEATMAP_CACHE.setDataSet({data:HEAT});
    }
    // 实体网点 - 使用海量点无法增加自定义图标
    function setPark(master) {
        let ipark = new BMap.Icon("../images/park.jpg", new BMap.Size(25, 25));
        for (let p of PARK) {
            let locate = new BMap.Point(p.value[0],p.value[1]);
            let addr = p.name;
            let marker = new BMap.Marker(locate, {icon:ipark});
            MAP_CACHE.addOverlay(marker);
            let tooltip = {
                master: master,
                type: '实体网点',
                parkId: p.parkId || '',
                address: p.name || '',
                portNum: p.carportNum || '',
                orderNum: p.orderNum || '',
                portOrder: p.carportAvgorder || ''
            };
            addHandler(marker, tooltip);
        }
    }
    // 放开停网点
    function setFun(master) {
        let ifun = new BMap.Icon("../images/fun_park.jpg", new BMap.Size(25, 25));
        for (let p of FUN) {
            let locate = new BMap.Point(p.value[0],p.value[1]);
            let addr = p.name;
            let marker = new BMap.Marker(locate, {icon:ifun});
            MAP_CACHE.addOverlay(marker);
            let tooltip = {
                master: master,
                type: '虚拟网点',
                parkId: p.parkId || '',
                address: p.name || '',
                portNum: p.carportNum || '',
                orderNum: p.orderNum || '',
                portOrder: p.carportAvgorder || ''
            };
            addHandler(marker, tooltip);
        }
    }


    /**
     * 绘制百度地图信息框
     */
    function addHandler(marker, tip) {
        let content = `<div>` +
                (tip.master == 'heatmap' || tip.master == 'sitelink' || tip.master == 'carseat/park'  ?
                `<p style='font-size:15px;'>类型: ${tip.type}</p>
                <p style='font-size:14px;'>地址: ${tip.address}</p>` : '') +
                (tip.master == 'sitelink' ?
                `<p style='font-size:14px;'>车位数: ${tip.portNum}</p>
                <p style='font-size:14px;'>车位均单: ${tip.portOrder}</p>
                <p style='font-size:14px;'>总订单: ${tip.orderNum}</p>` : '') +
                (tip.master == 'carseat/car' ?
                `<p style='font-size:15px;'>车牌号: ${tip.carId}</p>
                <p style='font-size:14px;'>剩余电量: ${tip.battery}%</p>` : '' ) +
            `</div>`;
        marker.addEventListener("click", function(e) {
            openInfo(content, e)}
        );
    }
    // 打开信息框
    function openInfo(content, e) {
        let p = e.target;
        let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        let infoWindow = new BMap.InfoWindow(content);
        infoWindow.enableCloseOnClick()
        MAP_CACHE.openInfoWindow(infoWindow, point);
    }



    /**
     * 绘制百度地图底图
     */
    function drawBMap(bmap) {
        if (!isSupportCanvas()) {
            Tip.success('您的设备暂不支持查看此功能！');
            return;
        }
        buildAjax('get','largeScreen/getCityCenterDataApp',{cityId:exactCity}, false, false, function(res) {
            let r = JSON.parse(res.data);
            bmap.centerAndZoom( new BMap.Point(r.center[0], r.center[1]), 12);
            bmap.setCurrentCity(CITY);
            bmap.enableScrollWheelZoom(true);
            bmap.enableDragging();
            bmap.disableDoubleClickZoom();
        })
    }


    /**
     * Created: zhangfs by Atom
     * Date: 2018/08/11
     * Func: 加载效果控制
     */
    function showLoading() {
        $('#mask').show();
        $('.loading').show('fast')
    }
    function hideLoading() {
        $('#mask').hide();
        $('.loading').hide('fast');
    }
});
