/**
 * Author: zhangfs 2018/4/10 16:27
 * Note: Standard code and Add error handler
 */
$(function () {
    var CS_CACHE, DC_CACHE, WOD_CACHE, WONUM_CACHE;
    var cityVal = 1, cspage = 1, dcpage = 1, wodpage = 1, woapage = 1;
    var yesterday = getDaysOffset(-1),
        weekAgo = getDaysOffset(-7);

    for (let i of [1,2,3,4,5,6,7,8,9,10]) {
        $('#appDateTime' + i).mobiscroll(APP.dateBar);
    }
    for (let i of [1,3,5,7,9]) {
        $('#appDateTime' + i).val(weekAgo);
    }
    for (let i of [2,4,6,8,10]) {
        $('#appDateTime' + i).val(yesterday);
    }

    // 页面初始化
     getCity(function(res, cityInit){
         cityVal = cityInit;
         getCustServerDetail();
         getDoubleCardDetail();
         workOrderType();
         workOrderDetail();
         workOrderAmount();
         getPrincipal(cityVal, [50,52]);
     }, false);

    // 城市改变 及其刷新数据
    $('#demo3').bind('input propertychange', function() {
        if ($('#value3').val()=='') return;
        localStorage.sessionCity = JSON.stringify({ 'text':$('#demo3').val(), 'value':$('#value3').val() });
        cityVal=$('#value3').val();
        cspage = dcpage = 1;
        $('.phoneBubble').hide('fast');
        cityVal == '1' && $('.responsiblePerson-box').hide('fast');
        getCustServerDetail();
        getDoubleCardDetail();
        workOrderType();
        workOrderDetail();
        workOrderAmount();
        getPrincipal(cityVal, [50,52]);
    });

    // 责任人弹窗控制
    $('.responsiblePerson').on('click', function() {
        triggerBubble(this.parentNode);
    });


    /**
     * 客服概况
     */
    function getCustServerDetail() {
        let params = {
            cityId: cityVal,
            startDate: $('#appDateTime1').val(),
            endDate: $('#appDateTime2').val()
        };
        buildAjax('get', 'getCustServerDetail', params, true, false, function(res){
            CS_CACHE = res.data.data;
            if (CS_CACHE.length) {
                cspage = resetPaging('cs-nowpage');
                $('.cs-allpage').html(Math.ceil(CS_CACHE.length / 10) == 0 ? 1 : Math.ceil(CS_CACHE.length / 10));
                setCSUI(CS_CACHE.slice(0, 10));
            } else {
                setCSUI([]);
            }
        }, false)
    };
    let refCSUI = (p) => {
        CS_CACHE ? setCSUI(CS_CACHE.slice( 10 * ( p - 1 ), 10 * p)) : getCustServerDetail();
    };
    let setCSUI = (data) => {
        let fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.total_num + "</p>" +
                "<p>" + d.ivr_num + "</p>" +
                "<p>" + d.topeople_num + "</p>" +
                "<p>" + d.success_num + "</p>" +
                "<p>" + d.success_rate + "%</p>" +
                "<p>" + d.phone_num + "</p>" +
                "<p>" + d.phonesucc_num + "</p>" +
                "<p>" + d.phonesucc_rate + "%</p>" +
                "<p>" + d.cpo + "%</p>" +
                "<p>" + d.agent_eff + "</p>" +
                "<p>" + d.first_rate + "%</p></li>";
        }
        $('.cs-fv').html(fv);
        $('.cs-sv').html(sv);
    }

    // 客服概况 logic
    $('#appDateTime1, #appDateTime2').on('change',function () {
        isDateValid(1,2) && getCustServerDetail();
    });
    $('.cs-prepage, .cs-nextpage').on('click',function() {
        if (this.classList[1] == 'cs-prepage') {
            cspage > 1 ? (() => {
                cspage --;
                refCSUI(cspage);
                $('.cs-nowpage').html(cspage);
            })() : console.log('Top page!');
        } else {
           cspage < parseInt($('.cs-allpage').html()) ? (() => {
               cspage ++;
               refCSUI(cspage);
               $('.cs-nowpage').html(cspage);
           })() : console.log('Last page!');
        }
    });


    /**
     * 双证审核
     */
    function getDoubleCardDetail() {
        let param = {
            cityId: cityVal,
            startDate: $('#appDateTime3').val(),
            endDate: $('#appDateTime4').val()
        }
        buildAjax('get', 'getDoubleCardDetail', param, true, false, function(res){
            DC_CACHE = res.data.data;
            if (DC_CACHE.length) {
                dcpage = resetPaging('dc-nowpage');
                $('.dc-allpage').html(Math.ceil(DC_CACHE.length / 10) == 0 ? 1 : Math.ceil(DC_CACHE.length / 10));
                setDcUI(DC_CACHE.slice(0, 10));
            } else {
                setDcUI([]);
            }
        }, false);
    };
    let refDcUI = (p) => {
        DC_CACHE ? setDcUI( DC_CACHE.slice( 10 * ( p - 1 ), 10 * p) ) : getDoubleCardDetail()
    };
    let setDcUI = (data) => {
        var fv = '', sv = '';
        for (let d of data) {
            fv += "<li>" + dateFormat(d.date_id) + "</li>";
            sv += "<li><p>" + d.user_card_num + "</p>" +
                "<p>" + d.car_card_num + "</p>" +
                "<p>" + d.double_card_num + "</p>" +
                "<p>" + d.user_card_rate + "%</p>" +
                "<p>" + d.car_card_rate + "%</p>" +
                "<p>" + d.double_card_rate + "%</p> </li>";
        }
        $('.dc-fv').html(fv);
        $('.dc-sv').html(sv);
    }
    // 双证审核详情 logic
    $('.dc-prepage, .dc-nextpage').on('click',function() {
        dcpage = pagingCtrl(this, dcpage, refDcUI);
    });
    $('#appDateTime3, #appDateTime4').on('change',function () {
        isDateValid(3,4) && getDoubleCardDetail();
    });


    /**
     * 工单类型占比分析
     */
     var workorderChart = echarts.init(document.getElementById('workorderChart'));
     workorderChart.showLoading({ effect:'ring' });

    function workOrderType() {
        let param = {
            startDate: $('#appDateTime5').val(),
            endDate: $('#appDateTime6').val()
        }
        buildAjax('get', 'getWorkOrderType', param, true, false, function(res){
            try {
                let sum = 0, tree = [];
                for (let d of res.data.series) {
                    sum += d.value;
                }
                for (let d of res.data.series) {
                    let branch = {
                          name: d.name,
                          value: d.value,
                          children: [{
                              name: d.name,
                              value: d.value
                          }]
                        }
                    tree.push(branch);
                }
                // treeOption.series[1].data[0].value = sum;
                TREEMAP_CACHE = sum;
                treeOption.series[0].data = tree;
                workorderChart.setOption(treeOption);
            } catch (e) {
                Tip.success('当月无用户占比数据');
                console.log(e);
            }
            workorderChart.hideLoading();
        }, false);
    }
    // 工单类型占比分析 时间监控
    $('#appDateTime5, #appDateTime6').on('change',function () {
        isDateValid(5,6) && workOrderType();
    });


    /**
     * 工单类型详情
     */
     function workOrderDetail() {
          let param = {
              startDate: $('#appDateTime7').val(),
              endDate: $('#appDateTime8').val()
          };
          buildAjax('get', 'getWorkOrderdetails', param, true, false, function(res){
              WOD_CACHE = res.data;
              if (WOD_CACHE.length) {
                  wodpage = resetPaging('woDetail-nowpage');
                  $('.woDetail-allpage').html(Math.ceil(WOD_CACHE.length / 10) == 0 ? 1 : Math.ceil(WOD_CACHE.length / 10));
                  setWodUI(WOD_CACHE.slice(0, 10));
              } else {
                  setWodUI([]);
              }
          }, false);
     }
     let refWodUI = (p) => {
          WOD_CACHE ? setWodUI(WOD_CACHE.slice(10*(p-1), 10*p)) : workOrderDetail();
     }
     let setWodUI = (data) => {
         var fv = '', sv = '';
         for (let d of data) {
             fv += "<li>" + dateFormat(d.date_id) + "</li>";
             sv += "<li><p>" + d.cl + "%</p>" +
                 "<p>" + d.dd + "%</p>" +
                 "<p>" + d.wd + "%</p>" +
                 "<p>" + d.zc + "%</p> </li>";
         }
         $('.wod-fv').html(fv);
         $('.wod-sv').html(sv);
     }
     // 双证审核详情 logic
     $('.woDetail-prepage, .woDetail-nextpage').on('click',function() {
         wodpage = pagingCtrl(this, wodpage, refWodUI);
     });
     $('#appDateTime7, #appDateTime8').on('change',function () {
         isDateValid(7,8) && workOrderDetail();
     });


     /**
      * 工单量统计
      */
      function workOrderAmount() {
           let param = {
               startDate: $('#appDateTime9').val(),
               endDate: $('#appDateTime10').val()
           };
           buildAjax('get', 'getWorkOrderAmount', param, true, false, function(res){
               WONUM_CACHE = res.data;
               if (WONUM_CACHE.length) {
                   woapage = resetPaging('woAmount-nowpage');
                   $('.woAmount-allpage').html(Math.ceil(WONUM_CACHE.length / 10) == 0 ? 1 : Math.ceil(WONUM_CACHE.length / 10));
                   setWoaUI(WONUM_CACHE.slice(0, 10));
               } else {
                   setWoaUI([]);
               }
           }, false);
      }
      let refWoaUI = (p) => {
           WONUM_CACHE ? setWoaUI(WONUM_CACHE.slice(10*(p-1), 10*p)) : workOrderAmount();
      }
      let setWoaUI = (data) => {
          var fv = '', sv = '';
          for (let d of data) {
              fv += "<li>" + dateFormat(d.date_id) + "</li>";
              sv += "<li><p>" + d.total_num + "</p>" +
                  "<p>" + d.ing_num + "</p>" +
                  "<p>" + d.succ_num + "</p>" +
                  "<p>" + d.succ_rate + "%</p> </li>";
          }
          $('.woa-fv').html(fv);
          $('.woa-sv').html(sv);
      }
      // 双证审核详情 logic
      $('.woAmount-prepage, .woAmount-nextpage').on('click',function() {
          woapage = pagingCtrl(this, woapage, refWoaUI);
      });
      $('#appDateTime9, #appDateTime10').on('change',function () {
          isDateValid(9,10) && workOrderAmount();
      });
});
