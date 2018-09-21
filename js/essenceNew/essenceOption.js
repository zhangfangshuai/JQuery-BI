/**
 * 列表数据栏配置规范
 **/
var dashBoardBuilder = [
    { id: 1, name: '可运营车辆数', inter: 'operacar_nun' },
    { id: 2, name: '网点数', inter: 'park_num' },
    { id: 3, name: '车位数', inter: 'parkplace_num' },
    { id: 4, name: '总收现金额', inter: 'payamount' },
    { id: 5, name: '车均收现', inter: 'car_avgpayamount' },
    { id: 6, name: '单均收现', inter: 'order_avgpayamount' },
    { id: 9, name: '车均里程', inter: 'car_avgMileage' },
    { id: 8, name: '单均里程', inter: 'order_avgMileage' },
    { id: 10, name: '车均时长', inter: 'car_avgMinute' },
    { id: 11, name: '单均时长', inter: 'order_avgMinute' },
    { id: 12, name: '取车单', inter: 'exec_order_num' },
    // { id: 13, name: '还车单', inter: 'endorder_num' },
    // { id: 14, name: '人均订单', inter: 'user_avgorder' },
    { id: 15, name: '订单用户数', inter: 'order_user' },
    { id: 16, name: '首单用户数', inter: 'firstuser_num' },
    { id: 17, name: '老用户数', inter: 'olduser_num' }
];
// 实时收现数据栏构建
var realCashNoteBuilder = [
    { seg: 'sumData0', name: '今日总收入' },
    { seg: 'sumData1', name: '今日总收现' },
    { seg: 'sumData2', name: '今日总优惠' },
    { seg: 'sumData3', name: '今日总未结算' },
    { seg: 'sumData4', name: '单均收入' },
    { seg: 'sumData5', name: '单均收现' },
    // { seg: 'sumData6', name: '单均优惠' },
    // { seg: 'sumData7', name: '单均优惠' }
];
// 车辆现况数据栏构建
var realCarAllBuilder = [
    { seg: 'sumData0', name: '后台车辆' },
    { seg: 'sumData1', name: '上架车辆' },
    { seg: 'sumData2', name: '实时上架率' },
    { seg: 'sumData3', name: '运维下架' },
    { seg: 'sumData16', name: '其他车辆' },
    { seg: 'sumData17', name: '可运营车辆' }
];
var realCarOnBuilder = [
    { seg: 'sumData6', name: '待租' },
    { seg: 'sumData7', name: '已预订' },
    { seg: 'sumData8', name: '服务中-未取车' },
    { seg: 'sumData9', name: '服务中-已取车' }
];
var realCarOffBuilder = [
    { seg: 'sumData10', name: '运维中' },
    { seg: 'sumData11', name: '充电中' },
    { seg: 'sumData13', name: '物料缺失' },
    { seg: 'sumData14', name: '车机离线' },
    { seg: 'sumData4', name: '低续航' },
    { seg: 'sumData15', name: '其他原因' },
    { seg: 'sumData12', name: '维修中' },
    { seg: 'sumData19', name: '事故出险' },
];
var realCarOtherBuilder = [
    { seg: 'sumData18', name: '整备中' },
    { seg: 'sumData5', name: '停止运营' }
];
// 车辆实时电量数据栏构建
var realPowerNoteBuilder = [
    { seg: 'sumData0', name: '待租65%以下车辆' },
    { seg: 'sumData1', name: '下架65%以下车辆' }
];
// 实时订单数据栏构建
var realOrderNoteBuilder = [
    { seg: 'sumData0', name: '今日下单量' },
    { seg: 'sumData1', name: '今日取车单' },
    { seg: 'sumData2', name: '今日取消单' },
    { seg: 'sumData3', name: '车均单' },
    { seg: 'sumData4', name: '单均里程' },
    { seg: 'sumData5', name: '单均时长' }
];
// 实时新增用户数据栏构建
var realNewUserNoteBuilder = [
    { seg: 'sumData0', name: '今日注册数' },
    { seg: 'sumData1', name: '今日新增双证' },
    { seg: 'sumData2', name: '今日押金用户' },
    { seg: 'sumData3', name: '今日下单用户' },
    { seg: 'sumData4', name: '今日首单用户' }
];
// Kpi考核指标构建
var nationKpiBuilder = [
    { seg: 'kpi_currentt', name: '[新电车]车均收现', nuit: '元' },
    { seg: 'kpi_currentu', name: '[老电车]车均收现', nuit: '元' },
    { seg: 'kpi_currents', name: '[燃油车]车均收现', nuit: '元' },
    { seg: 'kpi_currentm', name: '违法处理率', nuit: '%' },
    { seg: 'kpi_currento', name: '[新电车]车均上架时长', nuit: 'h' },
    { seg: 'kpi_currentp', name: '[老电车]车均上架时长', nuit: 'h' },
    { seg: 'kpi_currentn', name: '[燃油车]车均上架时长', nuit: 'h' }
];
var cityKpiBuilder = [
    { seg: 'kpi_currentt', name: '[新电车]车均收现', nuit: '元' },
    { seg: 'kpi_currentu', name: '[新电车]车均收现', nuit: '元' },
    { seg: 'kpi_currents', name: '[新电车]车均收现', nuit: '元' },
    { seg: 'kpi_currentt', name: '[新电车]车均收现', nuit: '元' },
    { seg: 'kpi_currentt', name: '[新电车]车均收现', nuit: '元' },
    { seg: 'kpi_currentt', name: '[新电车]车均收现', nuit: '元' },
];


