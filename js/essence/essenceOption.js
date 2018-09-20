// dashboard data config
var dashBoardBuild = [
    { id: 1, name: '可运营车辆数', inter: 'operacar_nun' },
    { id: 2, name: '网点数', inter: 'park_num' },
    { id: 3, name: '车位数', inter: 'parkplace_num' },
    { id: 4, name: '总收现金额', inter: 'payamount' },
    { id: 5, name: '车均收现', inter: 'car_avgpayamount' },
    { id: 6, name: '单均收现', inter: 'order_avgpayamount' },
    { id: 7, name: '还车单', inter: 'endorder_num' },
    { id: 8, name: '单均里程', inter: 'order_avgMileage' },
    { id: 9, name: '车均里程', inter: 'car_avgMileage' },
    { id: 10, name: '单均时长', inter: 'order_avgMinute' },
    { id: 11, name: '车均时长', inter: 'car_avgMinute' },
    { id: 12, name: '人均订单', inter: 'user_avgorder' },
    { id: 13, name: '订单用户数', inter: 'order_user' },
    { id: 14, name: '首单用户数', inter: 'firstuser_num' },
    { id: 15, name: '老用户数', inter: 'olduser_num' }
];

// 实时收现数据栏构建
var realCashNoteBuilder = [
    { seg: 'sumData0', name: '今日总收入' },
    { seg: 'sumData1', name: '今日总收现' },
    { seg: 'sumData2', name: '今日总优惠' },
    { seg: 'sumData3', name: '今日总未结算' },
    { seg: 'sumData4', name: '单均收入' },
    { seg: 'sumData5', name: '单均收现' },
    { seg: 'sumData6', name: '单均优惠' },
    { seg: 'sumData7', name: '单均优惠' }
]

