/**
 * Created with webstorm.
 * Author: dameng
 * Date: 2017/11/19 10:08
 * Recode: zhangfs 2018/04/20 10:33
 */
var lineWidth='4';
option = {
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#00B74D','#FFAE29'],
    textStyle: {
        color:'#647888',
        fontSize:30
    },
    tooltip : {
        trigger: 'axis',
        textStyle : { fontSize: 24 }
    },
    grid:{
        top: "5%",
        bottom:"15%"
    },
    legend: {
        itemGap: 100,
        data:[{
            name:'上架',
            icon : 'circle'
         },{
            name:'下架',
            icon : 'circle'
        },
        {
            name:'其他车辆',
            icon : 'circle'
        }],
        x: 'center',
        y: 'bottom'
    },
    xAxis: {
        data : [],
        type : 'category',
        axisLabel:{ 'fontSize': 22 }
    },
    yAxis: [{
        type : 'value',
        axisLabel:{ 'fontSize': 22 }
    }],
    series : [{
            name:'上架',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },{
            name:'下架',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },{
            name:'其他车辆',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        }
    ]
};
// 上架
optionOn = {
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#00B74D','#FFAE29'],
    textStyle:{
        color:'#647888',
        fontSize:30
    },
    tooltip : {
        trigger: 'axis',
        textStyle: { fontSize: 24 },
    },
    grid:{
        top: "5%",
        bottom: "15%",
    },
    legend: {
        data:[
            {
                name:'待租',
                icon : 'circle'
            },{
                name:'已预订',
                icon : 'circle'
            },
            {
                name:'服务中-未取车',
                icon : 'circle'
            },
            {
                name:'服务中-已取车',
                icon : 'circle'
            }
        ],
        x: 'center',
        y: 'bottom'
    },
    xAxis: {
        type : 'category',
        data : [],
        axisLabel:{'fontSize':22}
    },
    yAxis: {
        type : 'value',
        axisLabel:{'fontSize':22}
    },
    series: [
        {
            name:'待租',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'已预订',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'服务中-未取车',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'服务中-已取车',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        }
    ]
};