/**
 * echarts公用样式配置
 **/
var lineWidth = 3;
var legendItemWidth = 13;
var legendItemHeight = 5;
var colors = ['#6034FF','#21D0EB','#FF8A34','#14DB4D','#00B74D','#FFAE29','#f1d591','#ff7b44','#beef5f'];
var fontSize = 10;

// 实时营收折现图
var realCashOption = {
    color: colors,
    textStyle: { color:'#647888', fontSize:fontSize },
    tooltip: { trigger: 'axis', textStyle: { fontSize: fontSize, fontWeight: 'bold' } },
    grid: { left:'3%', right:'5%', top:'15%', bottom:'8%', containLabel: true  },
    legend: { left: 'center', top: '1%', itemGap: 10,
        textStyle: { fontSize: fontSize },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        data: [
          { name: '收入', icon: 'rect' },
          { name: '收现', icon: 'rect' },
          { name: '优惠', icon: 'rect' },
          { name: '未结算', icon: 'rect' }
        ]
    },
    xAxis: { type: 'category', axisLabel:{fontSize:fontSize, rotate: 90}, data: [] },
    yAxis: { type: 'value', axisLabel: { fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v) }}},
    series: [
        { name:'收入', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'收现', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'优惠', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'未结算', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
    ]
};

// 实时车辆全部
var realCarOption = {
    color: colors,
    textStyle: { color:'#647888', fontSize:fontSize },
    tooltip: {
        trigger: 'axis',
        textStyle: { fontSize: fontSize },
        formatter: function(p) {
            let sum = realCarOption.series[0].support;
            let on = 0;
            for (let x of p) {
                if (x.seriesName == '上架') {
                    on = parseInt(x.value);
                }
                break;
            }
            let ret = new Array();
            let rate = `上架率: ${(on*100 / sum).toFixed(2)}%<br/>`;
            ret.push(rate);
            for (let x of p) {
                let m = `${x.marker}${x.seriesName}: ${x.value}<br/>`;
                ret.push(m);
            }
            return (p[0].name + ret.join(''));
        }
    },
    grid: { left:'3%', right:'5%', top:'15%', bottom:'8%', containLabel: true  },
    legend: { left: 'center', top: '1%', itemGap: 10,
        textStyle: { fontSize: fontSize },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        data:[
            { name:'上架', icon: 'rect' },
            { name:'下架', icon: 'rect' },
            { name:'其他车辆', icon: 'rect' }
        ]
    },
    xAxis: { type:'category', axisLabel: {fontSize:fontSize, rotate: 90}, data:[] },
    yAxis: [{ type:'value', axisLabel: {fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v) }}}],
    series: [
        { name:'上架', type:'line', stack: 'all', areaStyle: {normal: {opacity:1}}, data:[], support: 1, },
        { name:'下架', type:'line', stack: 'all', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'其他车辆', type:'line', stack: 'all', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
};
// 实时车辆上架
var optionOn = {
    color: colors,
    textStyle: { color: '#647888', fontSize: fontSize },
    tooltip : { trigger: 'axis', textStyle: { fontSize: fontSize } },
    grid: { left:'3%', right:'5%', top:'15%', bottom:'8%', containLabel: true  },
    legend: { left: 'center', top: '1%',
        textStyle: { fontSize: fontSize },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        data: [
            { name:'待租', icon: 'rect' },
            { name:'已预订', icon: 'rect' },
            { name:'服务中-未取车', icon: 'rect' },
            { name:'服务中-已取车', icon: 'rect' }
        ]
    },
    xAxis: { type:'category', axisLabel: {fontSize:fontSize, rotate: 90}, data:[] },
    yAxis: [{ type:'value', axisLabel: { fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v) }} }],
    series: [
        { name:'待租', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'已预订', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'服务中-未取车', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'服务中-已取车', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
};
// 实时车辆下架
var optionDown = {
    color: colors,
    textStyle: { color:'#647888', fontSize: fontSize },
    tooltip: { trigger: 'axis', textStyle: { fontSize: fontSize } },
    grid: { left:'3%', right:'5%', top:'30%', bottom:'8%', containLabel: true },
    legend: [{
        left: 'center',
        top: '1%',
        textStyle: { fontSize: fontSize },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        data:[
            { name:'运维中', icon: 'rect' },
            { name:'充电中', icon: 'rect' },
            { name:'低续航', icon: 'rect' },
            { name:'车机离线', icon: 'rect' }
        ]
    }, {
        left: 'center',
        top: '7%',
        textStyle: { fontSize: fontSize },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        data:[
            { name:'物料缺失', icon: 'rect' },
            { name:'其他原因', icon: 'rect' },
            { name:'维修中', icon: 'rect' },
            { name:'事故出险', icon: 'rect' }
        ]
    }],
    xAxis: { type:'category', axisLabel: {fontSize:fontSize, rotate: 90}, data:[] },
    yAxis: [{ type:'value', axisLabel: {fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v) }} }],
    series: [
        { name:'运维中', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'充电中', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'低续航', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'车机离线', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'物料缺失', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'其他原因', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'维修中', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'事故出险', type:'line', stack: 'down', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
};
// 实时车辆下架其他
var optionOther = {
    color: colors,
    textStyle:{ color:'#647888', fontSize:fontSize },
    tooltip : { trigger: 'axis', textStyle: { fontSize:fontSize } },
    grid: { left:'3%', right:'5%', top:'15%', bottom:'15%', containLabel: true  },
    legend: { left: 'center', top: '1%',
        textStyle: { fontSize: fontSize },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        data: [
            { name: '整备中', icon: 'circle' },
            { name: '充电中', icon: 'circle' }
        ]
    },
    xAxis: { type:'category', axisLabel: {fontSize:fontSize, rotate: 90}, data:[] },
    yAxis: [{ type:'value', axisLabel: {fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v)}} }],
    series: [
        { name:'整备中', type:'line', stack: 'other', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'充电中', type:'line', stack: 'other', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
}

// 实时车辆电量
var realPowerOption = {
    color: colors,
    tooltip: { trigger: 'axis', textStyle : { fontSize: fontSize, } },
    grid: { left: '3%', right: '5%', top: '22%', bottom: '8%', containLabel: true },
    legend: [{
        textStyle: { fontSize: fontSize, color:'#647888' },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        left:'center',
        top: '1%',
        itemGap: 10,
        data: ['100%-80%','80%-60%','60%-40%']
    },  {
        textStyle: { fontSize: fontSize, color:'#647888' },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        left:'center',
        top: '7%',
        itemGap: 15,
        data: ['40%-20%','20%-0%']
    }],
    xAxis: { type:'category', axisLabel: {fontSize:fontSize, rotate: 90}, data:[] },
    yAxis: [{ type:'value', axisLabel: {fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v)}} }],
    series: [
        { name:'100%-80%', type:'bar', stack:'all', label:{ normal:{ show:false, position:'insideRight'} }, data: [] },
        { name:'80%-60%', type:'bar', stack:'all', label:{ normal:{ show:false, position:'insideRight'} }, data: [] },
        { name:'60%-40%', type:'bar', stack:'all', label:{ normal:{ show:false, position:'insideRight'} }, data: [] },
        { name:'40%-20%', type:'bar', stack:'all', label:{ normal:{ show:false, position:'insideRight'} }, data: [] },
        { name:'20%-0%', type:'bar', stack:'all', label:{ normal:{ show:false, position:'insideRight'} }, data: [] },
    ]
}

