// 订单用户占比分析
var pieOption = {
    color: ['#0DB95F','#09CA65','#00F977','#f1d591','#d6dc15','#FFC32B','#d2aa0c','#D0DFEE'],
    textStyle:{ color:'#647888', fontSize:30 },
    tooltip : {
        trigger: 'item',
        fontStyle:{ fontSize:28 },
        textStyle:{ fontSize:30 },
    },
    legend: { y:'bottom',data: []},
    grid:{ bottom:"0%" },
    series : [
        {
            name: '工单类型',
            type: 'pie',
            radius : '60%',
            center: ['50%', '33%'],
            label: {
                normal: { show: false, position: 'inside' },
            },
            data: [],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

var TREEMAP_CACHE = 0;
var treeOption = {
    color: ['#0DB95F','#86bcb6','#ffbe7e','#b17aa1','#59a14f','#88b772','#d2aa0c','#D0DFEE','#ff9c9a','#9fcaea','#f48e2c','#bab1ac','#796f6d','#b5992e','#fcbed3','#09CA65','#f1cd6c','#e2555b'],
    textStyle:{ color:'#647888', fontSize: 27 },
    tooltip: {
        trigger: 'item',
        fontStyle:{ fontSize:28 },
        textStyle:{ fontSize:30 },
        formatter: function(p){
            let perc = (p.value / TREEMAP_CACHE * 100).toFixed(2);
            return p.name + '<br/>' + p.value + "(" + perc + '%)';
        }
    },
    grid: { left:'3%', right:'3%', bottom:'50%', top: '3%' },
    series: [{
        name: '客服工单类型',
        type: 'treemap',
        // roam: false,
        // nodeClick: false,
        breadcrumb: { show: false, height: 0, emptyItemWidth: 0 },
        label: {
            normal: {
                show: true,
                formatter: function(p){
                    let perc = (p.value / TREEMAP_CACHE * 100).toFixed(2);
                    return p.name + '\n' + p.value + "(" + perc + '%)';
                }
            }
        },
        data: [{
            name: '',
            value: 0,
            children: []
        }]
    }]
}