// 下架
optionDown = {
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44','#ffda44','#beef5f'],
    textStyle:{
        color:'#647888',
        fontSize:30
    },
    tooltip : {
        trigger: 'axis',
        textStyle: { fontSize: 24 }
    },
    grid: { left:"10%", right: '3%', top: "5%", bottom:"30%" },
    legend: {
        data:[
            { name:'运维中', icon : 'circle' },
            { name:'充电中', icon : 'circle' },
            { name:'低续航', icon : 'circle' },
            { name:'车机离线', icon : 'circle' },
            { name:'物料缺失', icon : 'circle' },
            { name:'其他原因', icon : 'circle' },
            { name:'维修中', icon : 'circle' },
            { name:'事故出险', icon : 'circle' }
        ],
        y: 'bottom'
    },
    xAxis: { type : 'category', axisLabel: { 'fontSize': 22 }, data : [] },
    yAxis: { type : 'value', axisLabel: { 'fontSize': 22 } },
    series: [
        {
            name:'运维中',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'充电中',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'低续航',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'车机离线',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'物料缺失',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'其他原因',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'维修中',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'事故出险',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
    ]
};

optionOther = {
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#f1d591','#ff7b44'],
    textStyle:{ color:'#647888', fontSize:30 },
    tooltip : { trigger: 'axis', textStyle: { fontSize: 24 } },
    grid:{ top: "5%", bottom:"15%" },
    legend: {
        data:[
            { name:'整备中', icon : 'circle' },
            { name:'停止运营', icon : 'circle' }
        ],
        y: 'bottom'
    },
    xAxis: { type : 'category', axisLabel: { 'fontSize': 22 }, data : [] },
    yAxis: { type : 'value', axisLabel: { 'fontSize': 22 } },
    series: [
        { name:'整备中', type:'line', stack: '总量', areaStyle: {normal: {opacity:1}}, data:[] },
        { name:'充电中', type:'line', stack: '总量', areaStyle: {normal: {opacity:1}}, data:[] }
    ]
}

// 实时订单 折线图
option2 = {
    color : ['#09CA65','#F5A623','#0DB0FF','#FF7263','#C584FF','#4D68E5'],
    lineStyle:{
        width:20,
        color:'red'
    },
    textStyle:{
        color:'#647888',
        fontSize:30
    },
    tooltip: {
        trigger: 'axis',
        textStyle: { fontSize: 28 }
    },
    grid:{
        top: "5%",
        bottom:"15%"
    },
    legend: {
        show:true,
        itemGap: 100,
        data:[
          {
              name:'下单量',
              icon : 'bar'
          },{
              name:'取车量',
              icon : 'bar'
          },{
              name:'取消订单',
              icon : 'bar'
          }
        ],
        x: 'center',
        y: 'bottom'
    },

    xAxis: {
        type: 'category',
        axisLabel:{'fontSize':22},
        data: []
    },
    yAxis: {
        type: 'value',
        axisLabel:{'fontSize':22},
    },
    series: [
        {
            name:'下单量',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'取车量',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'取消订单',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        }
    ]
};

// 实时营收 折线图
option3 = {
    color:['#09CA65','#00F977','#D0DFEE','#FFC32B','#00B74D','#FFAE29'],
    textStyle:{
        color:'#647888',
        fontSize:30
    },
    tooltip: {
        trigger: 'axis', //坐标轴触发提示框，多用于柱状、折线图中
        textStyle : {
            fontSize: 24,
            fontStyle: 'italic',
            fontWeight: 'bold'
        },
    },
    legend: {	//图表上方的类别显示
        show:true,
        itemGap: 100,
        data:[
            { name:'收入', icon : 'circle' },
            { name:'收现', icon : 'circle' },
            { name:'优惠', icon : 'circle' },
            { name:'未结算', icon : 'circle' }
        ],
        x: 'center',
        y: 'bottom',
    },
    grid:{
        left: '13%',
        top:"5%",
        bottom:"15%"
    },

    xAxis:  {
        type : 'category',
        axisLabel:{'fontSize':22},
        data : []
    },
    yAxis: {
        type: 'value',
        axisLabel:{'fontSize':22}
    },
    series: [
        {
            name:'收入',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'收现',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'优惠',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'未结算',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        }
    ]
};

// 新增用户 折线图
option4 = {
    color : ['#09CA65','#F5A623','#0DB0FF','#FF7263','#C584FF','#4D68E5'],
    textStyle:{
        color:'#647888',
        fontSize:30
    },
    tooltip: {
        trigger: 'axis',
        textStyle: {
            fontSize: 24,
            fontStyle: 'italic',
            fontWeight: 'bold'
        },
    },
    grid:{
        top: "5%",
        bottom:"15%"
    },
    legend: {
        show: true,
        itemGap: 10,
        bottom: "20%" ,
        data:[
            { name:'新增注册', icon: 'circle' },
            { name:'新增双证', icon: 'circle' },
            { name:'新增押金', icon: 'circle' },
            { name:'下单用户', icon: 'circle' },
            { name:'新增首单用户', icon: 'circle' }
        ],
        x: 'center',
        y: 'bottom'
    },
    xAxis: {
        type : 'category',
        axisLabel:{'fontSize':22},
        data : []
    },
    yAxis: {
        type: 'value',
        axisLabel:{'fontSize':22}
    },
    series: [
        {
            name:'新增注册',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'新增双证',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'新增押金',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'下单用户',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        },
        {
            name:'新增首单用户',
            type:'line',
            smooth: true,
            data: [],
            itemStyle : {
                normal : {
                    lineStyle:{
                        width:lineWidth
                    }
                }
            },
        }
    ]
};

// 车辆电量
option5 = {
    color:['#008F4C','#00B054','#09CA65','#59E39B','#C6EFD9'],
    tooltip : {
        trigger: 'axis',
        textStyle : {
            fontSize: 28,
            fontStyle: 'italic',
        },
        tooltip : {
            trigger: 'axis',
            textStyle: { fontSize: 28 },
        },
    },
    legend: {
        data: ['0%-20%', '20%-40%','40%-60%','60%-80%','80%-100%'],
        textStyle:{
            color:'#647888',
            fontSize:24
        },
        y:'bottom',
        x:'center'
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '7%',
        containLabel: true
    },
    xAxis:  {
        type: 'category',
        data: [],
        axisLabel:{'fontSize':22}

    },
    yAxis: {
        type: 'value',
        axisLabel:{'fontSize':22}
    },
    series: [
        {
            name: '0%-20%',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: []
        },
        {
            name: '20%-40%',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: []
        },
        {
            name: '40%-60%',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: []
        },
        {
            name: '60%-80%',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: []
        },
        {
            name: '80%-100%',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: false,
                    position: 'insideRight'
                }
            },
            data: []
        }
    ]
};