// 实时订单
var realOrderOption = {
    color: colors,
    lineStyle: { width:20, color:'red' },
    textStyle: { color:'#647888', fontSize:fontSize },
    tooltip: { trigger: 'axis', textStyle: { fontSize: fontSize } },
    grid: { left:'3%', right:'5%', top:'15%', bottom:'8%', containLabel: true },
    legend: { left: 'center', top: '1%',
        textStyle: { fontSize: fontSize, color:'#647888' },
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        data:[
            { name:'下单量', icon: 'rect' },
            { name:'取车量', icon: 'rect' },
            { name:'取消订单', icon: 'rect' }
        ]
    },
    xAxis: { type: 'category', axisLabel:{fontSize:fontSize, rotate: 90}, data: [] },
    yAxis: { type: 'value', axisLabel: {fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v) }}},
    series: [
        { name:'下单量', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'取车量', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'取消订单', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] }
    ]
}

// 实时新增用户
var realNewUserOption = {
    color: colors,
    textStyle: { color:'#647888', fontSize:fontSize },
    tooltip: { trigger: 'axis', textStyle: { fontSize: fontSize } },
    grid: { left:'3%', right:'5%', top:'20%', bottom:'8%', containLabel: true },
    legend: [{ left: 'center', top: '1%',
        textStyle: { fontSize: fontSize},
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        itemGap: 15,
        data:[
            { name:'新增注册', icon: 'rect' },
            { name:'新增双证', icon: 'rect' },
            { name:'新增押金', icon: 'rect' }
        ]
    }, {
        left: 'center', top: '7%',
        textStyle: { fontSize: fontSize},
        itemWidth: legendItemWidth,
        itemHeight: legendItemHeight,
        itemGap: 15,
        data:[
            { name:'下单用户', icon: 'rect' },
            { name:'新增首单用户', icon: 'rect' }
        ]
    }],
    xAxis: { type: 'category', axisLabel:{fontSize:fontSize, rotate: 90}, data: [] },
    yAxis: { type: 'value', axisLabel: {fontSize:fontSize, formatter: function(v) { return (v >= 1000 ? (v/1000 + 'k') : v) }}},
    series: [
        { name:'新增注册', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'新增双证', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'新增押金', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'下单用户', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'新增首单用户', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] }
    ]
};