// 折现粗细
var lineWidth = 8;
// 实时营收折现图
var realCashOption = {
    color: ['#6034FF','#14DB4D','#FF8A34','#21D0EB','#00B74D','#FFAE29'],
    textStyle: { color:'#647888', fontSize:27 },
    tooltip: { trigger: 'axis', textStyle: { fontSize: 24, fontWeight: 'bold' } },
    grid: { left:'12%', right:'4%', top:'5%', bottom:'18%' },
    legend: {
        left: 'center',
        bottom: '1%',
        itemGap: 100,
        data: [
          { name: '收入', icon: 'circle' },
          { name: '收现', icon: 'circle' },
          { name: '优惠', icon: 'circle' },
          { name: '未结算', icon: 'circle' }
        ]
    },
    yAxis: { type: 'value', axisLabel: { 'fontSize':24 } },
    xAxis: { type: 'category', axisLabel:{'fontSize':24}, data: [] },
    series: [
        { name:'收入', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'收现', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'优惠', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'未结算', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
    ]
};

// 实时车辆全部
var realCarOption = {
    color: ['#09CA65','#00F977','#D0DFEE','#FFC32B','#00B74D','#FFAE29'],
    textStyle: { color:'#647888', fontSize:30 },
    tooltip: { trigger: 'axis', textStyle : { fontSize: 24 } },
    grid: { left:"10%", right: '3%', top: "5%", bottom:"18%" },
    legend: {
        left: 'center',
        bottom: '1%',
        itemGap: 100,
        data:[
            { name:'上架', icon: 'circle' },
            { name:'下架', icon: 'circle' },
            { name:'其他车辆', icon: 'circle' }
        ]
    },
    xAxis: { type:'category', axisLabel: {'fontSize':24}, data:[] },
    yAxis: [{ type:'value', axisLabel: {'fontSize':24} }],
    series: [
        { name:'上架', type:'line', stack: 'all', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'下架', type:'line', stack: 'all', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'其他车辆', type:'line', stack: 'all', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
};

// 实时车辆上架
var optionOn = {
    color: ['#09CA65','#00F977','#D0DFEE','#FFC32B','#00B74D','#FFAE29'],
    textStyle: { color: '#647888', fontSize: 30 },
    tooltip : { trigger: 'axis', textStyle: { fontSize: 24 } },
    grid: { left:"10%", right: '3%', top: "5%", bottom:"18%" },
    legend: {
        left: 'center',
        bottom: '1%',
        data: [
            { name:'待租', icon: 'circle' },
            { name:'已预订', icon: 'circle' },
            { name:'服务中-未取车', icon: 'circle' },
            { name:'服务中-已取车', icon: 'circle' }
        ]
    },
    xAxis: { type : 'category', axisLabel:{'fontSize':24}, data: [] },
    yAxis: { type : 'value', axisLabel:{'fontSize':24} },
    series: [
        { name:'待租', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'已预订', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'服务中-未取车', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'服务中-已取车', type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
};

// 实时车辆下架
var optionDown = {
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44','#ffda44','#beef5f'],
    textStyle: { color:'#647888', fontSize: 24 },
    tooltip: { trigger: 'axis', textStyle: { fontSize: 24 } },
    grid: { left:"10%", right: '3%', top: "5%", bottom:"30%" },
    legend: {
        left: 'center',
        bottom: '1%',
        data:[
            { name:'运维中', icon: 'circle' },
            { name:'充电中', icon: 'circle' },
            { name:'低续航', icon: 'circle' },
            { name:'车机离线', icon: 'circle' },
            { name:'物料缺失', icon: 'circle' },
            { name:'其他原因', icon: 'circle' },
            { name:'维修中', icon: 'circle' },
            { name:'事故出险', icon: 'circle' }
        ]
    },
    xAxis: { type: 'category', axisLabel: { 'fontSize': 24 }, data: [] },
    yAxis: { type: 'value', axisLabel: { 'fontSize': 24 } },
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
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
    textStyle:{ color:'#647888', fontSize:30 },
    tooltip : { trigger: 'axis', textStyle: { fontSize: 24 } },
    grid: { left:"10%", right: '3%', top: "5%", bottom:"18%" },
    legend: {
        left: 'center',
        bottom: '1%',
        data: [
            { name: '整备中', icon: 'circle' },
            { name: '充电中', icon: 'circle' }
        ]
    },
    xAxis: { type : 'category', axisLabel: { 'fontSize': 24 }, data : [] },
    yAxis: { type : 'value', axisLabel: { 'fontSize': 24 } },
    series: [
        { name:'整备中', type:'line', stack: 'other', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'充电中', type:'line', stack: 'other', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
}

// 实时车辆电量
var realPowerOption = {
    color:['#008F4C','#00B054','#09CA65','#59E39B','#C6EFD9'],
    tooltip: { trigger: 'axis', textStyle : { fontSize: 28, } },
    grid: { left: '5%', right: '5%', bottom: '8%', containLabel: true },
    legend: {
        data: ['100%-80%','80%-60%','60%-40%','40%-20%','20%-0%'],
        left:'center',
        bottom: 0,
        itemGap: 40,
        textStyle:{ color:'#647888', fontSize:27 }
    },
    xAxis: { type: 'category', axisLabel:{'fontSize':24}, data: [] },
    yAxis: { type: 'value', axisLabel:{'fontSize':24} },
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
    color: ['#09CA65','#F5A623','#0DB0FF','#FF7263','#C584FF','#4D68E5'],
    lineStyle: { width:20, color:'red' },
    textStyle: { color:'#647888', fontSize:30 },
    tooltip: { trigger: 'axis', textStyle: { fontSize: 28 } },
    grid: { top: "5%", bottom:"18%" },
    legend: {
        left: 'center',
        bottom: '1%',
        itemGap: 100,
        data:[
            { name:'下单量', icon: 'circle' },
            { name:'取车量', icon: 'circle' },
            { name:'取消订单', icon: 'circle' }
        ]
    },
    xAxis: { type: 'category', axisLabel:{'fontSize':24}, data: [] },
    yAxis: { type: 'value', axisLabel:{'fontSize':24} },
    series: [
        { name:'下单量', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'取车量', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] },
        { name:'取消订单', type:'line', smooth: true, lineStyle:{ normal:{width:lineWidth} }, data: [] }
    ]
}


// 实时新增用户
var realNewguyOption = {
    color: ['#09CA65','#F5A623','#0DB0FF','#FF7263','#C584FF','#4D68E5'],
    textStyle: { color:'#647888', fontSize:30 },
    tooltip: { trigger: 'axis', textStyle: { fontSize: 24 } },
    grid: { top: "5%", bottom:"18%" },
    legend: {
        left: 'center',
        bottom: '1%',
        itemGap: 10,
        data:[
            { name:'新增注册', icon: 'circle' },
            { name:'新增双证', icon: 'circle' },
            { name:'新增押金', icon: 'circle' },
            { name:'下单用户', icon: 'circle' },
            { name:'新增首单用户', icon: 'circle' }
        ]
    },
    xAxis: { type : 'category', axisLabel:{'fontSize':24}, data: [] },
    yAxis: { type: 'value', axisLabel:{'fontSize':24} },
    series: [
        { name:'新增注册', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'新增双证', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'新增押金', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'下单用户', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] },
        { name:'新增首单用户', type:'line', smooth: true, lineStyle:{ normal:{ width:lineWidth } }, data: [] }
    ]
};

// 完成度仪表盘
var gaugeOption = {
    tooltip: { show: false },
    series: [{
        name: '业务指标',
        type: 'gauge',
        detail: {formatter:'{value}%'},
        data: [{value: 0, name: '完成率'}]
    }]
};

// 周对比视图折线图
var weekLineOption = {
    color: [],
    tooltip: { trigger: 'axis', axisPointer: {type:'line'}, textStyle: {fontSize:'24'} },
    textStyle: { color:'#647888', fontSize: 30 },
    grid: { top:'10%', left: '4%', right: '5%', bottom: '10%', containLabel: true },
    legend: {
        top: 'bottom',
        itemGap: 70,
        data:['本周', '上周']
    },
    xAxis: {
        type: 'category',
        axisLabel: { fontSize: 26 },
        data: [ '周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value',
        axisLabel: { fontSize: 26 },
        min: function(v) {
            var vmin = v.min < 300 ? parseInt((v.min - 10)/10) * 10 :
                   v.min < 5000 ? parseInt((v.min - 100)/100) * 100  :
                   v.min < 10000 ? parseInt((v.min - 1000)/1000) * 1000 :
                   v.min < 50000 ? parseInt((v.min - 5000)/1000) * 1000 :
                   v.min < 100000 ? parseInt((v.min - 10000)/10000) * 10000 :
                   v.min < 500000 ? parseInt((v.min - 50000)/10000) * 10000 : parseInt((v.min - 100000)/100000) * 100000;
            return vmin;
        }
    },
    series: [
        { name:'本周', type:'line', smooth:true, lineStyle:{ normal:{ width:lineWidth } }, data:[] },
        { name:'上周', type:'line', smooth:true, lineStyle:{ normal:{ width:lineWidth } }, data:[] }
    ]
};

// 周对比视图柱状图
var weekBarOption = {
    color: ['#9be64d', '#11a05a'],
    tooltip: { trigger: 'axis', axisPointer: {type:'shadow'}, textStyle: {fontSize:'24'} },
    textStyle: { color:'#647888', fontSize:30 },
    grid: { top:'15%', left:'5%', right:'10%', bottom:'10%', containLabel:true },
    legend: {
        top: 'bottom',
        itemGap: 70,
        data:['本周', '上周']
    },
    xAxis: {
        type: 'category',
        axisLabel: { fontSize: 26 },
        data: [ '周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: { type:'value', axisLabel: {fontSize:26} },
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
      color:['#008F4C','#00B054','#09CA65','#59E39B','#98ecc0'],
      textStyle:{ fontSize:36 },
      tooltip: {
          trigger: 'item',
          textStyle : { fontSize: 28 },
          formatter: function (params) {
              var series = funnelOption.series[0].data;
              var pec = (params.data.value / series[series.length - 1].value * 100).toFixed(2);
              let pec_pre = params.dataIndex == (series.length - 1) ? 100 : (params.data.value / series[params.dataIndex + 1].value * 100).toFixed(2);
              return params.seriesName + '<br/>' +
                      params.data.name + ': ' +  params.data.value + '<br/>' +
                      '占注册用户比: ' + pec + '% <br/>' +
                      '占上层比: ' + pec_pre + '%';
          }
      },
      legend: {
          data: ['注册用户','双证','可用车','首单','老用户'],
          textStyle: { color: '#647888', fontSize: 24 },
          itemGap: 50,
          y:"bottom"
      },
      calculable: true,
      series: [
        {
            name:'用户转化',
            type:'funnel',
            top: '3%',
            left: '10%',
            width: '80%',
            // height: {totalHeight} - y - y2,
            // max: 100,  // 数值大于max宽度显示为100%
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
                normal: {
                    fontSize: 30,
                    show: true,
                    position: 'inside',
                    textStyle: { fontSize: 36, color:'#e29c12' },
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
                    textStyle: { fontSize: 36, color:'#f94343' }
                }
            },
            data: []
        }
    ]
};
