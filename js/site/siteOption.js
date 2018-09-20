/**
 * Created with webstorm.
 * Author: dameng
 * Date: 2017/11/19
 * Time: 10:08
 *
 */

var lineWidth='4';
option = {
    // backgroundColor:'red',  //北京颜色
    color:['#00F977','#09CA65','#D0DFEE','#FFC32B','#ccc'],
    textStyle:{
        color:'#647888',
        fontSize:30
    },
    tooltip : {
        trigger: 'axis',
        textStyle : {
            color: '#fff',
            decoration: 'none',
            fontFamily: 'Verdana, sans-serif',
            fontSize: 24,
            fontStyle: 'italic',
            fontWeight: 'bold'
        },

    },
    legend: {
        data:[
                {
                    name:'服务中',
                    icon : 'bar'
                 },{
                    name:'待租',
                    icon : 'bar'
                },
                {
                    name:'低电下架',
                    icon : 'bar'
                },
                {
                    name:'运维下架',
                    icon : 'bar'
                },
                {
                    name:'预约中',
                    icon : 'bar'
                }
            ],
        x: 'center',               // 水平安放位置，默认为全图居中，可选为：
        // 'center' ¦ 'left' ¦ 'right'
        // ¦ {number}（x坐标，单位px）
        y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
        // 'top' ¦ 'bottom' ¦ 'center'
        // ¦ {number}（y坐标，单位px）
    },
    /* toolbox: {
        feature: {
            saveAsImage: {}
        }
    }, */
    // grid: {
    //     left: '3%',
    //     right: '4%',
    //     bottom: '14%',
    //     containLabel: true
    // },
    xAxis : [

        {
            type : 'category',
            data : [],
            axisLabel:{'fontSize':22}
        }

    ],
    yAxis : [
        {
            type : 'value',
            axisLabel:{'fontSize':22}
        }
    ],
    series : [
        {
            name:'服务中',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'待租',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'低电下架',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'运维下架',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {opacity:1}},
            data:[]
        },
        {
            name:'预约中',
            type:'line',
            stack: '总量',
            /* label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            }, */
            areaStyle: {normal: {opacity:1}},
            data:[]
          }
      ]
};