// 资产状况
var assetsOption = {
    color: ['#6034FF', '#14DB4D'],
    textStyle: { fontSize: fontSize },
    series: [{
        type: 'pie',
        radius: ['100%', '55%'],
        silent: true,
        label: { normal: { show: false } },
        labelLine: { normal: { show: false } },
        data: [
            { value:0, name:''},
            { value:1, name:''}
        ]
    }]
}
// 资产状况-车辆
var assetsCarOption = {
    color: ['#14DB4D','#6034FF','#818B94'],
    grid: {width: '100%', height:'100%'},
    polar: {},
    angleAxis: {
        axisLabel: {show: false},
        axisTick: {show: false},
        axisLine: {show: false},
        // max: function(v) {
        //     return v.max
        // }
    },
    radiusAxis: {
        type: 'category',
        data: [],
        z: 10
    },
    series: [{
        name: '总购置车',
        type: 'bar',
        coordinateSystem: 'polar',
        data: []
    }, {
        name: '运营车量',
        type: 'bar',
        coordinateSystem: 'polar',
        data: []
    }, {
        name: '后台车辆',
        type: 'bar',
        coordinateSystem: 'polar',
        data: []
    }]
}

// 完成度仪表盘
var gaugeOption = {
    tooltip: { show: false },
    series: {
        name: '业务指标',
        type: 'gauge',
        radius: '90%',
        axisLine: {
          lineStyle: { width: 18 }
        },
        axisLabel: { fontSize: 8 },
        splitLine: { length: 12 },
        pointer: { length: '70%', width: 3 },
        detail: { formatter:'{value}%', fontSize: 11 },
        data: [{value: 0}]
    }
};

