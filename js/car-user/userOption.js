// 用户转化漏斗图
var funnelOption = {
      color:['#008F4C','#00B054','#09CA65','#59E39B','#98ecc0'],
      textStyle:{ fontSize:36 },
      tooltip: {
          trigger: 'item',
          textStyle : { fontSize: 28 },
      },
      legend: {
          data: ['双证用户','可用车用户','注册用户','老用户','首单'],
          textStyle : {
              color: '#647888',
              fontFamily: 'Verdana, sans-serif',
              fontSize: 24,
              fontStyle: 'italic',
              fontWeight: 'bold'
          },
          y:"bottom"
      },
      calculable: true,
      series: [
        {
            name:'用户转化',
            type:'funnel',
            left: '15%',
            width: '70%',
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
                    formatter: function(param){
                        var series = funnelOption.series[0].data;
                        var key = param.dataIndex == 0 ? param.name : param.name.slice(0, param.name.length-2);
                        if (param.dataIndex == param.name.length) {
                            return param.name + ": " + (param.value ? param.value : '-') + "人";
                        } else if (param.dataIndex < funnelOption.series[0].data.length) {
                            var perc = (series[param.dataIndex].value / series[param.dataIndex+1].value * 100).toFixed(2);
                            return key +": " + (perc ? perc : '-') + '%';
                        }
                    }
                },
                emphasis: {
                    textStyle: {
                        fontSize: 36,
                        color:'#fff'
                    }
                }
            },
            data: []
        }
    ]
};

// 订单用户占比分析
var barOption = {
    color: ['#09CA65','#00F977','#D0DFEE','#FFC32B'],
    textStyle:{ color:'#fff', fontSize:26 },
    tooltip: {
        trigger: 'axis',
        fontStyle:{ fontSize:28 },
        textStyle:{ fontSize:30 },
        axisPointer: { type: 'shadow' },
        formatter: function(p) {
            p = p[1];
            let tmp = barOption.series[1].data;
            let sum = tmp[tmp.length - 1];
            let perc = (p.value / sum * 100).toFixed(2);
            return p.name + '<br/>' + p.value + '(' + perc + '%)';
        }
    },
    grid: { left: '5%', right: '5%', bottom: '5%', containLabel: true },
    xAxis: { type: 'category', axisLabel: {color: '#2e2e2e'}, splitLine: {show: false}, data: [] },
    yAxis: { type: 'value', axisLabel: {color: '#2e2e2e'} },
    series: [
        {
            name: 'support',
            type: 'bar',
            stack: 'stack',
            itemStyle: {
                normal: { barBorderColor: 'none', color: 'none' },
                emphasis: { barBorderColor: 'none', color: 'none' }
            },
            data: []
        },
        {
            name: '用户数',
            type: 'bar',
            stack: 'stack',
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: function(p) {
                        let tmp = barOption.series[1].data;
                        let sum = tmp[tmp.length - 1];
                        let perc = (p.value / sum * 100).toFixed(2);
                        return (p.name == '订单用户数' ? p.name : p.name == '上月老用户数' ? p.name.slice(0,p.name.length-1) : p.name.slice(0,p.name.length-3)) + '\n' + p.value + '\n' + perc + '%';
                    }
                }
            },
            data: []
        }
    ]
}
