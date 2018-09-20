/**
 * Created: zhangfs by Atom.
 * Date: 2018/05/19
 */

var option = {
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
    textStyle:{ color:'#647888', fontSize:30 },
    tooltip : {
        trigger: 'axis',
        textStyle: {color:'#fff', fontSize:24 }
    },
    legend: { y: 'bottom' },
    grid: { top:'10%', bottom:'3%' },
    yAxis: { type: 'value', name: '百分比', axisLabel:{'fontSize':22} },
    xAxis: [{
        type: 'category',
        axisLabel: {'fontSize':22},
        data: []
    }],
    series: [
        { name:'上架率', data:[], type:'line', stack: '总量', areaStyle: {normal: {opacity:1}} },
        { name:'故障下架率', data:[], type:'line', stack: '总量', areaStyle: {normal: {opacity:1}} },
        { name:'低电下架率', data:[], type:'line', stack: '总量', areaStyle: {normal: {opacity:1}} },
        { name:'运维下架率', data:[], type:'line', stack: '总量', areaStyle: {normal: {opacity:1}} },
    ]
};


// 机车离线图
option1 = {
    color : ['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
    textStyle:{ color:'#647888', fontSize:30 },
    tooltip: {
        trigger: 'axis',
        textStyle: { color: '#fff', fontSize: 24 },
    },
    legend: { show:true, itemGap: 100 },
    grid:{ left: '10%', right:'10%' },
    yAxis: { axisLabel:{'fontSize':24}, type: 'value', name: '数量' },
    xAxis:  {
        axisLabel:{'fontSize':24},
        type: 'category',
        splitLine: {show: false},
        data: []
    },
    series: [{ name:'离线详情', data: [], type:'line', smooth: true, itemStyle: {lineStyle:{width:5}} }]
};


// 全部
var ctmOptionAll = {
      color:['#09CA65','#00F977','#FFC32B','#D0DFEE','#f1d591','#ff7b44'],
      textStyle: { color:'#647888', fontSize:30 },
      tooltip: {
          trigger: 'axis',
          textStyle: {color:'#fff', fontSize:24 }
      },
      grid:{ top: "5%", bottom:"3%" },
      legend: { itemGap: 50, y: 'bottom' },
      yAxis: [{ type : 'value', axisLabel:{ 'fontSize': 22 } }],
      xAxis: [{ type: 'category', axisLabel:{ 'fontSize': 22 }, data: [] }],
      series: [
        { name:'车均上架时长', data:[], type:'line', stack: 'All', areaStyle: {normal: {opacity:1}}},
        { name:'车均下架时长', data:[], type:'line', stack: 'All', areaStyle: {normal: {opacity:1}}},
        { name:'车均停运时长', data:[], type:'line', stack: 'All', areaStyle: {normal: {opacity:1}}}
      ]
}


// 上架
var ctmOptionOn = {
    color:['#09CA65','#00F977','#FFC32B','#D0DFEE','#f1d591','#ff7b44'],
    textStyle: { color:'#647888', fontSize:30 },
    tooltip: {
        trigger: 'axis',
        textStyle: {color:'#fff', fontSize:24 }
    },
    grid:{ top: "5%", bottom:"3%" },
    legend: { itemGap: 50, y: 'bottom' },
    yAxis: [{ type : 'value', axisLabel:{ 'fontSize': 22 } }],
    xAxis: { type: 'category', axisLabel:{'fontSize':22}, data: [] },
    series: [
      { name:'车均待租时长', data:[], type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}},
      { name:'车均服务时长', data:[], type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}},
      { name:'车均预约时长', data:[], type:'line', stack: 'on', areaStyle: {normal: {opacity:1}}}
    ]
};


// 下架
var ctmOptionOff = {
    color:['#09CA65','#00F977','#FFC32B','#D0DFEE','#f1d591','#ff7b44'],
    textStyle: { color:'#647888', fontSize:30 },
    tooltip: {
        trigger: 'axis',
        textStyle: {color:'#fff', fontSize:24 }
    },
    grid:{ top: "5%", bottom:"3%" },
    legend: { itemGap: 50, y: 'bottom' },
    yAxis: [{ type : 'value', axisLabel:{ 'fontSize': 22 } }],
    xAxis: { type: 'category', axisLabel: {'fontSize':22}, data: [] },
    series: [
      { name:'车均运维时长', data:[], type:'line', stack: 'off', areaStyle: {normal: {opacity:1}}},
      { name:'车均物料缺失时长', data:[], type:'line', stack: 'off', areaStyle: {normal: {opacity:1}}},
      { name:'车均机车离线时长', data:[], type:'line', stack: 'off', areaStyle: {normal: {opacity:1}}},
      { name:'车均其他原因时长', data:[], type:'line', stack: 'off', areaStyle: {normal: {opacity:1}}},
      { name:'车均低续航时长', data:[], type:'line', stack: 'off', areaStyle: {normal: {opacity:1}}},
      { name:'车均充电中时长', data:[], type:'line', stack: 'off', areaStyle: {normal: {opacity:1}}}
    ]
};