// 周对比视图折线图
var weekLineOption = {
    title: { text:'', left:'3%', textStyle: {fontSize: 14, color: '#6034FF'} },
    color: [],
    tooltip: { trigger: 'axis', axisPointer: {type:'line'}, textStyle: {fontSize:fontSize} },
    textStyle: { color:'#647888', fontSize: fontSize },
    grid: { top:'20%', left: '3%', right: '5%', bottom: '10%', containLabel:true },
    legend: {
        top:'1%',
        itemGap: 20,
        data:['本周', '上周']
    },
    xAxis: {
        type: 'category',
        axisLabel: { fontSize: fontSize },
        data: [ '周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value',
        axisLabel: {fontSize:fontSize, formatter: function(v) {
            let format = v < 1000 ? v :
                         v < 10000 ?  (v/1000 + 'k') : (v/10000 + 'w');
            return format;
        }},
        min: function(v) {
            var vmin = v.min < 300 ? parseInt((v.min - 10)/10) * 10 :
                   v.min < 5000 ? parseInt((v.min - 100)/100) * 100  :
                   v.min < 10000 ? parseInt((v.min - 1000)/1000) * 1000 :
                   v.min < 50000 ? parseInt((v.min - 5000)/1000) * 1000 :
                   v.min < 100000 ? parseInt((v.min - 10000)/10000) * 10000 :
                   v.min < 500000 ? parseInt((v.min - 50000)/10000) * 10000 : parseInt((v.min - 100000)/100000) * 100000;
            return vmin;
        },
    },
    series: [
        { name:'本周', type:'line', smooth:true, lineStyle:{ normal:{ width:lineWidth } }, data:[] },
        { name:'上周', type:'line', smooth:true, lineStyle:{ normal:{ width:lineWidth } }, data:[] }
    ]
};

// 周对比视图柱状图
var weekBarOption = {
    title: { text:'', left:'3%', textStyle: {fontSize: 14, color: '#6034FF'} },
    color: [],
    tooltip: { trigger: 'axis', axisPointer: {type:'shadow'}, textStyle: {fontSize:fontSize} },
    textStyle: { color:'#647888', fontSize:fontSize },
    grid: { top:'20%', left:'3%', right:'5%', bottom:'10%', containLabel:true },
    legend: {
        top: '1%',
        itemGap: 20,
        data:['本周', '上周']
    },
    xAxis: {
        type: 'category',
        axisLabel: { fontSize: fontSize },
        data: [ '周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type:'value',
        axisLabel: { fontSize:fontSize, formatter: function(v) {
            let format = v < 1000 ? v :
                         v < 10000 ?  (v/1000 + 'k') : (v/10000 + 'w');
            return format;
        }},
    },
    series: [
        { name:'本周', type:'bar', barWidth:'30%', barGap:'25%', data:[],
            // markLine: { lineStyle: { normal:{type:'dashed'} }, data: [{type: 'average', name: '平均值'}] }
        },
        { name:'上周', type:'bar', barWidth:'30%', barGap:'25%', data:[],
            // markPoint: { symbolSize: 80, data: [ {type: 'max', name: '最大值'}, {type: 'min', name: '最小值'} ] },
            // markLine: { lineStyle: { normal:{type:'dashed'} }, data: [{type: 'average', name: '平均值'}] }
        }
    ]
};

// 用户转化漏斗图
var funnelOption = {
      color:['#6034FF','#7E85FF','#21D0EB','#31F5CB','#C4FFD5'],
      textStyle:{ fontSize:fontSize },
      tooltip: {
          trigger: 'item',
          textStyle : { fontSize: fontSize },
          formatter: function (params) {
              var series = funnelOption.series[0].data;
              var pec = (params.data.value / series[series.length - 1].value * 100).toFixed(2);
              let pec_pre = params.dataIndex == (series.length - 1) ? 100 : (params.data.value / series[params.dataIndex + 1].value * 100).toFixed(2);
              return params.seriesName + '<br/>' +
                      params.data.name + ': ' +  params.data.value + '<br/>' +
                      '占注册用户比: ' + pec + '% <br/>' +
                      '占下层比: ' + pec_pre + '%';
          }
      },
      series: [
        {
            name:'用户转化',
            type:'funnel',
            top: '3%',
            left: '10%',
            width: '80%',
            height: '90%',
            // height: {totalHeight} - y - y2,
            // max: 100,  // 数值大于max宽度显示为100%
            sort: 'ascending',
            funnelAlign: 'left',
            minSize: '40%',
            maxSize: '100%',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    fontSize: fontSize + 1,
                    fontWeight: 'bold',
                    align: 'left',
                    formatter: function(param){
                        var series = funnelOption.series[0].data;
                        var key = param.dataIndex == 0 ? param.name : param.name.slice(0, param.name.length-2);
                        if (param.dataIndex == param.name.length) {
                            return param.name + ": " + (param.value ? param.value : '-') + "人";
                        } else if (param.dataIndex < funnelOption.series[0].data.length) {
                            // var perc = (series[param.dataIndex].value / series[param.dataIndex + 1].value * 100).toFixed(2);
                            var perc = (series[param.dataIndex].value / series[series.length - 1].value * 100).toFixed(2);
                            return key +": " + (perc ? perc : '-') + '%';
                        }
                    }
                },
                emphasis: {
                    textStyle: { fontSize:fontSize + 1, color:'#f94343' }
                }
            },
            data: []
        }
    ]
};
