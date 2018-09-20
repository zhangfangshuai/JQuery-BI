// dau漏斗图
var funnelOption = {
      color:['#98ecc0','#59E39B','#09CA65','#00B054'],
      tooltip: {
          trigger: 'item',
          textStyle : { fontSize: 28 },
      },
      legend: {
          data: [],
          textStyle : {
              color: '#647888',
              // decoration: 'none',
              fontFamily: 'Verdana, sans-serif',
              fontSize: 24,
              fontStyle: 'italic',
              fontWeight: 'bold'
          },
          y:"bottom"
      },
      grid:{
        top:"10%"
      },
      calculable: true,
      series: [
        {
            name:'DAU',
            type:'funnel',
            left: '10%',
            top: 60,
            bottom: 100,
            width: '80%',
            min: 0,
            // max: 100,  // 大于max宽度显示为100%
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 0,
            label: {
                normal: {
                    show: true,
                    fontSize: 30,
                    position: 'inside',
                    // formatter: '{b}',
                    formatter: function(param){
                        var series = funnelOption.series[0].data;
                        var key = param.name.slice(0, param.name.length-2);
                        if (param.dataIndex == 0) {
                            return key + ": " + (param.value ? param.value : '-') + "人次";
                        } else if (param.dataIndex < funnelOption.series[0].data.length) {
                            var perc = (series[param.dataIndex].value / series[param.dataIndex-1].value * 100).toFixed(2);
                            return key +": " + (isNaN(perc) ? '-' : perc) + '%';
                        }
                    }
                },
                emphasis: {
                    textStyle: {
                        fontSize: 32,
                        color:'#fff'
                    }
                }
            },
            data: []
        }
    ]
};
